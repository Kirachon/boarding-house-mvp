'use client'

import { Card, CardContent } from '@/components/ui/card'
import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet, AlertCircle } from 'lucide-react'

interface FinanceOverviewProps {
  totalIncome: number
  outstanding: number
  overdue: number
  pendingCount: number
}

export function FinanceOverview({
  totalIncome,
  outstanding,
  overdue,
  pendingCount,
}: FinanceOverviewProps) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      <Card className="card-premium overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 rounded-xl gradient-blue flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              <ArrowUpRight className="h-3 w-3" />
              Revenue
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Total collected</p>
            <p className="text-3xl font-bold tracking-tight">
              ${totalIncome.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="card-premium overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 rounded-xl gradient-indigo flex items-center justify-center">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
              {pendingCount} pending
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Outstanding</p>
            <p className="text-3xl font-bold tracking-tight">
              ${outstanding.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="card-premium overflow-hidden border-l-4 border-l-red-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 rounded-xl bg-red-500 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
              <ArrowDownRight className="h-3 w-3" />
              Action needed
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Overdue</p>
            <p className="text-3xl font-bold tracking-tight text-red-600">
              ${overdue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
