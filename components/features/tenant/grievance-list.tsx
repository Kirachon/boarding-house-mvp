'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { Database } from '@/types/supabase'

type Grievance = Database['public']['Tables']['grievances']['Row']
type WorkOrderStatus = Database['public']['Enums']['work_order_status']

interface GrievanceListProps {
    initialGrievances: Grievance[]
    userId: string
    workOrderStatusesByGrievance?: Record<string, WorkOrderStatus>
}

const statusColorMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    open: "secondary",
    in_progress: "default", // or a specific blue
    resolved: "outline", // or green
    rejected: "destructive",
}

export function GrievanceList({ initialGrievances, userId, workOrderStatusesByGrievance }: GrievanceListProps) {
    const [grievances, setGrievances] = useState<Grievance[]>(initialGrievances)
    const supabase = createClient()

    useEffect(() => {
        // Subscribe to realtime changes
        const channel = supabase
            .channel('realtime-grievances')
            .on(
                'postgres_changes',
                {
                    event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
                    schema: 'public',
                    table: 'grievances',
                    filter: `tenant_id=eq.${userId}`,
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setGrievances((prev) => [payload.new as Grievance, ...prev])
                    } else if (payload.eventType === 'UPDATE') {
                        setGrievances((prev) =>
                            prev.map((g) => (g.id === payload.new.id ? (payload.new as Grievance) : g))
                        )
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase, userId])

    if (grievances.length === 0) {
        return (
            <p className="text-sm text-muted-foreground">
                You haven&apos;t reported any issues yet. Use the form above whenever something needs attention.
            </p>
        )
    }

    return (
        <div className="space-y-4">
            {grievances.map((grievance) => (
                <div key={grievance.id} className="flex items-start justify-between rounded border border-border bg-card p-4 shadow-sm">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold capitalize text-foreground">{grievance.category}</span>
                            <Badge variant={statusColorMap[grievance.status] || "outline"}>
                                {grievance.status.replace('_', ' ')}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{grievance.description}</p>
                        {workOrderStatusesByGrievance?.[grievance.id] && (
                            <p className="mt-1 text-xs text-muted-foreground">
                                Linked work order status:{" "}
                                <span className="font-medium">
                                    {workOrderStatusesByGrievance[grievance.id]!.replace('_', ' ')}
                                </span>
                            </p>
                        )}
                        <p className="mt-2 text-xs text-muted-foreground">
                            Reported: {new Date(grievance.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}
