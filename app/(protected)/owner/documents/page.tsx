import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/shared/dashboard-shell'
import { Button } from '@/components/ui/button'
import { LeaseUploadDialog } from '@/components/features/owner/lease-upload-dialog'
import { LeaseDocumentsTable } from '@/components/features/owner/lease-documents-table'

export default async function OwnerDocumentsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const role = (user.user_metadata as { role?: string } | null)?.role
  if (role && role !== 'owner') {
    redirect(role === 'tenant' ? '/tenant/dashboard' : '/')
  }

  const { data: documents } = await supabase
    .from('documents')
    .select(
      `
      *,
      profiles:tenant_id(*)
    `.trim(),
    )
    .eq('type', 'lease')
    .order('created_at', { ascending: false })

  const { data: tenants } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'tenant')
    .order('full_name', { ascending: true })

  return (
    <DashboardShell
      title="Documents & rules"
      subtitle="Upload lease documents for tenants. House rules remain managed from your policies today."
      maxWidthClassName="max-w-5xl"
      action={<LeaseUploadDialog tenants={(tenants as any) || []} />}
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
        <h2 className="text-lg font-semibold tracking-tight">Lease documents</h2>
        <LeaseDocumentsTable documents={(documents as any) || []} />
      </section>
    </DashboardShell>
  )
}
