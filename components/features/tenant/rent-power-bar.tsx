'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface RentPowerBarProps {
    daysRemaining: number
    totalDaysInCycle?: number
    className?: string
}

export function RentPowerBar({ daysRemaining, totalDaysInCycle = 30, className }: RentPowerBarProps) {
    // Calculate percentage remaining (0 to 100)
    // If daysRemaining is high, bar is full. If 0, bar is empty.
    const percentage = Math.min(Math.max((daysRemaining / totalDaysInCycle) * 100, 0), 100)

    // Color determination
    // > 10 days: Green
    // 4-10 days: Amber
    // < 4 days: Red
    let colorClass = 'bg-emerald-500'
    if (daysRemaining <= 10) colorClass = 'bg-amber-500'
    if (daysRemaining <= 3) colorClass = 'bg-red-500'

    return (
        <div className={cn("w-full space-y-1", className)}>
            <div className="flex justify-between text-xs font-medium text-muted-foreground mb-1">
                <span>Rent Cycle</span>
                <span className={cn(
                    daysRemaining <= 3 ? "text-red-600 animate-pulse font-bold" : ""
                )}>
                    {daysRemaining} days left
                </span>
            </div>

            <div className="h-3 w-full bg-secondary/50 rounded-full overflow-hidden relative border border-border/50">
                {/* Segment markers */}
                <div className="absolute inset-0 flex justify-evenly pointer-events-none">
                    <div className="h-full w-[1px] bg-background/30" />
                    <div className="h-full w-[1px] bg-background/30" />
                    <div className="h-full w-[1px] bg-background/30" />
                </div>

                <motion.div
                    className={cn("h-full rounded-full transition-colors duration-500", colorClass)}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1.0, ease: "easeOut", delay: 0.2 }}
                />
            </div>
        </div>
    )
}
