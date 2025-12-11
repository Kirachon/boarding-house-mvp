'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'
import { Badge } from '@/components/ui/badge'

type WorkOrder = Database['public']['Tables']['work_orders']['Row'] & {
  room?: { id: string; name: string } | null
}

interface WorkOrderListProps {
  initialWorkOrders: WorkOrder[]
  tenantId: string
}

const statusLabel: Record<
  Database['public']['Enums']['work_order_status'],
  string
> = {
  open: 'Open',
  in_progress: 'In progress',
  waiting_vendor: 'Waiting vendor',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

const statusVariant: Record<
  Database['public']['Enums']['work_order_status'],
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  open: 'secondary',
  in_progress: 'default',
  waiting_vendor: 'outline',
  completed: 'outline',
  cancelled: 'destructive',
}

export function WorkOrderList({ initialWorkOrders, tenantId }: WorkOrderListProps) {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(initialWorkOrders)
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel('realtime-work-orders-tenant')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'work_orders',
          filter: `tenant_id=eq.${tenantId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setWorkOrders((prev) => [payload.new as WorkOrder, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setWorkOrders((prev) =>
              prev.map((w) => (w.id === payload.new.id ? (payload.new as WorkOrder) : w))
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, tenantId])

  if (workOrders.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        When the owner converts a maintenance report into a work order, you&apos;ll see its progress
        here.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {workOrders.map((wo) => {
        const roomName =
          wo.room && Array.isArray(wo.room) ? wo.room[0]?.name : (wo.room as any)?.name

        return (
          <div
            key={wo.id}
            className="flex flex-col gap-1 rounded border border-border bg-card px-3 py-2.5 text-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium line-clamp-1">{wo.title}</p>
              <Badge variant={statusVariant[wo.status ?? 'open']}>
                {statusLabel[wo.status ?? 'open']}
              </Badge>
            </div>
            {roomName && (
              <p className="text-xs text-muted-foreground">Room: {roomName}</p>
            )}
            {wo.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {wo.description}
              </p>
            )}
            <p className="text-[11px] text-muted-foreground">
              Created {new Date(wo.created_at ?? '').toLocaleDateString()}
            </p>
          </div>
        )
      })}
    </div>
  )
}

