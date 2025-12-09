import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { DashboardShell } from '@/components/shared/dashboard-shell'
import { MaintenanceBoard } from '@/components/features/owner/maintenance-board'
import { VendorDialog } from '@/components/features/owner/vendor-dialog'

export default async function MaintenancePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: grievances } = await supabase
    .from('grievances')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: workOrders } = await supabase
    .from('work_orders')
    .select(
      `
        *,
        room:rooms (
          id, name
        ),
        vendor:vendors (
          id, name
        )
      `.trim()
    )
    .order('created_at', { ascending: false })

  const { data: vendors } = await supabase
    .from('vendors')
    .select('*')
    .order('name', { ascending: true })

  const { data: rooms } = await supabase
    .from('rooms')
    .select('*')
    .order('name', { ascending: true })

  return (
    <DashboardShell
      title="Maintenance & vendors"
      subtitle="Track maintenance tickets, work orders, and preferred vendors."
      maxWidthClassName="max-w-6xl"
      action={<VendorDialog />}
    >
      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/owner/dashboard">
          <Button variant="ghost" size="icon-sm" aria-label="Back to owner dashboard">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <span>Back to dashboard</span>
      </div>

      <MaintenanceBoard
        grievances={grievances || []}
        workOrders={(workOrders as any) || []}
        vendors={vendors || []}
        rooms={rooms || []}
      />
    </DashboardShell>
  )
}
