import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/shared/dashboard-shell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { GrievanceForm } from '@/components/features/tenant/grievance-form'
import { GrievanceList } from '@/components/features/tenant/grievance-list'
import { WorkOrderList } from '@/components/features/tenant/work-order-list'
import { Database } from '@/types/supabase'

export default async function TenantIssuesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: grievances } = await supabase
    .from('grievances')
    .select('*')
    .eq('tenant_id', user.id)
    .order('created_at', { ascending: false })

  const { data: workOrders } = await supabase
    .from('work_orders')
    .select(
      `
      *,
      room:rooms (
        id,
        name
      )
    `.trim(),
    )
    .eq('tenant_id', user.id)
    .order('created_at', { ascending: false })

  type WorkOrder = Database['public']['Tables']['work_orders']['Row'] & {
    room?: Database['public']['Tables']['rooms']['Row'] | null
  }

  const workOrderStatusesByGrievance: Record<
    string,
    Database['public']['Enums']['work_order_status']
  > = {}

  const typedWorkOrders: WorkOrder[] = (workOrders || []) as unknown as WorkOrder[]

  typedWorkOrders.forEach((w) => {
    const gId = (w as any).grievance_id
    if (gId) {
      workOrderStatusesByGrievance[gId] = w.status ?? 'open'
    }
  })

  return (
    <DashboardShell
      title="Issues & maintenance"
      subtitle="Report problems and track maintenance work."
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

      <div className="space-y-6">
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

        <div className="rounded-xl border bg-card p-4">
          <GrievanceList
            initialGrievances={grievances || []}
            userId={user.id}
            workOrderStatusesByGrievance={workOrderStatusesByGrievance}
          />
        </div>

        <div className="rounded-xl border bg-card p-4">
          <WorkOrderList tenantId={user.id} initialWorkOrders={typedWorkOrders} />
        </div>
      </div>
    </DashboardShell>
  )
}
