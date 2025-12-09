'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const RoomSchema = z.object({
    name: z.string().min(1, "Room name is required"),
    price: z.coerce.number().min(0, "Price must be positive"),
    capacity: z.coerce.number().int().min(1, "Capacity must be at least 1"),
    property_id: z.string().optional() // Optional for now as we might infer or set defaults
})

export async function createRoom(formData: FormData) {
    const supabase = await createClient()

    // Verify Owner
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.user_metadata.role !== 'owner') {
        return { error: 'Unauthorized' }
    }

    // Get Property ID (assuming single property for now, or passed in form)
    // For MVP, we will fetch the first property owned by this user
    const { data: property } = await supabase.from('properties').select('id').eq('owner_id', user.id).single()

    if (!property) {
        return { error: 'No property found. Please create a property first.' } // Should technically be seeded
    }

    const rawData = {
        name: formData.get('name'),
        price: formData.get('price'),
        capacity: formData.get('capacity'),
        property_id: property.id
    }

    const validated = RoomSchema.safeParse(rawData)

    if (!validated.success) {
        return { error: 'Invalid input', details: validated.error.flatten() }
    }

    const { error } = await supabase.from('rooms').insert(validated.data)

    if (error) return { error: error.message }

    revalidatePath('/owner/rooms')
    return { success: true }
}

export async function updateRoom(id: string, formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.user_metadata.role !== 'owner') return { error: 'Unauthorized' }

    const rawData = {
        name: formData.get('name'),
        price: formData.get('price'),
        capacity: formData.get('capacity'),
    }

    const validated = RoomSchema.partial().safeParse(rawData)
    if (!validated.success) return { error: 'Invalid input' }

    const { error } = await supabase
        .from('rooms')
        .update(validated.data)
        .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/owner/rooms')
    return { success: true }
}

export async function deleteRoom(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.user_metadata.role !== 'owner') return { error: 'Unauthorized' }

    const { error } = await supabase.from('rooms').delete().eq('id', id)
    if (error) return { error: error.message }

    revalidatePath('/owner/rooms')
    return { success: true }
}
