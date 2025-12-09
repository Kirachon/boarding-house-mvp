import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

import { logout } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GrievanceForm } from '@/components/features/tenant/grievance-form'
import { GrievanceList } from '@/components/features/tenant/grievance-list'
import { TenantInvoiceList } from '@/components/features/tenant/tenant-invoice-list'
import { DashboardShell } from '@/components/shared/dashboard-shell'

export default async function TenantDashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

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

    // Fetch current room assignment (if any)
    const { data: activeAssignments } = await supabase
        .from('tenant_room_assignments')
        .select(`
        id,
        start_date,
        end_date,
        is_active,
        room:room_id(name)
    `)
        .eq('tenant_id', user.id)
        .eq('is_active', true)
        .order('start_date', { ascending: false })
        .limit(1)

    const activeAssignment = activeAssignments?.[0] as any
    const roomName = Array.isArray(activeAssignment?.room)
        ? activeAssignment.room[0]?.name
        : activeAssignment?.room?.name

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
                    <CardContent className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            {activeAssignment
                                ? `You are currently assigned to ${roomName ?? "a room"}.`
                                : "You are not currently assigned to a room."}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {nextDueInvoice
                                ? `Next bill is due on ${new Date(nextDueInvoice.due_date).toLocaleDateString()}.`
                                : "You have no upcoming bills right now."}
                        </p>
                    </CardContent>
                </Card>

                <section className="space-y-3">
                    <h2 className="text-lg font-semibold tracking-tight">
                        Bills &amp; payments
                    </h2>
                    <TenantInvoiceList invoices={invoices || []} />
                </section>

                <section className="space-y-3">
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
                </section>

                <section className="space-y-3">
                    <h2 className="text-lg font-semibold tracking-tight">
                        My reports
                    </h2>
                    <div className="rounded-xl border bg-card p-4">
                        <GrievanceList
                            initialGrievances={grievances || []}
                            userId={user.id}
                        />
                    </div>
                </section>
            </div>
        </DashboardShell>
    )
}
