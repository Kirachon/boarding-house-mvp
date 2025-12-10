'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export interface DashboardNavItem {
  label: string
  href: string
  icon?: React.ReactNode
}

interface DashboardSidebarProps {
  items: DashboardNavItem[]
}

export function DashboardSidebar({ items }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex md:w-60 lg:w-64 flex-col border-r bg-background/60 backdrop-blur">
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname?.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary shadow-sm'
                  : 'text-muted-foreground hover:bg-primary/5 hover:text-foreground hover:translate-x-1',
              )}
            >
              {item.icon && (
                <span
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-md border bg-background text-muted-foreground group-hover:border-primary/40',
                    isActive && 'border-primary/40 text-primary',
                  )}
                >
                  {item.icon}
                </span>
              )}
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

