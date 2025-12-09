'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { Database } from '@/types/supabase'

type Grievance = Database['public']['Tables']['grievances']['Row']

interface GrievanceListProps {
    initialGrievances: Grievance[]
    userId: string
}

const statusColorMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    open: "secondary",
    in_progress: "default", // or a specific blue
    resolved: "outline", // or green
    rejected: "destructive",
}

export function GrievanceList({ initialGrievances, userId }: GrievanceListProps) {
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
        return <p className="text-sm text-blue-700">No active grievances found.</p>
    }

    return (
        <div className="space-y-4">
            {grievances.map((grievance) => (
                <div key={grievance.id} className="p-4 bg-white rounded border border-gray-200 shadow-sm flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold capitalize text-gray-900">{grievance.category}</span>
                            <Badge variant={statusColorMap[grievance.status] || "outline"}>
                                {grievance.status.replace('_', ' ')}
                            </Badge>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{grievance.description}</p>
                        <p className="text-xs text-gray-400 mt-2">
                            Reported: {new Date(grievance.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}
