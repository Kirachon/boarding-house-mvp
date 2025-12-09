'use client'

import { Card, CardContent } from '@/components/ui/card'
import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet, AlertCircle } from 'lucide-react'
import { Line, LineChart, ResponsiveContainer } from 'recharts'

interface FinanceOverviewProps {
    totalIncome: number
    outstanding: number
    overdue: number
    monthlyData?: any[]
}

export function FinanceOverview({ totalIncome, outstanding, overdue, monthlyData }: FinanceOverviewProps) {
    const data = monthlyData || [
        { value: 400 },
        { value: 300 },
        { value: 500 },
        { value: 200 },
        { value: 600 },
        { value: 800 },
    ]

    return (
        <div className="grid gap-5 md:grid-cols-3">
            {/* Total Revenue Card */}
            <Card className="card-premium overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-10 w-10 rounded-xl gradient-blue flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                            <ArrowUpRight className="h-3 w-3" />
                            +20.1%
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                        <p className="text-3xl font-bold tracking-tight">${totalIncome.toLocaleString()}</p>
                    </div>
                    <div className="h-[50px] mt-4 -mx-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <defs>
                                    <linearGradient id="greenGradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#10b981" />
                                        <stop offset="100%" stopColor="#34d399" />
                                    </linearGradient>
                                </defs>
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="url(#greenGradient)"
                                    strokeWidth={2.5}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Outstanding Card */}
            <Card className="card-premium overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-10 w-10 rounded-xl gradient-indigo flex items-center justify-center">
                            <Wallet className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                            12 pending
                        </span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Outstanding</p>
                        <p className="text-3xl font-bold tracking-tight">${outstanding.toLocaleString()}</p>
                    </div>
                    <div className="h-[50px] mt-4 -mx-2 opacity-60">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <defs>
                                    <linearGradient id="amberGradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#f59e0b" />
                                        <stop offset="100%" stopColor="#fbbf24" />
                                    </linearGradient>
                                </defs>
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="url(#amberGradient)"
                                    strokeWidth={2.5}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Overdue Card */}
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
                        <p className="text-3xl font-bold tracking-tight text-red-600">${overdue.toLocaleString()}</p>
                    </div>
                    <div className="h-[50px] mt-4 -mx-2 opacity-60">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <defs>
                                    <linearGradient id="redGradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#ef4444" />
                                        <stop offset="100%" stopColor="#f87171" />
                                    </linearGradient>
                                </defs>
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="url(#redGradient)"
                                    strokeWidth={2.5}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
