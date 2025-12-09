import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { TenantList } from '@/components/features/owner/tenant-list'
import { TenantDialog } from '@/components/features/owner/tenant-dialog'
import { DashboardShell } from '@/components/shared/dashboard-shell'

export default async function TenantManagementPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // Fetch active assignments with profile, room, and latest handover status
    const { data: assignments } = await supabase
        .from('tenant_room_assignments')
        .select(`
        *,
        profiles!inner(*),
        rooms!inner(*),
        room_handover_checklists!left(type, is_completed, completed_at)
    `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

    // Fetch rooms for dropdown
    const { data: rooms } = await supabase.from('rooms').select('*').order('name')

    // Cast weird type issue if necessary, or let implicit inference handle it if schemas match
    // The join type in supabase-js can be tricky. We'll cast in props if needed.

    return (
        <DashboardShell
            title="Tenant roster"
            subtitle="View active assignments and manage tenant room allocation."
            maxWidthClassName="max-w-5xl"
            action={(
                <TenantDialog rooms={rooms || []} />
            )}
        >
            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/owner/dashboard">
                    <Button variant="ghost" size="icon-sm" aria-label="Back to owner dashboard">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <span>Back to dashboard</span>
            </div>

            <section className="space-y-4">
                <h2 className="text-lg font-semibold tracking-tight">
                    Active tenants
                </h2>
                <TenantList assignments={assignments || []} />
            </section>
        </DashboardShell>
    )
}
