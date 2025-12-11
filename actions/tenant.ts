'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Since we cannot use Admin API here without service key exposed to client (bad)
// we will simulate invitation by creating a user with a temp password.
// IN PROD: This should use Supabase Admin API via a secure backend route or Edge Function.

const InviteSchema = z.object({
    email: z.string().email("Invalid email address"),
    full_name: z.string().min(1, "Name is required"),
    room_id: z.string().min(1, "Room assignment is required")
})

export async function inviteTenant(formData: FormData) {
    const supabase = await createClient()

    // 1. Verify Owner
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.user_metadata.role !== 'owner') return { error: 'Unauthorized' }

    const rawData = {
        email: formData.get('email'),
        full_name: formData.get('full_name'),
        room_id: formData.get('room_id')
    }

    const validated = InviteSchema.safeParse(rawData)
    if (!validated.success) return { error: 'Invalid input', details: validated.error.flatten() }

    const { email, full_name, room_id } = validated.data
    const tempPassword = `Temp@${Math.floor(Math.random() * 10000)}!`

    // 2. Create Auth User (Simulated Invitation)
    // NOTE: In a real app, successful signUp returns null session if email confirm is on.
    // We assume email confirm is OFF for this demo or we catch the user id.

    // Check if user exists first to avoid error
    // For MVP, we'll try to sign them up. If they exist, we just link them? 
    // Supabase client-side signup logs you in, but server-side returns data.

    // IMPORTANT: standard 'signUp' logs the creator in if email confirm is disabled!
    // We must use Admin API for this to be correct, but we are in a server action.
    // We will use a workaround: Insert into profiles simply? No, need Auth ID.

    // WORKAROUND: For this MVP, we will ASSUME the user sends the link to the tenant manually.
    // We will creating a "Pending" record if we had a invites table.
    // CURRENT APPROACH: We will use the ADMIN client here for the sake of the demo, 
    // assuming we have the key in env. If not, this step fails.

    // FALLBACK: If no service key, we'll just fail gracefully or ask user to create account first.
    // Actually, we can use `supabase.auth.signUp` but we need to prevent auto-login.

    // Let's rely on standard practice: Use SERVICE_ROLE key for admin actions.
    // We will try to create a client with service role just for this action.

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceRoleKey) return { error: 'Server configuration error: Missing Service Key' }

    const adminSupabase = createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey)

    // A. Create User
    const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
        email: email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: { role: 'tenant', full_name: full_name }
    })

    if (authError) return { error: `Failed to create user: ${authError.message}` }
    const newUserId = authData.user.id

    // B. Create Profile (Trigger might do this, but let's be safe)
    // If trigger exists, this might error on duplicate. We'll upsert.
    const { error: profileError } = await adminSupabase.from('profiles').upsert({
        id: newUserId,
        role: 'tenant',
        full_name: full_name,
    })

    if (profileError) return { error: `Failed to create profile: ${profileError.message}` }

    // C. Create Assignment
    const { error: assignError } = await adminSupabase.from('tenant_room_assignments').insert({
        tenant_id: newUserId,
        room_id: room_id,
        start_date: new Date().toISOString()
    })

    if (assignError) return { error: `Failed to assign room: ${assignError.message}` }

    // D. Update Room Status
    await adminSupabase.from('rooms').update({ occupancy: 'occupied' }).eq('id', room_id)

    revalidatePath('/owner/tenants')
    revalidatePath('/owner/rooms')

    return { success: true, tempPassword }
}

export async function removeTenant(assignmentId: string, roomId: string) {
    const supabase = await createClient()

    // Verify Owner
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.user_metadata.role !== 'owner') return { error: 'Unauthorized' }

    // End assignment
    const { error } = await supabase.from('tenant_room_assignments')
        .update({ is_active: false, end_date: new Date().toISOString() })
        .eq('id', assignmentId)

    if (error) return { error: error.message }

    // Set Room to Vacant
    // Check if any other active assignments exist for this room? (Shared room support?)
    // For now, assume 1 room = vacant if this tenant leaves.
    await supabase.from('rooms').update({ occupancy: 'vacant' }).eq('id', roomId)

    revalidatePath('/owner/rooms')
    return { success: true }
}

export async function renewLease(assignmentId: string, newEndDate: string) {
    const supabase = await createClient()

    // Verify Owner
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.user_metadata.role !== 'owner') return { error: 'Unauthorized' }

    // Update assignment
    const { error } = await supabase.from('tenant_room_assignments')
        .update({ end_date: newEndDate })
        .eq('id', assignmentId)

    if (error) return { error: error.message }

    revalidatePath('/owner/tenants')
    return { success: true }
}
