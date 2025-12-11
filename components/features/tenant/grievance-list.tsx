'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { Database } from '@/types/supabase'
import { GrievanceTracker } from './grievance-tracker'

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
                <div key={grievance.id} className="rounded border border-border bg-card shadow-sm transition-all hover:shadow-md">
                    <div className="p-4">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold capitalize text-foreground">{grievance.category}</span>
                                    <Badge variant={statusColorMap[grievance.status ?? 'open'] || "outline"}>
                                        {grievance.status?.replace('_', ' ') ?? 'Open'}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">{grievance.description}</p>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {new Date(grievance.created_at ?? '').toLocaleDateString()}
                            </span>
                        </div>

                        {/* Pizza Tracker Integration */}
                        <div className="pt-2 border-t border-border/50">
                            <GrievanceTracker status={grievance.status as any} />
                        </div>

                        {workOrderStatusesByGrievance?.[grievance.id] && (
                            <div className="mt-3 text-xs bg-muted/30 p-2 rounded flex justify-between items-center">
                                <span className="text-muted-foreground">Work Order Status:</span>
                                <Badge variant="outline" className="font-mono text-xs">
                                    {workOrderStatusesByGrievance[grievance.id]!.replace('_', ' ')}
                                </Badge>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}
