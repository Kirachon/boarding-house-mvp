'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { Database } from '@/types/supabase'

type GrievanceStatus = Database['public']['Enums']['grievance_status']

const GrievanceSchema = z.object({
    category: z.enum(['wifi', 'cleaning', 'maintenance', 'other']),
    description: z.string().min(10, "Description must be at least 10 characters"),
    photo_url: z.string().optional(),
})

export async function createGrievance(formData: FormData) {
    const supabase = await createClient()

    const rawData = {
        category: formData.get('category'),
        description: formData.get('description'),
        photo_url: formData.get('photo_url') || undefined,
    }

    const validated = GrievanceSchema.safeParse(rawData)

    if (!validated.success) {
        console.error("createGrievance: validation failed", validated.error);
        return { error: 'Invalid input data', details: validated.error.flatten() }
    }

    // Get current user (Tenant)
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        console.error("createGrievance: No user");
        return { error: 'Unauthorized' }
    }

    // Insert grievance
    const { error, data } = await supabase
        .from('grievances')
        .insert({
            tenant_id: user.id,
            category: validated.data.category,
            description: validated.data.description,
            photo_url: (validated.data.photo_url as string || null),
        })
        .select()

    if (error) {
        console.error("createGrievance: insert error", error);
        return { error: error.message }
    }

    revalidatePath('/tenant/dashboard')
    return { success: true }
}

export async function updateGrievanceStatus(id: string, newStatus: GrievanceStatus) {
    const supabase = await createClient()

    // Get current user and role
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user || user.user_metadata.role !== 'owner') {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('grievances')
        .update({ status: newStatus })
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/owner/dashboard')
    return { success: true }
}
