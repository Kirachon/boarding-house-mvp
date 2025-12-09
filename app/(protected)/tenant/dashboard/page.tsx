import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

import { logout } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GrievanceForm } from '@/components/features/tenant/grievance-form'
import { GrievanceList } from '@/components/features/tenant/grievance-list'
import { TenantInvoiceList } from '@/components/features/tenant/tenant-invoice-list'
import { DashboardShell } from '@/components/shared/dashboard-shell'
import { WorkOrderList } from '@/components/features/tenant/work-order-list'
import { TenantAnnouncementList } from '@/components/features/tenant/announcement-list'
import { TenantRoomInventory } from '@/components/features/tenant/room-inventory'
import { TenantActivityTimeline } from '@/components/features/tenant/activity-timeline'
import { TenantLeaseDocuments } from '@/components/features/tenant/lease-documents'
import { TenantQuickActions } from '@/components/features/tenant/quick-actions'
import { TenantCollapsibleSection } from '@/components/features/tenant/collapsible-section'
import { TenantHouseRules } from '@/components/features/tenant/house-rules'
import { Database } from '@/types/supabase'
import { completeHandoverChecklist } from '@/actions/tenant-checklist'

export default async function TenantDashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

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

    // Fetch initial grievances
    const { data: grievances } = await supabase
        .from('grievances')
        .select('*')
        .eq('tenant_id', user.id)
        .order('created_at', { ascending: false })

    // Fetch invoices
    const { data: invoices } = await supabase
        .from('invoices')
        .select('*')
        .eq('tenant_id', user.id)
        .order('created_at', { ascending: false })

    const { data: announcements } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(5)

    const { data: inventoryItems } = roomId
        ? await supabase
            .from('inventory_items')
            .select('*')
            .eq('room_id', roomId)
            .order('name')
        : { data: null as any }

    const { data: leaseDocuments } = await supabase
        .from('documents')
        .select('*')
        .eq('tenant_id', user.id)
        .eq('type', 'lease')
        .order('created_at', { ascending: false })

    const { data: workOrders } = await supabase
        .from('work_orders')
        .select(`
        *,
        room:rooms (
            id,
            name
        )
    `)
        .eq('tenant_id', user.id)
        .order('created_at', { ascending: false })

    const unresolvedGrievances = (grievances || []).filter(
        (g) => g.status === 'open' || g.status === 'in_progress'
    ).length

    const openWorkOrders = (workOrders || []).filter(
        (w) => w.status === 'open' || w.status === 'in_progress' || w.status === 'waiting_vendor'
    ).length

    const pendingVerificationCount = (invoices || []).filter(
        (i) => i.status === 'pending_verification'
    ).length

    const latestAnnouncement = (announcements || [])[0]

    const resolvedGrievances = (grievances || []).filter((g) => g.status === 'resolved')
    let averageResolutionDays: number | null = null
    if (resolvedGrievances.length > 0) {
        const totalDays = resolvedGrievances.reduce((sum, g) => {
            const created = new Date(g.created_at).getTime()
            const updated = new Date(g.updated_at).getTime()
            const diffDays = Math.max(0, (updated - created) / (1000 * 60 * 60 * 24))
            return sum + diffDays
        }, 0)
        averageResolutionDays = totalDays / resolvedGrievances.length
    }

    const workOrderStatusesByGrievance: Record<string, Database['public']['Enums']['work_order_status']> = {}
    ;(workOrders || []).forEach((w: any) => {
        if (w.grievance_id) {
            workOrderStatusesByGrievance[w.grievance_id] = w.status
        }
    })

    const nextDueInvoice = invoices
        ?.filter((invoice) => invoice.status === 'unpaid' || invoice.status === 'overdue')
        .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())[0]

    return (
        <DashboardShell
            title="My Home"
            subtitle="Manage your stay"
            maxWidthClassName="max-w-3xl"
            action={(
                <form action={logout}>
                    <Button variant="ghost" size="sm">
                        Sign Out
                    </Button>
                </form>
            )}
        >
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Welcome back</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                        <p className="text-sm text-muted-foreground">
                            {activeAssignment
                                ? `You are currently assigned to ${roomName ?? "a room"}.`
                                : "You are not currently assigned to a room."}
                        </p>
                        {leaseStart && (
                            <p>
                                Lease period:&nbsp;
                                {new Date(leaseStart).toLocaleDateString()}
                                {leaseEnd && (' - ' + new Date(leaseEnd).toLocaleDateString())}
                            </p>
                        )}
                        <p>
                            {nextDueInvoice
                                ? `Next bill is due on ${new Date(nextDueInvoice.due_date).toLocaleDateString()}.`
                                : "You have no upcoming bills right now."}
                        </p>
                        <p>
                            Open issues: {unresolvedGrievances} grievance
                            {unresolvedGrievances === 1 ? '' : 's'} and {openWorkOrders} work order
                            {openWorkOrders === 1 ? '' : 's'}.
                        </p>
                        {averageResolutionDays !== null && (
                            <p className="text-xs">
                                Your resolved issues are typically closed in{" "}
                                {averageResolutionDays.toFixed(1)} day
                                {averageResolutionDays >= 1.5 ? 's' : ''}.
                            </p>
                        )}
                        {latestAnnouncement ? (
                            <p>
                                Latest announcement:{' '}
                                <span className="font-medium">{latestAnnouncement.title}</span>
                            </p>
                        ) : (
                            <p>All clear: no active announcements right now.</p>
                        )}
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-2">
                    {pendingVerificationCount > 0 && (
                        <p className="text-xs text-blue-600 bg-blue-50 border border-blue-100 rounded-md px-3 py-2">
                            You have {pendingVerificationCount} payment proof
                            {pendingVerificationCount > 1 ? 's' : ''} awaiting owner verification.
                        </p>
                    )}
                    <TenantQuickActions />
                </div>

                <TenantCollapsibleSection id="bills-section" title="Bills &amp; payments">
                    <TenantInvoiceList invoices={invoices || []} />
                </TenantCollapsibleSection>

                <TenantCollapsibleSection id="lease-section" title="Lease documents">
                    <TenantLeaseDocuments initialDocuments={leaseDocuments || []} />
                </TenantCollapsibleSection>

                <TenantCollapsibleSection title="House announcements">
                    <TenantAnnouncementList announcements={announcements || []} />
                    <div className="mt-3">
                        <TenantHouseRules />
                    </div>
                </TenantCollapsibleSection>

                <TenantCollapsibleSection title="My room &amp; inventory">
                    <TenantRoomInventory
                        roomName={roomName}
                        occupancy={activeAssignment?.room?.occupancy}
                        items={inventoryItems || []}
                    />
                    {activeAssignment && (
                        <form
                            action={async () => {
                                'use server'
                                await completeHandoverChecklist('move_in')
                            }}
                            className="mt-3 text-xs text-muted-foreground flex items-center justify-between gap-2"
                        >
                            <span>
                                Once you&apos;ve checked everything in your room, mark the move-in
                                checklist as complete.
                            </span>
                            <Button type="submit" variant="outline" size="sm">
                                Confirm move-in checklist
                            </Button>
                        </form>
                    )}
                </TenantCollapsibleSection>

                <TenantCollapsibleSection id="issues-section" title="My issues">
                    <Card>
                        <CardHeader>
                            <CardTitle>Report an issue</CardTitle>
                            <CardDescription>
                                Something wrong? Let us know and we&apos;ll fix it.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <GrievanceForm />
                        </CardContent>
                    </Card>
                    <div className="rounded-xl border bg-card p-4 mt-3">
                        <GrievanceList
                            initialGrievances={grievances || []}
                            userId={user.id}
                            workOrderStatusesByGrievance={workOrderStatusesByGrievance}
                        />
                    </div>
                </TenantCollapsibleSection>

                <TenantCollapsibleSection title="Maintenance work orders">
                    <div className="rounded-xl border bg-card p-4">
                        <WorkOrderList
                            tenantId={user.id}
                            initialWorkOrders={(workOrders as any) || []}
                        />
                    </div>
                </TenantCollapsibleSection>

                <TenantCollapsibleSection title="Recent activity">
                    <TenantActivityTimeline
                        grievances={grievances || []}
                        invoices={invoices || []}
                        announcements={announcements || []}
                        workOrders={(workOrders as any) || []}
                    />
                </TenantCollapsibleSection>
            </div>
        </DashboardShell>
    )
}
