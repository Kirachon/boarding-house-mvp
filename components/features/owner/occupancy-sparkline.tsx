'use client'

import { Database } from '@/types/supabase'

type Room = Database['public']['Tables']['rooms']['Row']

interface OccupancySparklineProps {
    rooms: Room[]
}

export function OccupancySparkline({ rooms }: OccupancySparklineProps) {
    const total = rooms.length
    const occupied = rooms.filter(r => r.occupancy === 'occupied').length
    const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0

    // Generate simple sparkline bars (simulating last 7 periods)
    // In a real app, this would come from historical data
    const sparkData = [65, 70, 75, 70, 80, 85, occupancyRate]
    const maxVal = Math.max(...sparkData, 100)

    return (
        <div className="flex items-end gap-1 h-8">
            {sparkData.map((val, i) => (
                <div
                    key={i}
                    className={`w-2 rounded-t transition-all ${i === sparkData.length - 1
                            ? 'bg-primary'
                            : 'bg-primary/30'
                        }`}
                    style={{ height: `${(val / maxVal) * 100}%` }}
                />
            ))}
            <span className="ml-2 text-sm font-semibold text-primary">
                {occupancyRate}%
            </span>
        </div>
    )
}
