import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardSidebar, DashboardNavItem } from '@/components/shared/dashboard-sidebar'
import {
  LayoutDashboard,
  BedDouble,
  Users,
  WalletCards,
  Wrench,
  Building2,
  FileText,
  Settings2,
} from 'lucide-react'

const ownerNavItems: DashboardNavItem[] = [
  { label: 'Overview', href: '/owner/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: 'Rooms', href: '/owner/rooms', icon: <BedDouble className="h-4 w-4" /> },
  { label: 'Tenants', href: '/owner/tenants', icon: <Users className="h-4 w-4" /> },
  { label: 'Financials', href: '/owner/finance', icon: <WalletCards className="h-4 w-4" /> },
  { label: 'Maintenance', href: '/owner/maintenance', icon: <Wrench className="h-4 w-4" /> },
  { label: 'Properties', href: '/owner/properties', icon: <Building2 className="h-4 w-4" /> },
  { label: 'Documents & Rules', href: '/owner/documents', icon: <FileText className="h-4 w-4" /> },
  { label: 'Settings', href: '/owner/settings', icon: <Settings2 className="h-4 w-4" /> },
]

export default async function OwnerLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const role = (user.user_metadata as { role?: string } | null)?.role
  if (role && role !== 'owner') {
    // If a logged-in non-owner hits an owner route, send them to their dashboard
    redirect(role === 'tenant' ? '/tenant/dashboard' : '/')
  }

  return (
    <div className="min-h-screen flex bg-background relative">
      <DashboardSidebar items={ownerNavItems} />
      <main className="flex-1">{children}</main>
      {/* <ChatWidget currentUserId={user.id} />  -- Commented out until we have a proper use case/tenant selection context, but the component is ready */}
    </div>
  )
}
