import * as React from 'react'

import { cn } from '@/lib/utils'
import { DarkModeToggle } from './dark-mode-toggle'
import { NotificationBell } from './notification-bell'
import { PageTransition } from './page-transition'

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
        'min-h-screen transition-colors duration-500',
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

        <PageTransition>
          {children}
        </PageTransition>
      </div>
    </div>
  )
}
