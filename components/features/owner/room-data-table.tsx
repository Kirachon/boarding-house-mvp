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
import { Edit2, Trash2, Home, Users } from 'lucide-react'
import { RoomDialog } from './room-dialog'
import { deleteRoom } from '@/actions/room'
import { toast } from 'sonner'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'

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

    const getOccupancyBadge = (status: string) => {
        switch (status) {
            case 'occupied':
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-none">Occupied</Badge>
            case 'vacant':
                return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none">Vacant</Badge>
            case 'maintenance':
                return <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200 border-none">Maintenance</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    return (
        <Card className="card-premium overflow-hidden border-0 bg-white/50 backdrop-blur-sm">
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-b border-border/50">
                            <TableHead className="w-[300px] pl-6">Room Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Capacity</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="text-right pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rooms.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                            <Home className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <p>No rooms found. Create one above.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            rooms.map((room) => (
                                <TableRow key={room.id} className="group hover:bg-muted/30 border-b border-border/40 transition-colors">
                                    <TableCell className="font-medium pl-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${room.occupancy_status === 'occupied' ? 'gradient-blue text-white' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                <Home className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <span className="block font-semibold text-sm text-foreground">{room.name}</span>
                                                <span className="block text-xs text-muted-foreground">ID: {room.id.slice(0, 8)}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {getOccupancyBadge(room.occupancy_status ?? 'vacant')}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                            <Users className="w-4 h-4" />
                                            {(room as any).capacity ?? 1} Pax
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-mono font-medium text-slate-700">${room.price_per_month}</span>
                                        <span className="text-xs text-muted-foreground ml-1">/mo</span>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <RoomDialog mode="edit" room={room} trigger={
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                            } />

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                disabled={isDeleting === room.id}
                                                onClick={() => handleDelete(room.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
