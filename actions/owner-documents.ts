'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Local interface since documents table may not be in generated types
interface DocumentInsert {
  tenant_id: string
  title: string
  type: string
  file_url: string
}

interface UserMetadata {
  role?: string
  [key: string]: unknown
}

export async function uploadLeaseDocument(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const role = (user?.user_metadata as UserMetadata | null)?.role
  if (!user || role !== 'owner') {
    return { error: 'Unauthorized' }
  }

  const tenantId = formData.get('tenant_id') as string | null
  const title = (formData.get('title') as string | null)?.trim()
  const file = formData.get('file') as File | null

  if (!tenantId || !title || !file) {
    return { error: 'Tenant, title, and file are required' }
  }

  const path = `${tenantId}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`

  const { error: uploadError } = await supabase.storage.from('documents').upload(path, file)
  if (uploadError) {
    return { error: uploadError.message }
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('documents').getPublicUrl(path)

  const payload: DocumentInsert = {
    tenant_id: tenantId,
    title,
    type: 'lease',
    file_url: publicUrl,
  }

  const { error } = await supabase.from('documents').insert(payload)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/owner/documents')
  revalidatePath('/tenant/dashboard')
  return { success: true }
}

export async function deleteLeaseDocument(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const role = (user?.user_metadata as UserMetadata | null)?.role
  if (!user || role !== 'owner') {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase.from('documents').delete().eq('id', id)
  if (error) {
    return { error: error.message }
  }

  revalidatePath('/owner/documents')
  return { success: true }
}
