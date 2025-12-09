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
    // We can't easily revalidate the specific tenant's dashboard from here without knowing their path or using tags
    // But since it's a new invoice, they'll see it on next load.

    return { success: true }
}

export async function updateInvoiceStatus(invoiceId: string, status: 'paid' | 'unpaid' | 'cancelled' | 'pending_verification') {
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

export async function uploadPaymentProof(invoiceId: string, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const file = formData.get('proof') as File
    if (!file) return { error: 'No file uploaded' }

    // Upload to Storage
    const fileExt = file.name.split('.').pop()
    const filePath = `${user.id}/${invoiceId}-${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
        .from('payment_proofs')
        .upload(filePath, file)

    if (uploadError) return { error: uploadError.message }

    // Get Public URL
    const { data: { publicUrl } } = supabase.storage
        .from('payment_proofs')
        .getPublicUrl(filePath)

    // Update Invoice
    const { error: dbError } = await supabase
        .from('invoices')
        .update({
            status: 'pending_verification',
            proof_image_url: publicUrl
        })
        .eq('id', invoiceId)
        .eq('tenant_id', user.id) // Security check: Ensure they own the invoice

    if (dbError) return { error: dbError.message }

    revalidatePath('/tenant/dashboard')
    return { success: true }
}

export async function verifyPayment(invoiceId: string, approved: boolean) {
    const supabase = await createClient()

    // Verify Owner
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.user_metadata.role !== 'owner') return { error: 'Unauthorized' }

    const updates = approved
        ? { status: 'paid' }
        : { status: 'unpaid' } // Reverting to unpaid, maybe we keep the proof url or clear it? Keeping it allows seeing history maybe.

    // If rejected, we might want to clear the proof URL so they can upload again, or keep it as record?
    // Let's keep it simple: if rejected, set to unpaid, keep URL (so they see what they uploaded), 
    // but maybe they will overlay a new one.

    const { error } = await supabase
        .from('invoices')
        .update(updates as any)
        .eq('id', invoiceId)

    if (error) return { error: error.message }

    revalidatePath('/owner/finance')
    return { success: true }
}
