'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createAnnouncement(formData: FormData) {
    const supabase = await createClient()
    const title = formData.get('title') as string
    const content = formData.get('content') as string

    if (!title || !content) {
        return { error: 'Title and content are required' }
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('announcements')
        .insert({
            title,
            content,
            created_by: user.id
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/owner/dashboard')
    revalidatePath('/tenant/dashboard')
    return { success: true }
}

export async function toggleAnnouncement(id: string, isActive: boolean) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('announcements')
        .update({ is_active: isActive })
        .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/owner/dashboard')
    return { success: true }
}

export async function deleteAnnouncement(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/owner/dashboard')
    return { success: true }
}
