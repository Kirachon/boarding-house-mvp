import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/supabase'

export type DashboardData = {
    user: any
    activeAssignment: any
    roomName: string | undefined
    leaseStart: string | undefined
    leaseEnd: string | undefined
    roomId: string | undefined
    inventoryItems: any[]
}

export async function getTenantDashboardData(): Promise<DashboardData | null> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Fetch current room assignment (if any)
    const { data: activeAssignments } = await supabase
        .from('tenant_room_assignments')
        .select(`
            id,
            start_date,
            end_date,
            lease_start,
            lease_end,
            is_active,
            room_id,
            room:room_id(name, occupancy)
        `)
        .eq('tenant_id', user.id)
        .eq('is_active', true)
        .order('start_date', { ascending: false })
        .limit(1)

    const activeAssignment = activeAssignments?.[0] as any
    const roomName = Array.isArray(activeAssignment?.room)
        ? activeAssignment.room[0]?.name
        : activeAssignment?.room?.name

    const leaseStart = activeAssignment?.lease_start || activeAssignment?.start_date
    const leaseEnd = activeAssignment?.lease_end || activeAssignment?.end_date
    const roomId = activeAssignments?.[0]?.room_id as string | undefined

    // Fetch inventory if room exists
    const { data: inventoryItems } = roomId
        ? await supabase
            .from('inventory_items')
            .select('*')
            .eq('room_id', roomId)
            .order('name')
        : { data: [] }

    return {
        user,
        activeAssignment,
        roomName,
        leaseStart,
        leaseEnd,
        roomId,
        inventoryItems: inventoryItems || []
    }
}

export async function getTenantGrievances(userId: string) {
    const supabase = createClient()
    const { data } = await (await supabase)
        .from('grievances')
        .select('*')
        .eq('tenant_id', userId)
        .order('created_at', { ascending: false })
    return data || []
}

export async function getTenantInvoices(userId: string) {
    const supabase = await createClient()
    const { data } = await supabase
        .from('invoices')
        .select('*')
        .eq('tenant_id', userId)
        .order('created_at', { ascending: false })
    return data || []
}

export async function getTenantWorkOrders(userId: string) {
    const supabase = await createClient()
    const { data } = await supabase
        .from('work_orders')
        .select(`
            *,
            room:rooms (id, name)
        `)
        .eq('tenant_id', userId)
        .order('created_at', { ascending: false })
    return data || []
}

export async function getActiveAnnouncements() {
    const supabase = await createClient()
    const { data } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(5)
    return data || []
}

export async function getTenantLeaseDocuments(userId: string) {
    const supabase = await createClient()
    const { data } = await supabase
        .from('documents')
        .select('*')
        .eq('tenant_id', userId)
        .eq('type', 'lease')
        .order('created_at', { ascending: false })
    return data || []
}
