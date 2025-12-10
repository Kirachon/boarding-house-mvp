import { Database } from '@/types/supabase'

export type UserRole = Database['public']['Enums']['user_role']

export function getDashboardPath(role: UserRole | string | null | undefined): string {
    switch (role) {
        case 'owner':
            return '/owner/dashboard'
        case 'tenant':
            return '/tenant/dashboard'
        default:
            return '/' // Or a specific guest landing page
    }
}
