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
import { Database } from '@/types/supabase'
import { Edit2, Trash2 } from 'lucide-react'
import { RoomDialog } from './room-dialog'
import { deleteRoom } from '@/actions/room'
import { toast } from 'sonner'
import { useState } from 'react'

type Room = Database['public']['Tables']['rooms']['Row']

interface RoomDataTableProps {
    rooms: Room[]
}

export function RoomDataTable({ rooms }: RoomDataTableProps) {
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this room?")) return
        setIsDeleting(id)
        const res = await deleteRoom(id)
        setIsDeleting(null)
        if (res.error) toast.error(res.error)
        else toast.success("Room deleted")
    }

    return (
        <div className="rounded-md border border-border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rooms.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                No rooms found. Create one above.
                            </TableCell>
                        </TableRow>
                    ) : (
                        rooms.map((room) => (
                            <TableRow key={room.id}>
                                <TableCell className="font-medium">{room.name}</TableCell>
                                <TableCell>
                                    <Badge variant={room.occupancy === 'occupied' ? 'default' : 'secondary'}>
                                        {room.occupancy}
                                    </Badge>
                                </TableCell>
                                <TableCell>{room.capacity} Pax</TableCell>
                                <TableCell>${room.price}</TableCell>
                                <TableCell className="text-right flex justify-end gap-2">
                                    <RoomDialog mode="edit" room={room} trigger={
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                    } />

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-600"
                                        disabled={isDeleting === room.id}
                                        onClick={() => handleDelete(room.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )))}
                </TableBody>
            </Table>
        </div>
    )
}
