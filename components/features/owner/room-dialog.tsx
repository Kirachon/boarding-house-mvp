'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createRoom, updateRoom } from '@/actions/room'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { Database } from '@/types/supabase'

type Room = Database['public']['Tables']['rooms']['Row']

interface RoomDialogProps {
    mode: 'create' | 'edit'
    room?: Room
    open?: boolean
    onOpenChange?: (open: boolean) => void
    trigger?: React.ReactNode
}

export function RoomDialog({ mode, room, open, onOpenChange, trigger }: RoomDialogProps) {
    const [isOpen, setIsOpen] = useState(false)

    // Use controlled state if provided, otherwise local
    const show = open !== undefined ? open : isOpen
    const setShow = onOpenChange || setIsOpen

    const handleSubmit = async (formData: FormData) => {
        let result
        if (mode === 'create') {
            result = await createRoom(formData)
        } else if (mode === 'edit' && room) {
            result = await updateRoom(room.id, formData)
        }

        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success(`Room ${mode === 'create' ? 'created' : 'updated'}`)
            setShow(false)
        }
    }

    return (
        <Dialog open={show} onOpenChange={setShow}>
            <DialogTrigger asChild>
                {trigger || <Button><Plus className="w-4 h-4 mr-2" /> Add Room</Button>}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{mode === 'create' ? 'Add New Room' : 'Edit Room'}</DialogTitle>
                    <DialogDescription>
                        Configure the room details below.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Room Name / Number</Label>
                        <Input id="name" name="name" defaultValue={room?.name} required placeholder="e.g. Room 101" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (Monthly)</Label>
                            <Input id="price" name="price" type="number" step="0.01" defaultValue={room?.price} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="capacity">Capacity (Pax)</Label>
                            <Input id="capacity" name="capacity" type="number" min="1" defaultValue={room?.capacity} required />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">{mode === 'create' ? 'Create Room' : 'Save Changes'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
