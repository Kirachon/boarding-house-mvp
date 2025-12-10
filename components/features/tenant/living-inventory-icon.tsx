'use client'

import { cn } from '@/lib/utils'
import { BedDouble, Armchair, Lamp, Fan, Monitor, Package, Sparkles, AlertTriangle, XCircle } from 'lucide-react'

interface LivingInventoryIconProps {
    name: string
    condition: 'good' | 'fair' | 'poor' | 'broken'
    className?: string
}

const itemIcons: Record<string, any> = {
    bed: BedDouble,
    chair: Armchair,
    lamp: Lamp,
    fan: Fan,
    desk: Monitor,
    default: Package
}

export function LivingInventoryIcon({ name, condition, className }: LivingInventoryIconProps) {
    // Normalize name to map to icons (simple fuzzy matching)
    const normalizedKey = Object.keys(itemIcons).find(key => name.toLowerCase().includes(key)) || 'default'
    const MainIcon = itemIcons[normalizedKey]

    const statusConfig = {
        good: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', StatusIcon: Sparkles },
        fair: { color: 'text-amber-500', bg: 'bg-amber-500/10', StatusIcon: null },
        poor: { color: 'text-orange-500', bg: 'bg-orange-500/10', StatusIcon: AlertTriangle },
        broken: { color: 'text-red-500', bg: 'bg-red-500/10', StatusIcon: XCircle },
    }

    const { color, bg, StatusIcon } = statusConfig[condition]

    return (
        <div className={cn("relative group", className)}>
            <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-105",
                bg,
                color
            )}>
                <MainIcon className="h-6 w-6" />
            </div>

            {/* Status Badge Indicator */}
            {StatusIcon && (
                <div className={cn(
                    "absolute -top-1 -right-1 h-5 w-5 rounded-full border-2 border-background flex items-center justify-center bg-white shadow-sm",
                    color
                )}>
                    <StatusIcon className="h-3 w-3" />
                </div>
            )}
        </div>
    )
}
