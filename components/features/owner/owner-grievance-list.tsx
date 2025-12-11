'use client'

import { useEffect, useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { Database } from '@/types/supabase'
import { updateGrievanceStatus } from '@/actions/grievance'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

type Grievance = Database['public']['Tables']['grievances']['Row']
type GrievanceStatus = Database['public']['Enums']['grievance_status']

interface OwnerGrievanceListProps {
    initialGrievances: Grievance[]
}

const statusColorMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    open: "secondary",
    in_progress: "default",
    resolved: "outline",
    rejected: "destructive",
}

export function OwnerGrievanceList({ initialGrievances }: OwnerGrievanceListProps) {
    const [grievances, setGrievances] = useState<Grievance[]>(initialGrievances)
    const supabase = createClient()
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        const channel = supabase
            .channel('owner-realtime-grievances')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'grievances',
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
    }, [supabase])

    const handleStatusChange = (id: string, newStatus: GrievanceStatus) => {
        startTransition(async () => {
            const result = await updateGrievanceStatus(id, newStatus)
            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success("Status updated")
            }
        })
    }

    if (grievances.length === 0) {
        return (
            <p className="text-sm text-muted-foreground">
                No active grievances. You&apos;re all caught up.
            </p>
        )
    }

    return (
        <div className="space-y-4">
            {grievances.map((grievance) => (
                <div key={grievance.id} className="flex flex-col items-start justify-between gap-4 rounded border border-border bg-card p-4 shadow-sm md:flex-row md:items-center">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold capitalize text-foreground">{grievance.category}</span>
                            <Badge variant={statusColorMap[grievance.status ?? 'open'] || "outline"}>
                                {grievance.status?.replace('_', ' ') ?? 'Open'}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{grievance.description}</p>
                        <p className="mt-2 text-xs text-muted-foreground">
                            Reported: {new Date(grievance.created_at ?? '').toLocaleDateString()}
                        </p>
                    </div>
                    <div className="w-full md:w-auto min-w-[140px]">
                        <Select
                            defaultValue={grievance.status ?? 'open'}
                            onValueChange={(val) => handleStatusChange(grievance.id, val as GrievanceStatus)}
                            disabled={isPending}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            ))}
        </div>
    )
}
