import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AlertTriangle, Users, TrendingUp } from 'lucide-react'

import { logout } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { OwnerGrievanceList } from '@/components/features/owner/owner-grievance-list'
import { RoomHealthGrid } from '@/components/features/owner/room-health-grid'
import { RoomAvailabilityPanel } from '@/components/features/owner/room-availability-panel'
import { DashboardShell } from '@/components/shared/dashboard-shell'
import { MetricCard } from '@/components/shared/metric-card'
import { FinanceOverview } from '@/components/features/owner/finance-overview'
import { QuickActions } from '@/components/features/owner/quick-actions'
import { AnnouncementWidget } from '@/components/features/owner/announcement-widget'
import { LeaseExpiryAlert } from '@/components/features/owner/lease-expiry-alert'

export default async function OwnerDashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // 1. Fetch Grievances
    const { data: grievances } = await supabase
        .from('grievances')
        .select('*')
        .order('created_at', { ascending: true })

    // 2. Fetch Invoices for Finance
    const { data: invoices } = await supabase
        .from('invoices')
        .select('*')
        .order('due_date', { ascending: false })

    // 3. Fetch Rooms
    const { data: rooms } = await supabase
        .from('rooms')
        .select(`*, inventory_items (*)`)
        .order('name')

    // 4. Fetch Active Assignments (for Leases)
    const { data: assignmentData } = await supabase
        .from('tenant_room_assignments')
        .select(`
            id, start_date, end_date, lease_end, is_active,
            tenant:tenant_id(full_name),
            room:room_id(name)
        `)
        .eq('is_active', true)
        .order('lease_end', { ascending: true })

    // 5. Fetch Announcements
    const { data: announcements } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

    // Calculations
    const activeCount = grievances?.filter(g => g.status === 'open' || g.status === 'in_progress').length || 0

    // Finance Calculations
    const allInvoices = invoices || []
    const totalIncome = allInvoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + Number(i.amount), 0)
    const outstanding = allInvoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + Number(i.amount), 0)
    const overdue = allInvoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + Number(i.amount), 0)

    // Occupancy
    const totalRooms = rooms?.length || 0
    const occupiedRooms = rooms?.filter(r => r.occupancy === 'occupied').length || 0
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0

    // Transform assignments safely
    const assignments = (assignmentData || []).map((item: any) => ({
        ...item,
        tenant: Array.isArray(item.tenant) ? item.tenant[0] : item.tenant,
        room: Array.isArray(item.room) ? item.room[0] : item.room,
    }))

    return (
        <DashboardShell
            title="Owner Command Center"
            subtitle="Overview of property performance and alerts."
            action={(
                <form action={logout}>
                    <Button variant="outline" size="sm">Sign Out</Button>
                </form>
            )}
        >
            <div className="space-y-6">
                {/* Top Section: Quick Actions & Finance */}
                <div className="flex flex-col gap-6">
                    <QuickActions />
                    <FinanceOverview
                        totalIncome={totalIncome}
                        outstanding={outstanding}
                        overdue={overdue}
                    />
                </div>

                {/* Main Grid Layout */}
                <div className="grid gap-6 lg:grid-cols-3">

                    {/* Left Column (2/3) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Property Vitals */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <MetricCard
                                label="Occupancy Rate"
                                value={`${occupancyRate}%`}
                                helperText={`${occupiedRooms}/${totalRooms} rooms occupied`}
                                icon={<TrendingUp />}
                            />
                            <MetricCard
                                label="Active Issues"
                                value={activeCount}
                                helperText={activeCount > 0 ? "Requires attention" : "All good"}
                                icon={<AlertTriangle className={activeCount > 0 ? "text-amber-500" : "text-green-500"} />}
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold tracking-tight">Room Status</h2>
                            </div>
                            <RoomHealthGrid rooms={rooms || []} />
                        </div>

                        <div className="hidden lg:block">
                            {/* Hide Availability Panel on mobile/default if redundant, or keep it */}
                            <RoomAvailabilityPanel rooms={rooms || []} />
                        </div>
                    </div>

                    {/* Right Column (1/3) - Sidebar Widgets */}
                    <div className="space-y-6">
                        <LeaseExpiryAlert assignments={assignments} />

                        <div className="h-[300px]">
                            <AnnouncementWidget announcements={announcements || []} />
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                Support Inbox
                            </h2>
                            <OwnerGrievanceList initialGrievances={grievances || []} />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardShell>
    )
}
