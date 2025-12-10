import * as React from 'react'

import { cn } from '@/lib/utils'
import { DarkModeToggle } from './dark-mode-toggle'
import { NotificationBell } from './notification-bell'

interface DashboardShellProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  action?: React.ReactNode
  maxWidthClassName?: string
}

export function DashboardShell({
  title,
  subtitle,
  action,
  children,
  className,
  maxWidthClassName = 'max-w-7xl',
  ...props
}: DashboardShellProps) {
  return (
    <div
      className={cn(
        'min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 transition-colors duration-500',
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'mx-auto px-4 py-6 md:px-8 md:py-8',
          maxWidthClassName,
        )}
      >
        {(title || subtitle || action) && (
          <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              {title && (
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-gradient">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-sm text-muted-foreground sm:text-base">
                  {subtitle}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <NotificationBell />
              <DarkModeToggle />
              {action}
            </div>
          </header>
        )}

        {children}
      </div>
    </div>
  )
}
