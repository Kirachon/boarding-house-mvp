'use client'

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CalendarClock } from "lucide-react"
import { differenceInDays, parseISO } from "date-fns"

interface LeaseAlertProps {
    assignments: any[] // Using any for simplicity in rapid dev, but should be typed
}

export function LeaseExpiryAlert({ assignments }: LeaseAlertProps) {
    // Filter assignments expiring in next 30 days
    const expiringSoon = assignments.filter(a => {
        if (!a.lease_end) return false
        const days = differenceInDays(parseISO(a.lease_end), new Date())
        return days >= 0 && days <= 30
    })

    if (expiringSoon.length === 0) return null

    return (
        <Alert variant="destructive" className="bg-amber-50 text-amber-900 border-amber-200">
            <CalendarClock className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800 font-semibold mb-2">
                Leases Expiring Soon ({expiringSoon.length})
            </AlertTitle>
            <AlertDescription>
                <ul className="list-disc pl-4 space-y-1 text-xs">
                    {expiringSoon.map((a) => (
                        <li key={a.id}>
                            <span className="font-medium">{a.tenant?.full_name}</span> (Room {a.room?.name})
                            <span className="block text-amber-700/80">
                                Ends on {new Date(a.lease_end).toLocaleDateString()}
                            </span>
                        </li>
                    ))}
                </ul>
            </AlertDescription>
        </Alert>
    )
}
