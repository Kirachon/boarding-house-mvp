import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

import { DashboardShell } from '@/components/shared/dashboard-shell'
import { Button } from '@/components/ui/button'
import { ProfileSettingsForm } from '@/components/features/shared/profile-settings-form'

export default async function OwnerSettingsPage() {
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
      title="Owner Settings"
      subtitle="Manage your profile and application preferences."
      maxWidthClassName="max-w-4xl"
    >
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/owner/dashboard">
          <Button variant="ghost" size="sm" className="-ml-3 gap-1">
            <ChevronLeft className="h-4 w-4" />
            Back to dashboard
          </Button>
        </Link>
      </div>

      <ProfileSettingsForm user={user} profile={profile} />
    </DashboardShell>
  )
}
