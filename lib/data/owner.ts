'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Owner Data Access Layer
 * Centralizes all data fetching for the Owner Dashboard
 */

export async function getOwnerDashboardData() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Fetch all core data for owner dashboard
    const [grievances, invoices, rooms, assignments, announcements, workOrders] = await Promise.all([
        supabase
            .from('grievances')
            .select('*')
            .order('created_at', { ascending: false }),

        supabase
            .from('invoices')
            .select('*')
            .order('due_date', { ascending: false }),

        supabase
            .from('rooms')
            .select('*, inventory_items (*)')
            .order('name'),

        supabase
            .from('tenant_room_assignments')
            .select(`
                id, start_date, end_date, lease_end, is_active,
                tenant:tenant_id(full_name),
                room:room_id(name)
            `)
            .eq('is_active', true)
            .order('lease_end', { ascending: true }),

        supabase
            .from('announcements')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5),

        supabase
            .from('work_orders')
            .select('status')
    ])

    return {
        grievances: grievances.data || [],
        invoices: invoices.data || [],
        rooms: rooms.data || [],
        assignments: assignments.data || [],
        announcements: announcements.data || [],
        workOrders: workOrders.data || [],
    }
}

export async function getOwnerFinanceMetrics() {
    const supabase = await createClient()

    const { data: invoices } = await supabase
        .from('invoices')
        .select('amount, status')

    const allInvoices = invoices || []
    const totalIncome = allInvoices
        .filter((i) => i.status === 'paid')
        .reduce((sum, i) => sum + Number(i.amount), 0)

    const outstanding = allInvoices
        .filter((i) => i.status === 'unpaid' || i.status === 'pending_verification')
        .reduce((sum, i) => sum + Number(i.amount), 0)

    const overdue = allInvoices
        .filter((i) => i.status === 'overdue')
        .reduce((sum, i) => sum + Number(i.amount), 0)

    const pendingCount = allInvoices.filter((i) => i.status === 'pending_verification').length

    return {
        totalIncome,
        outstanding,
        overdue,
        pendingCount
    }
}

export async function getOwnerOccupancyMetrics(rooms: any[]) {
    const totalRooms = rooms.length
    const occupiedRooms = rooms.filter(r => r.occupancy === 'occupied').length
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0

    return {
        totalRooms,
        occupiedRooms,
        occupancyRate
    }
}
