import * as React from "react"

import { cn } from "@/lib/utils"

interface DashboardShellProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  action?: React.ReactNode
  /**
   * Tailwind max-width utility for the inner container.
   * Defaults to `max-w-6xl` for primary dashboards.
   */
  maxWidthClassName?: string
}

export function DashboardShell({
  title,
  subtitle,
  action,
  children,
  className,
  maxWidthClassName = "max-w-6xl",
  ...props
}: DashboardShellProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)} {...props}>
      <div
        className={cn(
          "mx-auto px-4 py-6 md:px-8 md:py-8",
          maxWidthClassName
        )}
      >
        {(title || subtitle || action) && (
          <header className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              {title && (
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-sm text-muted-foreground sm:text-base">
                  {subtitle}
                </p>
              )}
            </div>
            {action && (
              <div className="flex items-center gap-2">{action}</div>
            )}
          </header>
        )}

        {children}
      </div>
    </div>
  )
}

