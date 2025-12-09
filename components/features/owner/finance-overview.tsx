'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet, AlertCircle } from 'lucide-react'
import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts'

interface FinanceOverviewProps {
    totalIncome: number
    outstanding: number
    overdue: number
    monthlyData?: any[]
}

export function FinanceOverview({ totalIncome, outstanding, overdue, monthlyData }: FinanceOverviewProps) {
    // Fallback data if no history provided
    const data = monthlyData || [
        { value: 400 },
        { value: 300 },
        { value: 500 },
        { value: 200 },
        { value: 600 },
        { value: 800 },
    ]

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${totalIncome.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground flex items-center pt-1">
                        <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-1" />
                        +20.1% from last month
                    </p>
                    <div className="h-[40px] mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${outstanding.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground flex items-center pt-1">
                        <span className="text-amber-500 font-medium">12 invoices</span> pending
                    </p>
                    <div className="h-[40px] mt-2 opacity-50">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${overdue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground flex items-center pt-1">
                        <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                        Action required
                    </p>
                    <div className="h-[40px] mt-2 opacity-50">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
