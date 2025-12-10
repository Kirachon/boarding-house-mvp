'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Clock, Send, Wrench } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GrievanceTrackerProps {
    status: 'open' | 'viewed' | 'in_progress' | 'resolved'
    className?: string
}

const steps = [
    { id: 'open', label: 'Reported', icon: Send },
    { id: 'viewed', label: 'Viewed', icon: Clock },
    { id: 'in_progress', label: 'Fixing', icon: Wrench },
    { id: 'resolved', label: 'Resolved', icon: CheckCircle2 },
]

export function GrievanceTracker({ status, className }: GrievanceTrackerProps) {
    const currentStepIndex = steps.findIndex((s) => s.id === status)
    // If status is not found (e.g. 'closed' might map to resolved or similar), default to 0
    const activeIndex = currentStepIndex === -1 ? 0 : currentStepIndex

    return (
        <div className={cn("w-full py-4", className)}>
            <div className="relative flex items-center justify-between">
                {/* Background Line */}
                <div className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 bg-muted rounded-full" />

                {/* Active Line (Animated) */}
                <motion.div
                    className="absolute left-0 top-1/2 h-1 -translate-y-1/2 bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />

                {steps.map((step, index) => {
                    const isActive = index <= activeIndex
                    const isCurrent = index === activeIndex
                    const Icon = step.icon

                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                            <motion.div
                                initial={false}
                                animate={{
                                    scale: isCurrent ? 1.2 : 1,
                                    backgroundColor: isActive ? 'var(--primary)' : 'var(--background)',
                                    borderColor: isActive ? 'var(--primary)' : 'var(--muted)',
                                }}
                                className={cn(
                                    "flex h-8 w-8 items-center justify-center rounded-full border-2 bg-background transition-colors",
                                    isActive ? "border-primary text-primary-foreground" : "border-muted text-muted-foreground"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                            </motion.div>
                            <span className={cn(
                                "text-[10px] font-medium transition-colors absolute -bottom-6 w-20 text-center",
                                isActive ? "text-primary" : "text-muted-foreground"
                            )}>
                                {step.label}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
