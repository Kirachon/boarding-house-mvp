'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Database } from '@/types/supabase'
import { CalendarDays, Clock, Home, DollarSign } from 'lucide-react'

type Invoice = Database['public']['Tables']['invoices']['Row']
type Assignment = Database['public']['Tables']['tenant_assignments']['Row']

interface CalendarEvent {
    id: string
    type: 'invoice' | 'lease'
    title: string
    date: Date
    daysUntil: number
}

interface CalendarWidgetProps {
    invoices: Invoice[]
    assignments: (Assignment & { rooms?: { name: string | null } | null })[]
}

export function CalendarWidget({ invoices, assignments }: CalendarWidgetProps) {
    const now = new Date()
    const next14Days = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)

    // Get upcoming invoice due dates
    const upcomingInvoices: CalendarEvent[] = invoices
        .filter(i => i.status !== 'paid' && i.status !== 'cancelled')
        .map(i => {
            const dueDate = new Date(i.due_date)
            const daysUntil = Math.ceil((dueDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
            return {
                id: i.id,
                type: 'invoice' as const,
                title: `$${i.amount.toFixed(0)} due`,
                date: dueDate,
                daysUntil
            }
        })
        .filter(e => e.daysUntil >= 0 && e.daysUntil <= 14)

    // Get upcoming lease expirations
    const upcomingLeases: CalendarEvent[] = assignments
        .filter(a => (a as any).lease_end && (a as any).is_active)
        .map(a => {
            const endDate = new Date((a as any).lease_end!)
            const daysUntil = Math.ceil((endDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
            const roomName = (a as any).rooms?.name || 'Room'
            return {
                id: a.id,
                type: 'lease' as const,
                title: `${roomName} lease ends`,
                date: endDate,
                daysUntil
            }
        })
        .filter(e => e.daysUntil >= 0 && e.daysUntil <= 30)

    const allEvents = [...upcomingInvoices, ...upcomingLeases]
        .sort((a, b) => a.daysUntil - b.daysUntil)
        .slice(0, 5)

    const getEventColor = (type: string, daysUntil: number) => {
        if (daysUntil <= 3) return 'border-red-500 bg-red-50 dark:bg-red-900/20'
        if (daysUntil <= 7) return 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
        return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
    }

    const getIcon = (type: string) => {
        return type === 'invoice'
            ? <DollarSign className="w-4 h-4" />
            : <Home className="w-4 h-4" />
    }

    return (
        <Card className="card-premium">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-primary" />
                    Upcoming Events
                </CardTitle>
            </CardHeader>
            <CardContent>
                {allEvents.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                        <CalendarDays className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No upcoming events</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {allEvents.map(event => (
                            <div
                                key={event.id}
                                className={`flex items-center gap-3 p-3 rounded-lg border-l-4 ${getEventColor(event.type, event.daysUntil)}`}
                            >
                                <div className="p-2 rounded-full bg-white/50 dark:bg-white/10">
                                    {getIcon(event.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{event.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {event.date.toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs font-medium ${event.daysUntil <= 3 ? 'text-red-600' :
                                        event.daysUntil <= 7 ? 'text-amber-600' : 'text-blue-600'
                                        }`}>
                                        {event.daysUntil === 0 ? 'Today' :
                                            event.daysUntil === 1 ? 'Tomorrow' :
                                                `${event.daysUntil}d`}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
