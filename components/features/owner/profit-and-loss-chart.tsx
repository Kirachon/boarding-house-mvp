'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface ProfitAndLossPoint {
  month: string
  income: number
  expenses: number
  profit: number
}

interface ProfitAndLossChartProps {
  data: ProfitAndLossPoint[]
}

export function ProfitAndLossChart({ data }: ProfitAndLossChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profit &amp; loss</CardTitle>
        </CardHeader>
        <CardContent className="py-6 text-sm text-muted-foreground">
          Not enough data yet. Once you start collecting invoices and expenses, you&apos;ll see a
          monthly view here.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Profit &amp; loss</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                `$${value.toFixed(2)}`,
                name.charAt(0).toUpperCase() + name.slice(1),
              ]}
            />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#16a34a"
              strokeWidth={2}
              dot={false}
              name="income"
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
              name="expenses"
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#4f46e5"
              strokeWidth={2}
              dot={false}
              name="profit"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

