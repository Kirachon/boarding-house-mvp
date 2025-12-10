'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, AlertCircle, CreditCard, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RentPowerBar } from './rent-power-bar'

interface DashboardHeroProps {
    userName: string
    nextBillDate?: string
    openIssuesCount: number
    leaseEndDate?: string
}

export function TenantDashboardHero({
    userName,
    nextBillDate,
    openIssuesCount,
    leaseEndDate,
}: DashboardHeroProps) {
    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Good morning'
        if (hour < 18) return 'Good afternoon'
        return 'Good evening'
    }

    // Calculate days remaining if lease end date is provided
    const getLeaseDaysRemaining = () => {
        if (!leaseEndDate) return null
        const end = new Date(leaseEndDate).getTime()
        const now = new Date().getTime()
        const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
        return diff > 0 ? diff : 0
    }

    const daysRemaining = getLeaseDaysRemaining()

    return (
        <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        {getGreeting()}, <span className="text-primary">{userName}</span>
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Welcome to your tenant command center.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Bill Status */}
                <Card className="bg-background/60 backdrop-blur-md border-border/50 hover:shadow-md transition-all duration-300 group">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className={cn(
                            "p-3 rounded-full transition-colors",
                            nextBillDate ? "bg-orange-500/10 text-orange-600" : "bg-green-500/10 text-green-600"
                        )}>
                            <CreditCard className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Next Bill</p>
                            <h3 className="text-lg font-bold">
                                {nextBillDate
                                    ? new Date(nextBillDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                                    : "All Paid"}
                            </h3>
                        </div>
                    </CardContent>
                </Card>

                {/* Issues Status */}
                <Card className="bg-background/60 backdrop-blur-md border-border/50 hover:shadow-md transition-all duration-300 group">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className={cn(
                            "p-3 rounded-full transition-colors",
                            openIssuesCount > 0 ? "bg-red-500/10 text-red-600" : "bg-blue-500/10 text-blue-600"
                        )}>
                            <AlertCircle className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Open Issues</p>
                            <h3 className="text-lg font-bold">
                                {openIssuesCount} Active
                            </h3>
                        </div>
                    </CardContent>
                </Card>

                {/* Lease Status */}
                <Card className="bg-background/60 backdrop-blur-md border-border/50 hover:shadow-md transition-all duration-300 group">
                    <CardContent className="p-4 flex flex-col justify-between gap-4 h-full">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-purple-500/10 text-purple-600">
                                <CalendarDays className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Lease Status</p>
                                <h3 className="text-lg font-bold">
                                    {daysRemaining !== null ? "Active" : "No Lease"}
                                </h3>
                            </div>
                        </div>
                        {/* Rent Power Bar Integration */}
                        {daysRemaining !== null && (
                            <RentPowerBar daysRemaining={daysRemaining} />
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
