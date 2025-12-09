import * as React from "react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type CardProps = React.ComponentProps<typeof Card>

interface MetricCardProps extends Omit<CardProps, "children"> {
  label: string
  value: React.ReactNode
  helperText?: React.ReactNode
  icon?: React.ReactNode
}

export function MetricCard({
  label,
  value,
  helperText,
  icon,
  className,
  ...props
}: MetricCardProps) {
  return (
    <Card className={cn("h-full", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 text-2xl font-semibold leading-tight">
            {value}
          </p>
        </div>
        {icon ? (
          <div className="text-muted-foreground [&_svg]:h-6 [&_svg]:w-6">
            {icon}
          </div>
        ) : null}
      </CardHeader>
      {helperText ? (
        <CardContent>
          <p className="text-sm text-muted-foreground">{helperText}</p>
        </CardContent>
      ) : null}
    </Card>
  )
}

