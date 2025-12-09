'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function completeHandoverChecklist(type: 'move_in' | 'move_out') {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Find latest active assignment to link room if available
  const { data: assignments } = await supabase
    .from('tenant_room_assignments')
    .select('id, room_id, is_active')
    .eq('tenant_id', user.id)
    .eq('is_active', true)
    .order('start_date', { ascending: false })
    .limit(1)

  const roomId = assignments?.[0]?.room_id ?? null

  const now = new Date().toISOString()

  const { error } = await supabase
    .from('room_handover_checklists')
    .upsert(
      {
        tenant_id: user.id,
        room_id: roomId,
        type,
        is_completed: true,
        completed_at: now,
      },
      {
        onConflict: 'tenant_id, room_id, type',
      } as any
    )

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/tenant/dashboard')
  return { success: true }
}

