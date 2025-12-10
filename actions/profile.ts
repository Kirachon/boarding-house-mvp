'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const profileSchema = z.object({
    full_name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().optional(),
    avatar_url: z.string().optional(),
    preferences: z.string().optional(), // JSON string
})

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const rawData = {
        full_name: formData.get('full_name'),
        phone: formData.get('phone'),
        avatar_url: formData.get('avatar_url'),
        preferences: formData.get('preferences'),
    }

    // Parse JSON preferences if present
    let preferences = {}
    try {
        if (rawData.preferences) {
            preferences = JSON.parse(rawData.preferences as string)
        }
    } catch (e) {
        console.error('Invalid preferences JSON', e)
    }

    const { error } = await supabase
        .from('profiles')
        .update({
            full_name: rawData.full_name as string,
            phone: rawData.phone as string,
            avatar_url: rawData.avatar_url as string,
            preferences: preferences,
            updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/owner/settings')
    revalidatePath('/tenant/profile')
    revalidatePath('/tenant/dashboard')

    return { success: true }
}

export async function getProfile() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (error) return null
    return data
}
