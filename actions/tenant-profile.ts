'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateTenantProfile(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const fullName = (formData.get('full_name') as string | null)?.trim() || null

  const { error } = await supabase
    .from('profiles')
    .update({ full_name: fullName })
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/tenant/profile')
  revalidatePath('/tenant/dashboard')
  return { success: true }
}

