'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { Database } from '@/types/supabase'

type WorkOrderStatus = Database['public']['Enums']['work_order_status']

const VendorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  services: z.string().optional(),
  notes: z.string().optional(),
})

export async function createVendor(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.user_metadata.role !== 'owner') {
    return { error: 'Unauthorized' }
  }

  const raw = {
    name: formData.get('name'),
    phone: formData.get('phone') || undefined,
    email: formData.get('email') || undefined,
    services: formData.get('services') || undefined,
    notes: formData.get('notes') || undefined,
  }

  const parsed = VendorSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: 'Invalid input', details: parsed.error.flatten() }
  }

  const { error } = await supabase.from('vendors').insert(parsed.data)
  if (error) {
    return { error: error.message }
  }

  revalidatePath('/owner/maintenance')
  return { success: true }
}

export async function createWorkOrderFromGrievance(grievanceId: string, roomId?: string | null) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.user_metadata.role !== 'owner') {
    return { error: 'Unauthorized' }
  }

  const { data: grievance, error: grievanceError } = await supabase
    .from('grievances')
    .select('*')
    .eq('id', grievanceId)
    .single()

  if (grievanceError || !grievance) {
    return { error: grievanceError?.message || 'Grievance not found' }
  }

  const title = `Maintenance: ${grievance.description.slice(0, 60)}${
    grievance.description.length > 60 ? '…' : ''
  }`

  const { error } = await supabase.from('work_orders').insert({
    grievance_id: grievance.id,
    tenant_id: grievance.tenant_id,
    room_id: roomId || null,
    title,
    description: grievance.description,
    priority: 'medium',
    status: 'open',
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/owner/maintenance')
  return { success: true }
}

export async function updateWorkOrderStatus(id: string, status: WorkOrderStatus) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.user_metadata.role !== 'owner') {
    return { error: 'Unauthorized' }
  }

  const updates: Record<string, any> = { status }
  if (status === 'completed') {
    updates.completed_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('work_orders')
    .update(updates)
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/owner/maintenance')
  return { success: true }
}

export async function assignVendorToWorkOrder(id: string, vendorId: string | null) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.user_metadata.role !== 'owner') {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('work_orders')
    .update({ vendor_id: vendorId })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/owner/maintenance')
  return { success: true }
}
