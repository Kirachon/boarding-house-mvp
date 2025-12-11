'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Local interface since notifications table may not be in generated types
interface NotificationInsert {
  user_id: string | null
  title: string
  message: string
  type?: string
  link?: string
  is_read?: boolean
}

export async function createInquiry(propertyId: string, formData: FormData) {
  const supabase = await createClient()

  const name = (formData.get('name') as string | null)?.trim()
  const contact = (formData.get('contact') as string | null)?.trim()
  const message = (formData.get('message') as string | null)?.trim()

  if (!name || !contact) {
    return { error: 'Name and contact are required' }
  }

  const { data: property } = await supabase
    .from('properties')
    .select('owner_id, name')
    .eq('id', propertyId)
    .single()

  if (!property) {
    return { error: 'Property not found' }
  }

  const notification: NotificationInsert = {
    user_id: property.owner_id,
    title: 'New guest inquiry',
    message: `Inquiry for "${property.name}" from ${name} (${contact}): ${message || ''}`,
    type: 'info',
    link: `/verify/${propertyId}`,
    is_read: false,
  }

  await supabase.from('notifications').insert(notification)

  revalidatePath(`/verify/${propertyId}`)
  return { success: true }
}
