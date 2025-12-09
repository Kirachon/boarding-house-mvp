import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { RoomDataTable } from '@/components/features/owner/room-data-table'
import { RoomDialog } from '@/components/features/owner/room-dialog'
import { DashboardShell } from '@/components/shared/dashboard-shell'

export default async function RoomManagementPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // Fetch rooms
    const { data: rooms } = await supabase
        .from('rooms')
        .select('*')
        .order('name')

    return (
        <DashboardShell
            title="Room Management"
            subtitle="Create, update, and monitor rooms in your property."
            maxWidthClassName="max-w-5xl"
            action={(
                <RoomDialog mode="create" />
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
                    Rooms overview
                </h2>
                <RoomDataTable rooms={rooms || []} />
            </section>
        </DashboardShell>
    )
}
