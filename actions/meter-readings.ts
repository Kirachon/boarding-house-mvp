'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const MeterReadingSchema = z.object({
    room_id: z.string().uuid(),
    reading_date: z.string(),
    electricity_reading: z.coerce.number().min(0).optional(),
    water_reading: z.coerce.number().min(0).optional(),
})

export async function addMeterReading(formData: FormData) {
    const supabase = await createClient()

    // Verify Owner
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.user_metadata.role !== 'owner') return { error: 'Unauthorized' }

    const rawData = {
        room_id: formData.get('room_id'),
        reading_date: formData.get('reading_date'),
        electricity_reading: formData.get('electricity_reading'),
        water_reading: formData.get('water_reading'),
    }

    const validated = MeterReadingSchema.safeParse(rawData)
    if (!validated.success) return { error: 'Invalid input', details: validated.error.flatten() }

    const { error } = await supabase
        .from('meter_readings')
        .insert(validated.data)

    if (error) return { error: error.message }

    revalidatePath('/owner/rooms')
    return { success: true }
}

export async function deleteMeterReading(id: string) {
    const supabase = await createClient()

    // Verify Owner
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.user_metadata.role !== 'owner') return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('meter_readings')
        .delete()
        .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/owner/rooms')
    return { success: true }
}
