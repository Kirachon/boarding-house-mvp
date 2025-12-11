import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Database } from '@/types/supabase'
import { FileText, AlertCircle, Megaphone, DollarSign, CheckCircle2 } from 'lucide-react'

type Grievance = Database['public']['Tables']['grievances']['Row']
type Invoice = Database['public']['Tables']['invoices']['Row']
type Announcement = Database['public']['Tables']['announcements']['Row']

interface TimelineItem {
    id: string
    type: 'grievance' | 'invoice' | 'announcement'
    title: string
    description: string
    date: string
    status?: string
}

interface ActivityTimelineProps {
    grievances: Grievance[]
    invoices: Invoice[]
    announcements: Announcement[]
}

export function ActivityTimeline({ grievances, invoices, announcements }: ActivityTimelineProps) {
    // Combine and sort all items by date
    const items: TimelineItem[] = [
        ...grievances.slice(0, 3).map(g => ({
            id: g.id,
            type: 'grievance' as const,
            title: `${g.category} Issue Reported`,
            description: g.description.slice(0, 50) + (g.description.length > 50 ? '...' : ''),
            date: g.created_at ?? '',
            status: g.status
        })),
        ...invoices.slice(0, 3).map(i => ({
            id: i.id,
            type: 'invoice' as const,
            title: i.status === 'paid' ? 'Payment Received' : 'Invoice Created',
            description: `$${i.amount.toFixed(2)} - ${(i as any).description ?? 'Invoice'}`,
            date: (i as any).updated_at || i.created_at || '',
            status: i.status
        })),
        ...announcements.slice(0, 2).map(a => ({
            id: a.id,
            type: 'announcement' as const,
            title: 'Announcement Posted',
            description: a.title,
            date: a.created_at ?? ''
        }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)

    const getIcon = (type: string, status?: string) => {
        switch (type) {
            case 'grievance':
                return <AlertCircle className="w-4 h-4 text-orange-500" />
            case 'invoice':
                return status === 'paid'
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    : <DollarSign className="w-4 h-4 text-blue-500" />
            case 'announcement':
                return <Megaphone className="w-4 h-4 text-purple-500" />
            default:
                return <FileText className="w-4 h-4 text-slate-500" />
        }
    }

    const getTimeAgo = (dateStr: string) => {
        const now = new Date()
        const date = new Date(dateStr)
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMins / 60)
        const diffDays = Math.floor(diffHours / 24)

        if (diffMins < 60) return `${diffMins}m ago`
        if (diffHours < 24) return `${diffHours}h ago`
        if (diffDays < 7) return `${diffDays}d ago`
        return date.toLocaleDateString()
    }

    return (
        <Card className="card-premium">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Recent Activity
                </CardTitle>
            </CardHeader>
            <CardContent>
                {items.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        No recent activity
                    </p>
                ) : (
                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <div key={item.id} className="flex gap-3 items-start">
                                <div className="mt-1 p-1.5 rounded-full bg-muted">
                                    {getIcon(item.type, item.status)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">
                                        {item.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {item.description}
                                    </p>
                                </div>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                    {getTimeAgo(item.date)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
