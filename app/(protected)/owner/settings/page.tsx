import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/shared/dashboard-shell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function OwnerSettingsPage() {
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

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <DashboardShell
      title="Owner settings"
      subtitle="Basic account information. Extended settings can be added as the product evolves."
      maxWidthClassName="max-w-3xl"
    >
      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/owner/dashboard">
          <Button variant="ghost" size="icon-sm" aria-label="Back to owner dashboard">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <span>Back to dashboard</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>
            <span className="text-muted-foreground">Email</span>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Name</span>
            <p className="font-medium">{profile?.full_name || 'Not set'}</p>
          </div>
          <p className="text-xs text-muted-foreground pt-2">
            To keep this example focused, name and contact changes can be handled directly in the
            Supabase auth/profile settings. This page is a starting point for richer owner
            configuration.
          </p>
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
