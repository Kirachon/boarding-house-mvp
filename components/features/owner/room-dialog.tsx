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
import { Plus, Home } from 'lucide-react'
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
                {trigger || (
                    <Button className="gradient-teal text-white shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transition-all">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Room
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <div className="h-8 w-8 rounded-lg gradient-teal flex items-center justify-center">
                            <Home className="h-4 w-4 text-white" />
                        </div>
                        {mode === 'create' ? 'Add New Room' : 'Edit Room'}
                    </DialogTitle>
                    <DialogDescription>
                        Configure the room details below.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Room Name / Number</Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={room?.name}
                            required
                            placeholder="e.g. Room 101"
                            className="h-10"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price" className="text-right">
                                Price/Month
                            </Label>
                            <Input
                                id="price"
                                name="price_per_month"
                                type="number"
                                step="0.01"
                                defaultValue={room?.price_per_month}
                                required
                                className="h-10 font-mono"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="capacity">Capacity (Pax)</Label>
                            <Input
                                id="capacity"
                                name="capacity"
                                type="number"
                                min="1"
                                defaultValue={(room as any)?.capacity}
                                required
                                className="h-10"
                            />
                        </div>
                    </div>
                    <DialogFooter className="pt-4">
                        <Button type="button" variant="ghost" onClick={() => setShow(false)}>Cancel</Button>
                        <Button type="submit" className="gradient-teal text-white">
                            {mode === 'create' ? 'Create Room' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
