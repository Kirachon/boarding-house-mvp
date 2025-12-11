'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const PasswordSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

export async function updatePassword(formData: FormData) {
    const rawData = {
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword')
    }

    const validated = PasswordSchema.safeParse(rawData)

    if (!validated.success) {
        return { error: 'Invalid input', details: validated.error.flatten() }
    }

    const supabase = await createClient()

    const { error } = await supabase.auth.updateUser({
        password: validated.data.password
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}
