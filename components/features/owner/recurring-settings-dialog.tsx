'use client'

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, CalendarClock, Lock } from "lucide-react"
import { toast } from "sonner"
import { getRecurringSettings, upsertRecurringSettings, deleteRecurringSettings } from "@/actions/recurring"

interface RecurringSettingsDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    assignmentId: string
    tenantName: string
    suggestedAmount: number
}

export function RecurringSettingsDialog({
    isOpen,
    onOpenChange,
    assignmentId,
    tenantName,
    suggestedAmount
}: RecurringSettingsDialogProps) {
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(false)

    // Form State
    const [isActive, setIsActive] = useState(true)
    const [amount, setAmount] = useState(suggestedAmount)
    const [dayOfMonth, setDayOfMonth] = useState(1)

    useEffect(() => {
        if (isOpen && assignmentId) {
            setFetching(true)
            getRecurringSettings(assignmentId)
                .then(res => {
                    if (res.data) {
                        setIsActive(res.data.is_active ?? true)
                        setAmount(res.data.amount)
                        setDayOfMonth(res.data.day_of_month)
                    } else {
                        // Reset to defaults if no settings found
                        setIsActive(true)
                        setAmount(suggestedAmount)
                        setDayOfMonth(1)
                    }
                })
                .finally(() => setFetching(false))
        }
    }, [isOpen, assignmentId, suggestedAmount])

    const calculateNextRun = () => {
        const today = new Date()
        let nextDate = new Date(today.getFullYear(), today.getMonth(), dayOfMonth)

        // If the day has passed, move to next month
        if (nextDate <= today) {
            nextDate = new Date(today.getFullYear(), today.getMonth() + 1, dayOfMonth)
        }
        return nextDate.toISOString().split('T')[0] // YYYY-MM-DD
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const nextRunDate = calculateNextRun()
            const res = await upsertRecurringSettings({
                assignmentId,
                amount,
                dayOfMonth,
                nextRunDate,
                isActive
            })

            if (res.error) {
                toast.error(res.error)
            } else {
                toast.success(isActive ? "Recurring invoice scheduled" : "Recurring invoice disabled")
                onOpenChange(false)
            }
        } catch (e) {
            toast.error("Failed to save settings")
        } finally {
            setLoading(false)
        }
    }

    const handleDisable = async () => {
        if (!confirm("Are you sure you want to disable recurring billing for this tenant?")) return
        setLoading(true)
        try {
            await deleteRecurringSettings(assignmentId)
            toast.success("Recurring billing disabled")
            onOpenChange(false)
        } catch (e) {
            toast.error("Error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CalendarClock className="w-5 h-5 text-indigo-600" />
                        Recurring Invoice Settings
                    </DialogTitle>
                    <DialogDescription>
                        Automate monthly rent for <span className="font-semibold text-foreground">{tenantName}</span>.
                    </DialogDescription>
                </DialogHeader>

                {fetching ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <div className="grid gap-6 py-4">
                        <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg bg-slate-50">
                            <Label htmlFor="active-mode" className="flex flex-col space-y-1 cursor-pointer">
                                <span className="font-medium">Enable Auto-Billing</span>
                                <span className="font-normal text-xs text-muted-foreground">
                                    Automatically generate invoice monthly
                                </span>
                            </Label>
                            <Switch id="active-mode" checked={isActive} onCheckedChange={setIsActive} />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">
                                Amount
                            </Label>
                            <div className="col-span-3 relative">
                                <span className="absolute left-3 top-2.5 text-muted-foreground">₱</span>
                                <Input
                                    id="amount"
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                    className="pl-7"
                                    disabled={!isActive}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="day" className="text-right">
                                Day of Month
                            </Label>
                            <div className="col-span-3">
                                <Select
                                    value={dayOfMonth.toString()}
                                    onValueChange={(v) => setDayOfMonth(Number(v))}
                                    disabled={!isActive}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select day" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[1, 5, 10, 15, 20, 25, 28].map(d => (
                                            <SelectItem key={d} value={d.toString()}>
                                                {d}{d === 1 ? 'st' : d === 2 ? 'nd' : d === 3 ? 'rd' : 'th'} of the month
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {isActive && (
                            <div className="rounded-md bg-indigo-50 p-3 text-xs text-indigo-700 flex items-start gap-2">
                                <div className="mt-0.5"><CalendarClock className="w-3.5 h-3.5" /></div>
                                <div>
                                    Next invoice will be generated on <strong>{new Date(calculateNextRun()).toLocaleDateString(undefined, { dateStyle: 'long' })}</strong> for <strong>₱{amount.toLocaleString()}</strong>.
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading || fetching} className="bg-indigo-600 hover:bg-indigo-700">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Settings
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
