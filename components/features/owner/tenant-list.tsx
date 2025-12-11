'use client'

import { RenewLeaseDialog } from './renew-lease-dialog'
import { RecurringSettingsDialog } from './recurring-settings-dialog'
import { useState } from 'react'
import { CalendarPlus, Repeat } from 'lucide-react'


import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Database } from '@/types/supabase'
import { LogOut, Home, UserCircle2 } from 'lucide-react'
import { removeTenant } from '@/actions/tenant'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'

// Use 'any' for properties that exist at runtime but not in generated types
type Assignment = Database['public']['Tables']['tenant_assignments']['Row'] & {
    profiles?: { id: string; full_name: string | null } | null
    rooms: Database['public']['Tables']['rooms']['Row'] | null
    room_handover_checklists?: {
        type: string
        is_completed: boolean
        completed_at: string | null
    }[]
    created_at?: string | null
}

interface TenantListProps {
    assignments: Assignment[]
    mode?: 'active' | 'history'
}


interface RenewDialogState {
    isOpen: boolean
    assignmentId: string
    tenantName: string
    currentEndDate?: string | null
}

interface RecurringDialogState {
    isOpen: boolean
    assignmentId: string
    tenantName: string
    suggestedAmount: number
}

export function TenantList({ assignments, mode = 'active' }: TenantListProps) {
    const [renewDialog, setRenewDialog] = useState<RenewDialogState>({
        isOpen: false,
        assignmentId: '',
        tenantName: '',
        currentEndDate: null
    })

    const [recurringDialog, setRecurringDialog] = useState<RecurringDialogState>({
        isOpen: false,
        assignmentId: '',
        tenantName: '',
        suggestedAmount: 0 // Default, will try to pull from room
    })

    const handleRemove = async (assignmentId: string, roomId: string) => {
        if (!confirm("Remove this tenant from the room? This will mark the room as vacant.")) return

        const res = await removeTenant(assignmentId, roomId)
        if (res.error) toast.error(res.error)
        else toast.success("Tenant removed from room")
    }

    return (
        <>
            <Card className="card-premium overflow-hidden border-0 bg-white/50 backdrop-blur-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-b border-border/50">
                                <TableHead className="w-[300px] pl-6">Tenant</TableHead>
                                <TableHead>Assigned Room</TableHead>
                                <TableHead>Status</TableHead>
                                {mode === 'active' && <TableHead>Checklist</TableHead>}
                                <TableHead>{mode === 'active' ? 'Joined' : 'Lease Period'}</TableHead>
                                {mode === 'active' && <TableHead className="text-right pr-6">Actions</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assignments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                                <UserCircle2 className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                            <p>No active tenants found. Invite one above.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                assignments.map((assignment) => (
                                    <TableRow key={assignment.id} className="group hover:bg-muted/30 border-b border-border/40 transition-colors">
                                        <TableCell className="pl-6">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-medium">
                                                        {assignment.profiles?.full_name?.substring(0, 2).toUpperCase() || 'T'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold text-sm text-foreground">{assignment.profiles?.full_name || 'Unknown'}</p>
                                                    <p className="text-xs text-muted-foreground">ID: {assignment.profiles?.id.slice(0, 8)}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {assignment.rooms && (
                                                <div className="flex items-center gap-2 text-slate-700">
                                                    <Home className="w-4 h-4 text-slate-400" />
                                                    {assignment.rooms.name}
                                                    <span className="text-xs text-slate-400 font-normal ml-1">
                                                        (₱{(assignment.rooms as any).price?.toLocaleString() || 0})
                                                    </span>
                                                </div>
                                            )}
                                            {!assignment.rooms && <span className="text-muted-foreground italic">Unassigned</span>}
                                        </TableCell>
                                        <TableCell>
                                            {mode === 'active' ? (
                                                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none px-2 py-0.5">
                                                    Active Lease
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-muted-foreground border-slate-300">
                                                    Past Tenant
                                                </Badge>
                                            )}
                                        </TableCell>
                                        {mode === 'active' && (
                                            <TableCell>
                                                {(() => {
                                                    const checklistArray = assignment.room_handover_checklists || []
                                                    const moveIn = checklistArray.find(c => c.type === 'move_in')
                                                    if (moveIn?.is_completed) {
                                                        return (
                                                            <span className="text-xs text-emerald-700 bg-emerald-50 rounded-full px-2 py-0.5">
                                                                Move-in confirmed
                                                            </span>
                                                        )
                                                    }
                                                    return (
                                                        <span className="text-xs text-amber-700 bg-amber-50 rounded-full px-2 py-0.5">
                                                            Awaiting checklist
                                                        </span>
                                                    )
                                                })()}
                                            </TableCell>
                                        )}
                                        <TableCell className="text-sm text-muted-foreground">
                                            {mode === 'active' ? (
                                                new Date((assignment as any).created_at ?? assignment.assign_date ?? '').toLocaleDateString()
                                            ) : (
                                                <div className="flex flex-col text-xs">
                                                    <span>In: {new Date((assignment as any).created_at ?? assignment.assign_date ?? '').toLocaleDateString()}</span>
                                                    <span>Out: {(assignment as any).end_date ? new Date((assignment as any).end_date).toLocaleDateString() : 'N/A'}</span>
                                                </div>
                                            )}
                                        </TableCell>
                                        {mode === 'active' && (
                                            <TableCell className="text-right pr-6">
                                                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {/* Recurring Button */}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title="Auto-Billing Settings"
                                                        className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 h-8 w-8"
                                                        onClick={() => setRecurringDialog({
                                                            isOpen: true,
                                                            assignmentId: assignment.id,
                                                            tenantName: assignment.profiles?.full_name || 'Unknown',
                                                            suggestedAmount: (assignment.rooms as any)?.price || 0
                                                        })}
                                                    >
                                                        <Repeat className="w-4 h-4" />
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 px-2"
                                                        onClick={() => setRenewDialog({
                                                            isOpen: true,
                                                            assignmentId: assignment.id,
                                                            tenantName: assignment.profiles?.full_name || 'Unknown',
                                                            currentEndDate: (assignment as any).end_date
                                                        })}
                                                    >
                                                        <CalendarPlus className="w-4 h-4 mr-1.5" />
                                                        Renew
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                                                        onClick={() => assignment.rooms && handleRemove(assignment.id, assignment.rooms.id)}
                                                    >
                                                        <LogOut className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <RenewLeaseDialog
                isOpen={renewDialog.isOpen}
                onOpenChange={(open) => setRenewDialog(prev => ({ ...prev, isOpen: open }))}
                assignmentId={renewDialog.assignmentId}
                tenantName={renewDialog.tenantName}
                currentEndDate={renewDialog.currentEndDate}
            />

            <RecurringSettingsDialog
                isOpen={recurringDialog.isOpen}
                onOpenChange={(open) => setRecurringDialog(prev => ({ ...prev, isOpen: open }))}
                assignmentId={recurringDialog.assignmentId}
                tenantName={recurringDialog.tenantName}
                suggestedAmount={recurringDialog.suggestedAmount}
            />
        </>
    )
}
