'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const InvoiceSchema = z.object({
    tenant_id: z.string().min(1, "Tenant is required"),
    amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
    due_date: z.string().min(1, "Due date is required"),
    description: z.string().min(1, "Description is required"),
})

export async function createInvoice(formData: FormData) {
    const supabase = await createClient()

    // Verify Owner
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.user_metadata.role !== 'owner') return { error: 'Unauthorized' }

    const rawData = {
        tenant_id: formData.get('tenant_id'),
        amount: formData.get('amount'),
        due_date: formData.get('due_date'),
        description: formData.get('description')
    }

    const validated = InvoiceSchema.safeParse(rawData)
    if (!validated.success) return { error: 'Invalid input', details: validated.error.flatten() }

    const { error } = await supabase.from('invoices').insert(validated.data)

    if (error) return { error: error.message }

    revalidatePath('/owner/finance')
    revalidatePath(`/tenant/dashboard`) // Ideally, we'd target specific user paths, but generic path revalidation usually works or specific realtime is better.
    // Since we can't easily revalidate dynamic paths for other users in server actions without their info known in context of path,
    // we rely on the tenant visiting the page to fetch fresh data.

    return { success: true }
}

export async function updateInvoiceStatus(invoiceId: string, status: 'paid' | 'unpaid' | 'cancelled') {
    const supabase = await createClient()

    // Verify Owner
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.user_metadata.role !== 'owner') return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('invoices')
        .update({ status: status })
        .eq('id', invoiceId)

    if (error) return { error: error.message }

    revalidatePath('/owner/finance')
    return { success: true }
}
