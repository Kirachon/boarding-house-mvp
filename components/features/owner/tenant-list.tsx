'use client'

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
}

export function TenantList({ assignments }: TenantListProps) {

    const handleRemove = async (assignmentId: string, roomId: string) => {
        if (!confirm("Remove this tenant from the room? This will mark the room as vacant.")) return

        const res = await removeTenant(assignmentId, roomId)
        if (res.error) toast.error(res.error)
        else toast.success("Tenant removed from room")
    }

    return (
        <Card className="card-premium overflow-hidden border-0 bg-white/50 backdrop-blur-sm">
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-b border-border/50">
                            <TableHead className="w-[300px] pl-6">Tenant</TableHead>
                            <TableHead>Assigned Room</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Checklist</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {assignments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
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
                                            </div>
                                        )}
                                        {!assignment.rooms && <span className="text-muted-foreground italic">Unassigned</span>}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none px-2 py-0.5">
                                            Active Lease
                                        </Badge>
                                    </TableCell>
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
                                                    Awaiting move-in checklist
                                                </span>
                                            )
                                        })()}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {new Date((assignment as any).created_at ?? assignment.assign_date ?? '').toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => assignment.rooms && handleRemove(assignment.id, assignment.rooms.id)}
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            End Lease
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card >
    )
}
