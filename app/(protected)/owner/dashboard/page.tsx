import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AlertTriangle, Users } from 'lucide-react'

import { logout } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { OwnerGrievanceList } from '@/components/features/owner/owner-grievance-list'
import { RoomHealthGrid } from '@/components/features/owner/room-health-grid'
import { RoomAvailabilityPanel } from '@/components/features/owner/room-availability-panel'
import { StayTimeline } from '@/components/features/owner/stay-timeline'
import { DashboardShell } from '@/components/shared/dashboard-shell'
import { MetricCard } from '@/components/shared/metric-card'
import { FinanceSummary } from '@/components/features/owner/finance-summary'
import { Plus, UserPlus, FileText } from 'lucide-react'
import Link from 'next/link'

export default async function OwnerDashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // Fetch all active grievances
    const { data: grievances } = await supabase
        .from('grievances')
        .select('*')
        .select('*')
        .order('created_at', { ascending: true })

    // Fetch invoices for Finance Summary
    const { data: invoices } = await supabase
        .from('invoices')
        .select('*')
        .order('due_date', { ascending: false })

    // Fetch rooms with inventory (Deep Fetch)
    const { data: rooms } = await supabase
        .from('rooms')
        .select(`
      *,
      inventory_items (*)
    `)
        .order('name')

    const activeCount = grievances?.filter(g => g.status === 'open' || g.status === 'in_progress').length || 0

    // Calculate Occupancy
    const totalRooms = rooms?.length || 0
    const occupiedRooms = rooms?.filter(r => r.occupancy === 'occupied').length || 0
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0

    // Fetch active and recent tenant stays
    const { data: assignmentData } = await supabase
        .from('tenant_room_assignments')
        .select(`
        id,
        start_date,
        end_date,
        is_active,
        tenant:tenant_id(full_name),
        room:room_id(name)
    `)
        .order('start_date', { ascending: false })
        .limit(12)

    // Transform data to match component expectations (handle potential array returns from joins)
    const assignments = (assignmentData || []).map((item: any) => ({
        ...item,
        tenant: Array.isArray(item.tenant) ? item.tenant[0] : item.tenant,
        room: Array.isArray(item.room) ? item.room[0] : item.room,
    }))

    return (
        <DashboardShell
            title="Owner Command Center"
            subtitle={`Welcome back, ${user.email}`}
            action={(
                <form action={logout}>
                    <Button variant="outline" size="sm">
                        Sign Out
                    </Button>
                </form>
            )}
        >
            <div className="space-y-8">
                {/* Quick Actions Row */}
                <div className="flex flex-wrap gap-2">
                    <Link href="/owner/tenants">
                        <Button className="gap-2 shadow-sm">
                            <UserPlus size={16} /> Add Tenant
                        </Button>
                    </Link>
                    <Link href="/owner/finance">
                        <Button variant="secondary" className="gap-2 shadow-sm">
                            <FileText size={16} /> Create Invoice
                        </Button>
                    </Link>
                    <Link href="/owner/rooms">
                        <Button variant="outline" className="gap-2 shadow-sm">
                            <Plus size={16} /> Add Room
                        </Button>
                    </Link>
                </div>

                {/* Financial Overview */}
                <FinanceSummary invoices={invoices || []} />

                <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                    <Card>
                        <CardHeader>
                            <CardTitle>Property Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                <MetricCard
                                    label="Active Issues"
                                    value={activeCount}
                                    helperText={activeCount > 0
                                        ? "Prioritize open and in-progress grievances today."
                                        : "You're all clear. No active issues right now."}
                                    icon={<AlertTriangle />}
                                />
                                <MetricCard
                                    label="Occupancy"
                                    value={`${occupancyRate}%`}
                                    helperText={`${occupiedRooms} of ${totalRooms} rooms occupied.`}
                                    icon={<Users />}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <RoomAvailabilityPanel rooms={rooms || []} />
                </div>

                <div className="grid items-start gap-8 lg:grid-cols-3">
                    <div className="space-y-4 lg:col-span-2">
                        <div className="space-y-3">
                            <h2 className="text-lg font-semibold tracking-tight">
                                Living Inventory
                            </h2>
                            <RoomHealthGrid rooms={rooms || []} />
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-lg font-semibold tracking-tight">
                                Stays
                            </h2>
                            <StayTimeline assignments={assignments} />
                        </div>
                    </div>

                    <div className="space-y-3 lg:col-span-1">
                        <h2 className="text-lg font-semibold tracking-tight">
                            Grievance Inbox
                        </h2>
                        <OwnerGrievanceList initialGrievances={grievances || []} />
                    </div>
                </div>
            </div>
        </DashboardShell>
    )
}
