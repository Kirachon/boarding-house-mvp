'use server'

import { createClient } from '@/lib/supabase/server'

export interface ChatUser {
    id: string
    full_name: string | null
    avatar_url: string | null
    role: string
}

export async function getAvailableUsersForChat(): Promise<{ data?: ChatUser[], error?: string }> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    // Get current user's role
    const role = (user.user_metadata as { role?: string } | null)?.role

    if (!role) return { error: 'User role not found' }

    try {
        let query = supabase.from('profiles').select('id, full_name, avatar_url, role')

        if (role === 'owner') {
            // Owners can chat with Tenants
            // Ideally, only tenants assigned to their properties, but for now allow all tenants
            // or check assignments.
            // Let's stick to "Tenants" for simplicity as requested, 
            // but strictly we should filter by assignments if we want to be "correct".
            // Given the MVP nature, fetching all profiles with role 'tenant' is a good start.
            query = query.eq('role', 'tenant')
        } else if (role === 'tenant') {
            // Tenants can chat with Owners
            query = query.eq('role', 'owner')
        } else {
            // Admins can maybe chat with everyone?
            // query = query.neq('id', user.id)
            return { data: [] } // Strict for now
        }

        const { data: users, error } = await query

        if (error) {
            console.error('Error fetching users for chat:', error)
            return { error: 'Failed to fetch users' }
        }

        return {
            data: (users as ChatUser[]).map(u => ({
                ...u,
                full_name: u.full_name || (u.role === 'owner' ? 'Landlord' : 'Unknown User')
            }))
        }
    } catch (error) {
        console.error('Unexpected error:', error)
        return { error: 'An unexpected error occurred' }
    }
}
