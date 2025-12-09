import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type CardProps = React.ComponentProps<typeof Card>

interface MetricCardProps extends Omit<CardProps, "children"> {
  label: string
  value: React.ReactNode
  helperText?: React.ReactNode
  icon?: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  children?: React.ReactNode
}

export function MetricCard({
  label,
  value,
  helperText,
  icon,
  trend,
  trendValue,
  children,
  className,
  ...props
}: MetricCardProps) {
  return (
    <Card className={cn("card-premium h-full overflow-hidden", className)} {...props}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3 flex-1">
            <p className="text-sm font-medium text-muted-foreground">
              {label}
            </p>
            <p className="text-3xl font-bold tracking-tight">
              {value}
            </p>
            {helperText && (
              <p className="text-xs text-muted-foreground">{helperText}</p>
            )}
          </div>
          {icon && (
            <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 [&_svg]:h-5 [&_svg]:w-5 [&_svg]:text-primary">
              {icon}
            </div>
          )}
        </div>

        {/* Optional sparkline or other children */}
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}

        {trend && trendValue && (
          <div className={cn(
            "mt-4 inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
            trend === 'up' && "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30",
            trend === 'down' && "bg-red-50 text-red-600 dark:bg-red-900/30",
            trend === 'neutral' && "bg-slate-100 text-slate-600 dark:bg-slate-800"
          )}>
            {trend === 'up' && '↑'}
            {trend === 'down' && '↓'}
            {trendValue}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
