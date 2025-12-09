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
import { LogOut } from 'lucide-react'
import { removeTenant } from '@/actions/tenant'
import { toast } from 'sonner'

type Assignment = Database['public']['Tables']['tenant_room_assignments']['Row'] & {
    profiles: Database['public']['Tables']['profiles']['Row'] | null
    rooms: Database['public']['Tables']['rooms']['Row'] | null
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
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Tenant</TableHead>
                        <TableHead>Assigned Room</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {assignments.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24 text-gray-500">
                                No active tenants found. Invite one above.
                            </TableCell>
                        </TableRow>
                    ) : (
                        assignments.map((assignment) => (
                            <TableRow key={assignment.id}>
                                <TableCell className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>{assignment.profiles?.full_name?.substring(0, 2) || 'T'}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium text-sm">{assignment.profiles?.full_name || 'Unknown'}</p>
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                    {assignment.rooms?.name || 'Unassigned'}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                        Active
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-gray-500 text-sm">
                                    {new Date(assignment.start_date).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => assignment.rooms && handleRemove(assignment.id, assignment.rooms.id)}
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Evict
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )))}
                </TableBody>
            </Table>
        </div>
    )
}
