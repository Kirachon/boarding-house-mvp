import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/shared/dashboard-shell'
import { Button } from '@/components/ui/button'
import { TenantNotificationList } from '@/components/features/tenant/notification-list'

export default async function TenantNotificationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <DashboardShell
      title="Notifications"
      subtitle="A full history of your recent notifications."
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

      <TenantNotificationList />
    </DashboardShell>
  )
}

