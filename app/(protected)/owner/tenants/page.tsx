import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { TenantList } from '@/components/features/owner/tenant-list'
import { TenantDialog } from '@/components/features/owner/tenant-dialog'
import { DashboardShell } from '@/components/shared/dashboard-shell'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Fix: Page props type
type PageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function TenantManagementPage({ searchParams }: PageProps) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const params = await searchParams
    const mode = (params.tab as string) === 'history' ? 'history' : 'active'
    const isActive = mode === 'active'

    // Fetch assignments based on mode
    const { data: assignments } = await supabase
        .from('tenant_room_assignments')
        .select(`
        *,
        profiles!inner(*),
        rooms!inner(*),
        room_handover_checklists!left(type, is_completed, completed_at)
    `)
        .eq('is_active', isActive)
        .order('created_at', { ascending: false })

    // Fetch rooms for dropdown (only needed for active view really, but dialog is global)
    const { data: rooms } = await supabase.from('rooms').select('*').order('name')

    return (
        <DashboardShell
            title="Tenant roster"
            subtitle="View active assignments and manage tenant room allocation."
            maxWidthClassName="max-w-5xl"
            action={(
                <TenantDialog rooms={rooms || []} />
            )}
        >
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Link href="/owner/dashboard">
                        <Button variant="ghost" size="icon-sm" aria-label="Back to owner dashboard">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <span>Back to dashboard</span>
                </div>
            </div>

            <Tabs defaultValue={mode} className="w-full">
                <TabsList className="mb-4 bg-muted/60 p-1">
                    <Link href="/owner/tenants">
                        <TabsTrigger value="active" className="cursor-pointer">Active Tenants</TabsTrigger>
                    </Link>
                    <Link href="/owner/tenants?tab=history">
                        <TabsTrigger value="history" className="cursor-pointer">History</TabsTrigger>
                    </Link>
                </TabsList>

                <TabsContent value="active" className="mt-0">
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold tracking-tight">Active tenants</h2>
                        </div>
                        <TenantList assignments={assignments || []} mode="active" />
                    </section>
                </TabsContent>

                <TabsContent value="history" className="mt-0">
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold tracking-tight text-muted-foreground">Past Tenant History</h2>
                        </div>
                        <TenantList assignments={assignments || []} mode="history" />
                    </section>
                </TabsContent>
            </Tabs>

        </DashboardShell>
    )
}
