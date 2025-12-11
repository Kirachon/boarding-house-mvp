import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/shared/dashboard-shell'
import { Button } from '@/components/ui/button'
import { TenantRoomInventory } from '@/components/features/tenant/room-inventory'
import { completeHandoverChecklist } from '@/actions/tenant-checklist'
import { Database } from '@/types/supabase'

export default async function TenantRoomPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: activeAssignments } = await supabase
    .from('tenant_assignments')
    .select(
      `
      id,
      start_date,
      end_date,
      lease_start,
      lease_end,
      is_active,
      room_id,
      room:room_id(name, occupancy)
    `.trim(),
    )
    .eq('tenant_id', user.id)
    .eq('is_active', true)
    .order('start_date', { ascending: false })
    .limit(1)

  type AssignmentRow = Database['public']['Tables']['tenant_assignments']['Row'] & {
    room?:
    | Database['public']['Tables']['rooms']['Row']
    | Database['public']['Tables']['rooms']['Row'][]
    | null
  }

  const activeAssignment = (activeAssignments?.[0] ?? null) as AssignmentRow | null
  const roomName = Array.isArray(activeAssignment?.room)
    ? activeAssignment.room[0]?.name
    : activeAssignment?.room?.name

  const roomId = activeAssignment?.room_id ?? undefined

  let inventoryItems: Database['public']['Tables']['inventory_items']['Row'][] = []

  if (roomId) {
    const { data } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('room_id', roomId)
      .order('name')

    inventoryItems = data || []
  }

  return (
    <DashboardShell
      title="My room & inventory"
      subtitle="Review the items in your room and confirm your move-in/out checklist."
      maxWidthClassName="max-w-3xl"
    >
      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/tenant/dashboard">
          <Button variant="ghost" size="icon-sm" aria-label="Back to tenant home">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <span>Back to home</span>
      </div>

      <div className="space-y-4">
        <TenantRoomInventory
          roomName={roomName}
          occupancy={
            Array.isArray(activeAssignment?.room)
              ? (activeAssignment?.room[0] as any)?.occupancy ?? (activeAssignment?.room[0] as any)?.occupancy_status
              : (activeAssignment?.room as any)?.occupancy ?? (activeAssignment?.room as any)?.occupancy_status
          }
          items={inventoryItems}
        />

        {activeAssignment && (
          <div className="space-y-3 text-xs text-muted-foreground">
            <form
              action={async () => {
                'use server'
                await completeHandoverChecklist('move_in')
              }}
              className="flex items-center justify-between gap-2"
            >
              <span>Once you&apos;ve checked everything in your room, confirm your move-in.</span>
              <Button type="submit" variant="outline" size="sm">
                Confirm move-in checklist
              </Button>
            </form>

            <form
              action={async () => {
                'use server'
                await completeHandoverChecklist('move_out')
              }}
              className="flex items-center justify-between gap-2"
            >
              <span>
                When you are ready to leave and the room is returned, confirm your move-out
                checklist.
              </span>
              <Button type="submit" variant="outline" size="sm">
                Confirm move-out checklist
              </Button>
            </form>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
