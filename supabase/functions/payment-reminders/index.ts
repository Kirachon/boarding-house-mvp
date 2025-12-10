import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Create a Supabase client with the Auth context of the logged in user.
        const supabaseClient = createClient(
            // Supabase API URL - env var automatically populated by Supabase.
            Deno.env.get('SUPABASE_URL') ?? '',
            // Supabase API ANON KEY - env var automatically populated by Supabase.
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
            {
                global: {
                    headers: { Authorization: req.headers.get('Authorization')! },
                },
            }
        )

        // 1. Get today's date for comparison
        const today = new Date()
        const todayStr = today.toISOString().split('T')[0] // YYYY-MM-DD

        // Calculate target dates
        const sevenDaysFromNow = new Date(today)
        sevenDaysFromNow.setDate(today.getDate() + 7)
        const sevenDaysStr = sevenDaysFromNow.toISOString().split('T')[0]

        const threeDaysAgo = new Date(today)
        threeDaysAgo.setDate(today.getDate() - 3)
        const threeDaysAgoStr = threeDaysAgo.toISOString().split('T')[0]

        console.log(`Checking for invoices matching: 7days=${sevenDaysStr}, today=${todayStr}, overdue=${threeDaysAgoStr}`)

        // 2. Query Invoices
        const { data: invoices, error: invoiceError } = await supabaseClient
            .from('invoices')
            .select(`
        id,
        amount,
        due_date,
        status,
        tenant_id,
        profiles:tenant_id (
          email,
          full_name,
          reminder_email_enabled
        )
      `)
            .neq('status', 'paid')
            .neq('status', 'cancelled')
            .in('due_date', [sevenDaysStr, todayStr, threeDaysAgoStr])

        if (invoiceError) throw invoiceError

        console.log(`Found ${invoices?.length || 0} candidate invoices`)

        if (!invoices || invoices.length === 0) {
            return new Response(JSON.stringify({ message: 'No invoices require reminders' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            })
        }

        const results = []

        // 3. Process each invoice
        for (const invoice of invoices) {
            // Determine reminder type
            let type = null
            if (invoice.due_date === sevenDaysStr) type = '7_days_before'
            else if (invoice.due_date === todayStr) type = 'due_date'
            else if (invoice.due_date === threeDaysAgoStr) type = '3_days_overdue'

            if (!type) continue

            // Check if already sent
            const { data: existing } = await supabaseClient
                .from('payment_reminders_sent')
                .select('id')
                .eq('invoice_id', invoice.id)
                .eq('reminder_type', type)
                .single()

            if (existing) {
                console.log(`Skipping invoice ${invoice.id}: ${type} reminder already sent`)
                continue
            }

            // Check user preference
            // @ts-ignore
            const profile = invoice.profiles
            if (profile && profile.reminder_email_enabled === false) {
                console.log(`Skipping invoice ${invoice.id}: user disabled reminders`)
                continue
            }

            // 4. Send Email (Mocked for now, can replace with Resend/SendGrid)
            // TODO: Integrate Resend API here
            console.log(`SENDING EMAIL to ${profile?.email} for Invoice ${invoice.id} (${type})`)
            // Simulate API call
            // await resend.emails.send({ ... })

            // 5. Log as sent
            const { error: insertError } = await supabaseClient
                .from('payment_reminders_sent')
                .insert({
                    invoice_id: invoice.id,
                    reminder_type: type
                })

            if (insertError) {
                console.error(`Failed to log reminder for ${invoice.id}`, insertError)
            } else {
                results.push({ invoice: invoice.id, type, sent: true })
            }
        }

        return new Response(JSON.stringify({ processed: results.length, details: results }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        })
    }
})
