import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/shared/dashboard-shell'
import { Button } from '@/components/ui/button'
import { TenantProfileForm } from '@/components/features/tenant/profile-form'

export default async function TenantProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <DashboardShell
      title="My profile"
      subtitle="Basic account information visible to your owner."
      maxWidthClassName="max-w-xl"
    >
      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/tenant/dashboard">
          <Button variant="ghost" size="icon-sm" aria-label="Back to tenant home">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <span>Back to home</span>
      </div>

      <TenantProfileForm fullName={profile?.full_name ?? null} email={user.email ?? null} />
    </DashboardShell>
  )
}

