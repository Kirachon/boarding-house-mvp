import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Database } from '@/types/supabase'
import { FileText, AlertCircle, Megaphone, DollarSign, CheckCircle2, Wrench } from 'lucide-react'

type Grievance = Database['public']['Tables']['grievances']['Row']
type Invoice = Database['public']['Tables']['invoices']['Row']
type Announcement = Database['public']['Tables']['announcements']['Row']
type WorkOrder = Database['public']['Tables']['work_orders']['Row']

interface TimelineItem {
  id: string
  type: 'grievance' | 'invoice' | 'announcement' | 'work_order'
  title: string
  description: string
  date: string
  status?: string
}

interface TenantActivityTimelineProps {
  grievances: Grievance[]
  invoices: Invoice[]
  announcements: Announcement[]
  workOrders: WorkOrder[]
}

export function TenantActivityTimeline({
  grievances,
  invoices,
  announcements,
  workOrders,
}: TenantActivityTimelineProps) {
  const items: TimelineItem[] = [
    ...grievances.slice(0, 3).map((g) => ({
      id: g.id,
      type: 'grievance' as const,
      title: 'Issue reported',
      description: g.description.slice(0, 60) + (g.description.length > 60 ? '…' : ''),
      date: g.created_at ?? '',
      status: g.status ?? undefined,
    })),
    ...workOrders.slice(0, 3).map((w) => ({
      id: w.id,
      type: 'work_order' as const,
      title: 'Maintenance work order',
      description: w.title,
      date: (w as any).updated_at || w.created_at || '',
      status: w.status ?? undefined,
    })),
    ...invoices.slice(0, 3).map((i) => ({
      id: i.id,
      type: 'invoice' as const,
      title: i.status === 'paid' ? 'Payment recorded' : 'Bill created',
      description: `${(i as any).description ?? 'Invoice'} – ₱${i.amount.toFixed(2)}`,
      date: (i as any).updated_at || i.created_at || '',
      status: i.status ?? undefined,
    })),
    ...announcements.slice(0, 2).map((a) => ({
      id: a.id,
      type: 'announcement' as const,
      title: 'Announcement',
      description: a.title,
      date: a.created_at ?? '',
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6)

  const getIcon = (type: TimelineItem['type'], status?: string) => {
    switch (type) {
      case 'grievance':
        return <AlertCircle className="w-4 h-4 text-orange-500" />
      case 'invoice':
        return status === 'paid' ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        ) : (
          <DollarSign className="w-4 h-4 text-blue-500" />
        )
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-purple-500" />
      case 'work_order':
        return <Wrench className="w-4 h-4 text-amber-500" />
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
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          Recent activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No recent activity yet.
          </p>
        ) : (
          <div className="space-y-4 text-sm">
            {items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[auto,1fr,auto] items-start gap-3 rounded-lg border border-border/50 bg-background/60 p-3"
              >
                <div className="p-2 rounded-full bg-muted shrink-0 flex items-center justify-center">
                  {getIcon(item.type, item.status)}
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <p className="font-medium text-sm leading-tight">{item.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed break-words">
                    {item.description}
                  </p>
                </div>
                <span className="text-[11px] text-muted-foreground whitespace-nowrap text-right leading-tight pt-0.5">
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
