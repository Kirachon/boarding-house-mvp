'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { renewLease } from '@/actions/tenant'
import { toast } from 'sonner'
import { CalendarClock } from 'lucide-react'

interface RenewLeaseDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    assignmentId: string
    tenantName: string
    currentEndDate?: string | null
}

export function RenewLeaseDialog({ isOpen, onOpenChange, assignmentId, tenantName, currentEndDate }: RenewLeaseDialogProps) {
    const [date, setDate] = useState(currentEndDate?.split('T')[0] || '')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!date) {
            toast.error("Please select a new end date")
            return
        }

        setLoading(true)
        const res = await renewLease(assignmentId, new Date(date).toISOString())
        setLoading(false)

        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success("Lease renewed successfully")
            onOpenChange(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CalendarClock className="w-5 h-5 text-blue-600" />
                        Renew Lease
                    </DialogTitle>
                    <DialogDescription>
                        Extend the lease for <strong>{tenantName}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="end_date">New Lease End Date</Label>
                        <Input
                            id="end_date"
                            type="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading} className="gradient-blue text-white">
                            {loading ? 'Updating...' : 'Confirm Renewal'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
