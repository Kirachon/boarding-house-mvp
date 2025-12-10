import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/shared/dashboard-shell'
import { Button } from '@/components/ui/button'
import { TenantInvoiceList } from '@/components/features/tenant/tenant-invoice-list'

export default async function TenantBillsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: invoices } = await supabase
    .from('invoices')
    .select('*')
    .eq('tenant_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <DashboardShell
      title="Bills & payments"
      subtitle="View your bills and upload payment proofs."
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
      <TenantInvoiceList invoices={invoices || []} />
    </DashboardShell>
  )
}

