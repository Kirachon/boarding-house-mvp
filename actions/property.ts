'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { Database } from '@/types/supabase'

type PropertyInsert = Database['public']['Tables']['properties']['Insert']
type PropertyUpdate = Database['public']['Tables']['properties']['Update']

interface UserMetadata {
  role?: string
  [key: string]: unknown
}

const PropertySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  description: z.string().optional(),
  amenities: z
    .string()
    .optional()
    .transform((value) =>
      value
        ? value
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean)
        : [],
    ),
  is_verified: z
    .string()
    .optional()
    .transform((v) => v === 'on' || v === 'true'),
})

export async function createProperty(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const role = (user?.user_metadata as UserMetadata | null)?.role
  if (!user || role !== 'owner') {
    return { error: 'Unauthorized' }
  }

  const parsed = PropertySchema.safeParse({
    name: formData.get('name'),
    address: formData.get('address'),
    city: formData.get('city'),
    description: formData.get('description'),
    amenities: formData.get('amenities'),
    is_verified: formData.get('is_verified'),
  })

  if (!parsed.success) {
    return { error: 'Invalid input', details: parsed.error.flatten() }
  }

  const payload = {
    ...parsed.data,
    owner_id: user.id,
  } as any

  const { error } = await supabase.from('properties').insert(payload)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/owner/properties')
  return { success: true }
}

export async function updateProperty(id: string, formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const role = (user?.user_metadata as UserMetadata | null)?.role
  if (!user || role !== 'owner') {
    return { error: 'Unauthorized' }
  }

  const parsed = PropertySchema.safeParse({
    name: formData.get('name'),
    address: formData.get('address'),
    city: formData.get('city'),
    description: formData.get('description'),
    amenities: formData.get('amenities'),
    is_verified: formData.get('is_verified'),
  })

  if (!parsed.success) {
    return { error: 'Invalid input', details: parsed.error.flatten() }
  }

  const updatePayload = parsed.data as any

  const { error } = await supabase
    .from('properties')
    .update(updatePayload)
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/owner/properties')
  return { success: true }
}

export async function deleteProperty(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const role = (user?.user_metadata as UserMetadata | null)?.role
  if (!user || role !== 'owner') {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/owner/properties')
  return { success: true }
}
