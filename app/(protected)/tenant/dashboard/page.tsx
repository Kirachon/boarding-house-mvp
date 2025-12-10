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
import { TenantDashboardHero } from '@/components/features/tenant/dashboard-hero'
import {
    getTenantDashboardData,
    getTenantGrievances,
    getTenantInvoices,
    getTenantWorkOrders,
    getActiveAnnouncements,
    getTenantLeaseDocuments
} from '@/lib/data/tenant'

export default async function TenantDashboardPage() {
    const dashboardData = await getTenantDashboardData()

    if (!dashboardData) redirect('/login')

    const { user, activeAssignment, roomName, leaseEnd, inventoryItems } = dashboardData

    const [grievances, invoices, announcements, workOrders, leaseDocuments] = await Promise.all([
        getTenantGrievances(user.id),
        getTenantInvoices(user.id),
        getActiveAnnouncements(),
        getTenantWorkOrders(user.id),
        getTenantLeaseDocuments(user.id)
    ])

    const unresolvedGrievances = grievances.filter(
        (g) => g.status === 'open' || g.status === 'in_progress'
    ).length

    const openWorkOrders = workOrders.filter(
        (w) => w.status === 'open' || w.status === 'in_progress' || w.status === 'waiting_vendor'
    ).length

    const pendingVerificationCount = invoices.filter(
        (i) => i.status === 'pending_verification'
    ).length

    const workOrderStatusesByGrievance: Record<string, Database['public']['Enums']['work_order_status']> = {}
    workOrders.forEach((w: any) => {
        if (w.grievance_id) {
            workOrderStatusesByGrievance[w.grievance_id] = w.status
        }
    })

    const nextDueInvoice = invoices
        .filter((invoice) => invoice.status === 'unpaid' || invoice.status === 'overdue')
        .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())[0]

    return (
        <DashboardShell
            title="Command Center"
            subtitle="Manage your stay"
            maxWidthClassName="max-w-[1600px]" // Wider container for Bento Grid
            action={(
                <form action={logout}>
                    <Button variant="ghost" size="sm" className="hover:bg-red-500/10 hover:text-red-500 transition-colors">
                        Sign Out
                    </Button>
                </form>
            )}
        >
            <div className="space-y-6 animate-in fade-in duration-500">

                {/* 1. Hero Section (Full Width) */}
                <TenantDashboardHero
                    userName={user.email?.split('@')[0] ?? 'Tenant'}
                    nextBillDate={nextDueInvoice?.due_date}
                    openIssuesCount={unresolvedGrievances + openWorkOrders}
                    leaseEndDate={leaseEnd}
                />

                {/* 2. Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6">

                    {/* Left Column: Quick Actions & Status (2 cols wide) */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Quick Actions Tile */}
                        <div className="bg-card/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
                            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Actions</h3>
                            <TenantQuickActions />
                        </div>

                        {/* Payment Verification Alert */}
                        {pendingVerificationCount > 0 && (
                            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 animate-pulse">
                                <p className="font-semibold text-sm">Action Required</p>
                                <p className="text-xs mt-1">
                                    {pendingVerificationCount} payment proof{pendingVerificationCount > 1 ? 's' : ''} verifying...
                                </p>
                            </div>
                        )}

                        {/* Bills Widget */}
                        <TenantCollapsibleSection id="bills-section" title="Bills & Payments">
                            <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                <TenantInvoiceList invoices={invoices} />
                            </div>
                        </TenantCollapsibleSection>
                    </div>

                    {/* Middle Column: Issues & Maintenance (2 cols wide on large screens) */}
                    <div className="md:col-span-2 lg:col-span-2 xl:col-span-3 space-y-6">
                        {/* Report Issue Widget */}
                        <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-card/50 to-background/50 backdrop-blur-md overflow-hidden relative group">
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl">Report Issue</CardTitle>
                                <CardDescription>One-click submission. We'll handle the rest.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <GrievanceForm />
                            </CardContent>
                        </div>

                        {/* Active Issues List */}
                        <TenantCollapsibleSection id="issues-section" title={`My Issues (${unresolvedGrievances})`}>
                            <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                <GrievanceList
                                    initialGrievances={grievances}
                                    userId={user.id}
                                    workOrderStatusesByGrievance={workOrderStatusesByGrievance}
                                />
                            </div>
                        </TenantCollapsibleSection>

                        {/* Work Orders */}
                        <TenantCollapsibleSection title={`Maintenance (${openWorkOrders})`}>
                            <div className="max-h-[300px] overflow-y-auto">
                                <WorkOrderList
                                    tenantId={user.id}
                                    initialWorkOrders={workOrders as any}
                                />
                            </div>
                        </TenantCollapsibleSection>
                    </div>

                    {/* Right Column: Info & Activity (Wider for readability) */}
                    <div className="md:col-span-2 lg:col-span-2 xl:col-span-2 space-y-6">

                        {/* Announcements */}
                        <div className="rounded-2xl bg-card/20 backdrop-blur-lg border border-white/5 p-4">
                            <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">News</h3>
                            <TenantAnnouncementList announcements={announcements} />
                        </div>

                        {/* Recent Activity Timeline */}
                        <div className="rounded-2xl bg-card/20 backdrop-blur-lg border border-white/5 p-4">
                            <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Timeline</h3>
                            <div className="max-h-[500px] overflow-y-auto text-xs">
                                <TenantActivityTimeline
                                    grievances={grievances}
                                    invoices={invoices}
                                    announcements={announcements}
                                    workOrders={workOrders as any}
                                />
                            </div>
                        </div>

                        {/* Room Info */}
                        <TenantCollapsibleSection title="My Room" defaultOpen={false}>
                            <TenantRoomInventory
                                roomName={roomName}
                                occupancy={activeAssignment?.room?.occupancy}
                                items={inventoryItems}
                            />
                            {activeAssignment && (
                                <form
                                    action={async () => {
                                        'use server'
                                        await completeHandoverChecklist('move_in')
                                    }}
                                    className="mt-3"
                                >
                                    <Button type="submit" variant="outline" size="sm" className="w-full text-xs h-8">
                                        Confirm Move-In
                                    </Button>
                                </form>
                            )}
                        </TenantCollapsibleSection>

                        {/* Documents */}
                        <TenantCollapsibleSection id="lease-section" title="Docs" defaultOpen={false}>
                            <TenantLeaseDocuments initialDocuments={leaseDocuments} />
                        </TenantCollapsibleSection>

                        {/* House Rules */}
                        <div className="rounded-2xl bg-card/20 backdrop-blur-lg border border-white/5 p-4">
                            <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">House rules</h3>
                            <TenantHouseRules />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardShell>
    )
}
