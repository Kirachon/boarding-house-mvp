import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/shared/dashboard-shell'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { PropertyDialog } from '@/components/features/owner/property-dialog'
import { PropertyList } from '@/components/features/owner/property-list'

export default async function OwnerPropertiesPage() {
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

  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <DashboardShell
      title="Properties"
      subtitle="Manage properties connected to your public verification links."
      maxWidthClassName="max-w-5xl"
      action={<PropertyDialog mode="create" />}
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
        <h2 className="text-lg font-semibold tracking-tight">Connected properties</h2>
        <PropertyList properties={properties || []} />
      </section>
    </DashboardShell>
  )
}
