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

    // 1. Validate Input (Partial)
    const category = formData.get('category')
    const description = formData.get('description')
    const photoFile = formData.get('photo') as File | null

    const rawData = {
        category,
        description,
        photo_url: undefined // Placeholder
    }

    const validated = GrievanceSchema.safeParse(rawData)

    if (!validated.success) {
        console.error("createGrievance: validation failed", validated.error);
        return { error: 'Invalid input data', details: validated.error.flatten() }
    }

    // 2. Auth Check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Unauthorized' }
    }

    // 3. Handle File Upload (if exists)
    let photoUrl: string | null = null
    if (photoFile && photoFile.size > 0) {
        try {
            const fileExt = photoFile.name.split('.').pop()
            const fileName = `${user.id}/${Date.now()}.${fileExt}`
            const { error: uploadError, data } = await supabase.storage
                .from('grievance-attachments')
                .upload(fileName, photoFile)

            if (uploadError) {
                console.error("Upload Error:", uploadError)
                // Proceed without photo or return error? Let's return error to notify user.
                return { error: 'Failed to upload photo' }
            }

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('grievance-attachments')
                .getPublicUrl(fileName)

            photoUrl = publicUrl
        } catch (e) {
            console.error("File processing error", e)
            return { error: 'Failed to process file' }
        }
    }

    // 4. Insert into DB
    const { error } = await supabase
        .from('grievances')
        .insert({
            tenant_id: user.id,
            category: validated.data.category,
            description: validated.data.description,
            photo_url: photoUrl,
        })

    if (error) {
        console.error("createGrievance: insert error", error);
        return { error: error.message }
    }

    revalidatePath('/tenant/dashboard') // Update dashboard immediately
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
