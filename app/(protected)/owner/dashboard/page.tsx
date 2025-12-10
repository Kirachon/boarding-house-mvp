import { redirect } from 'next/navigation'
import { AlertTriangle, TrendingUp, Wrench } from 'lucide-react'

import { logout } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { OwnerGrievanceList } from '@/components/features/owner/owner-grievance-list'
import { RoomHealthGrid } from '@/components/features/owner/room-health-grid'
import { DashboardShell } from '@/components/shared/dashboard-shell'
import { MetricCard } from '@/components/shared/metric-card'
import { FinanceOverview } from '@/components/features/owner/finance-overview'
import { QuickActions } from '@/components/features/owner/quick-actions'
import { AnnouncementWidget } from '@/components/features/owner/announcement-widget'
import { LeaseExpiryAlert } from '@/components/features/owner/lease-expiry-alert'
import { ActivityTimeline } from '@/components/features/owner/activity-timeline'
import { CalendarWidget } from '@/components/features/owner/calendar-widget'
import { OccupancySparkline } from '@/components/features/owner/occupancy-sparkline'
import { Database } from '@/types/supabase'
import { getOwnerDashboardData, getOwnerFinanceMetrics, getOwnerOccupancyMetrics } from '@/lib/data/owner'
import { createClient } from '@/lib/supabase/server'

export default async function OwnerDashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // Fetch all data using DAL
    const dashboardData = await getOwnerDashboardData()
    if (!dashboardData) redirect('/login')

    const { grievances, invoices, rooms, assignments, announcements, workOrders } = dashboardData

    // Calculate metrics
    const financeMetrics = await getOwnerFinanceMetrics()
    const occupancyMetrics = await getOwnerOccupancyMetrics(rooms)
    const activeGrievances = grievances.filter(g => g.status === 'open' || g.status === 'in_progress').length
    const openWorkOrders = workOrders.filter(
        (w) => w.status === 'open' || w.status === 'in_progress' || w.status === 'waiting_vendor'
    ).length

    // Transform assignments for type safety
    type AssignmentRow = Database['public']['Tables']['tenant_room_assignments']['Row'] & {
        tenant?: { full_name: string | null } | { full_name: string | null }[] | null
        room?: { name: string | null } | { name: string | null }[] | null
        rooms?: { name: string | null } | null
    }

    const transformedAssignments: AssignmentRow[] = assignments.map((item) => {
        const raw = item as AssignmentRow
        const tenant = Array.isArray(raw.tenant) ? raw.tenant[0] : raw.tenant
        const room = Array.isArray(raw.room) ? raw.room[0] : raw.room

        return {
            ...raw,
            tenant,
            room,
            rooms: room ?? null,
        }
    })

    return (
        <DashboardShell
            title="Owner Command Center"
            subtitle="Property performance at a glance"
            maxWidthClassName="max-w-[1800px]"
            action={
                <form action={logout}>
                    <Button variant="outline" size="sm">Sign Out</Button>
                </form>
            }
        >
            <div className="space-y-6">
                {/* Quick Actions */}
                <QuickActions />

                {/* Finance Overview - Full Width */}
                <FinanceOverview
                    totalIncome={financeMetrics.totalIncome}
                    outstanding={financeMetrics.outstanding}
                    overdue={financeMetrics.overdue}
                    pendingCount={financeMetrics.pendingCount}
                />

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6">

                    {/* Property Vitals - 3 columns on desktop */}
                    <div className="md:col-span-2 lg:col-span-2">
                        <MetricCard
                            label="Occupancy Rate"
                            value={`${occupancyMetrics.occupancyRate}%`}
                            helperText={`${occupancyMetrics.occupiedRooms}/${occupancyMetrics.totalRooms} rooms occupied`}
                            icon={<TrendingUp className={occupancyMetrics.occupancyRate > 80 ? "text-emerald-500" : "text-amber-500"} />}
                        >
                            <OccupancySparkline rooms={rooms} />
                        </MetricCard>
                    </div>

                    <div className="md:col-span-1 lg:col-span-2">
                        <MetricCard
                            label="Active Issues"
                            value={activeGrievances}
                            helperText={activeGrievances > 0 ? "Requires attention" : "All good"}
                            icon={<AlertTriangle className={activeGrievances > 0 ? "text-amber-500" : "text-green-500"} />}
                        />
                    </div>

                    <div className="md:col-span-1 lg:col-span-2">
                        <MetricCard
                            label="Open Work Orders"
                            value={openWorkOrders}
                            helperText={openWorkOrders > 0 ? "In progress" : "No maintenance"}
                            icon={<Wrench className={openWorkOrders > 0 ? "text-blue-500" : "text-slate-400"} />}
                        />
                    </div>

                    {/* Room Status - Wide Section */}
                    <div className="md:col-span-4 lg:col-span-4">
                        <div className="space-y-3">
                            <h2 className="text-lg font-semibold tracking-tight">Room Status Overview</h2>
                            <RoomHealthGrid rooms={rooms} />
                        </div>
                    </div>

                    {/* Right Sidebar - Calendar & Activity */}
                    <div className="md:col-span-4 lg:col-span-2 space-y-6">
                        <CalendarWidget
                            invoices={invoices}
                            assignments={transformedAssignments}
                        />

                        <ActivityTimeline
                            grievances={grievances}
                            invoices={invoices}
                            announcements={announcements}
                        />

                        <LeaseExpiryAlert assignments={transformedAssignments} />
                    </div>

                    {/* Announcements Widget */}
                    <div className="md:col-span-2 lg:col-span-3">
                        <div className="h-[350px]">
                            <AnnouncementWidget announcements={announcements} />
                        </div>
                    </div>

                    {/* Grievances List */}
                    <div className="md:col-span-2 lg:col-span-3">
                        <div className="space-y-3">
                            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                Support Inbox
                            </h2>
                            <OwnerGrievanceList initialGrievances={grievances} />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardShell>
    )
}
