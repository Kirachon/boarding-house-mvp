import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardSidebar, DashboardNavItem } from '@/components/shared/dashboard-sidebar'
import {
  Home,
  ReceiptIndianRupee,
  MessageCircleMore,
  BedDouble,
  UserCircle2,
  Bell,
} from 'lucide-react'

const tenantNavItems: DashboardNavItem[] = [
  { label: 'Home', href: '/tenant/dashboard', icon: <Home className="h-4 w-4" /> },
  { label: 'Bills', href: '/tenant/bills', icon: <ReceiptIndianRupee className="h-4 w-4" /> },
  { label: 'Issues', href: '/tenant/issues', icon: <MessageCircleMore className="h-4 w-4" /> },
  { label: 'Room & Inventory', href: '/tenant/room', icon: <BedDouble className="h-4 w-4" /> },
  { label: 'Profile', href: '/tenant/profile', icon: <UserCircle2 className="h-4 w-4" /> },
  { label: 'Notifications', href: '/tenant/notifications', icon: <Bell className="h-4 w-4" /> },
]

export default async function TenantLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const role = (user.user_metadata as { role?: string } | null)?.role
  if (role && role !== 'tenant') {
    redirect(role === 'owner' ? '/owner/dashboard' : '/')
  }

  return (
    <div className="min-h-screen flex bg-background">
      <DashboardSidebar items={tenantNavItems} />
      <main className="flex-1">{children}</main>
    </div>
  )
}
