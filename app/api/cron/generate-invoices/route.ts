import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    // Use Admin client to bypass RLS since Cron is a system user
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const today = new Date().toISOString().split('T')[0]

    // 1. Fetch due recurring settings
    const { data: dueSettings, error: fetchError } = await supabase
        .from('recurring_invoice_settings')
        .select(`
            *,
            tenant_room_assignments (
                id,
                tenant_id,
                rooms (*)
            )
        `)
        .eq('is_active', true)
        .lte('next_run_date', today)

    if (fetchError) {
        return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    if (!dueSettings?.length) {
        return NextResponse.json({ message: 'No invoices due' })
    }

    const results = {
        processed: 0,
        errors: 0,
        logs: [] as string[]
    }

    // 2. Process each due setting
    for (const setting of dueSettings) {
        try {
            // @ts-ignore
            const assignment = setting.tenant_room_assignments
            if (!assignment || !assignment.rooms) {
                // Determine if we should deactivate settings for broken assignments?
                results.logs.push(`Skipping setting ${setting.id}: Invalid assignment structure`)
                continue
            }

            const currentRunDate = new Date(setting.next_run_date)
            const monthName = currentRunDate.toLocaleString('default', { month: 'long' })
            const year = currentRunDate.getFullYear()
            const description = `${setting.job_name} for ${monthName} ${year}`

            // a. Create Invoice
            const { error: invoiceError } = await supabase
                .from('invoices')
                .insert({
                    tenant_id: assignment.tenant_id,
                    amount: setting.amount,
                    due_date: setting.next_run_date,
                    description: description,
                    status: 'unpaid'
                })

            if (invoiceError) throw new Error(invoiceError.message)

            // b. Notify Tenant
            await supabase.from('notifications').insert({
                user_id: assignment.tenant_id,
                title: 'New Invoice',
                message: `You have a new invoice for ${description} of ₱${setting.amount}.`,
                type: 'info'
            })

            // c. Update Next Run Date
            // We use the day_of_month preference, but increment the month from the current "next_run_date"
            // This ensures if the job runs late (e.g. 5 days overdue), it still schedules for the correct NEXT month, not skipping one.
            const nextDate = new Date(currentRunDate)
            nextDate.setMonth(nextDate.getMonth() + 1)
            // Ensure day is correct (in case of 31st logic, but we capped at 28)
            nextDate.setDate(setting.day_of_month)

            const nextRunDateStr = nextDate.toISOString().split('T')[0]

            await supabase
                .from('recurring_invoice_settings')
                .update({
                    next_run_date: nextRunDateStr,
                    updated_at: new Date().toISOString()
                })
                .eq('id', setting.id)

            results.processed++
            results.logs.push(`Generated invoice for tenant ${assignment.tenant_id}: ${description}`)

        } catch (e: any) {
            results.errors++
            results.logs.push(`Error processing setting ${setting.id}: ${e.message}`)
        }
    }

    return NextResponse.json(results)
}
