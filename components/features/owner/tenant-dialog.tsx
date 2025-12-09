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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { inviteTenant } from '@/actions/tenant'
import { toast } from 'sonner'
import { UserPlus } from 'lucide-react'
import { Database } from '@/types/supabase'

type Room = Database['public']['Tables']['rooms']['Row']

interface TenantDialogProps {
    rooms: Room[]
}

export function TenantDialog({ rooms }: TenantDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [createdUser, setCreatedUser] = useState<{ email: string, pass: string } | null>(null)

    // Filter only vacant rooms
    const vacantRooms = rooms.filter(r => r.occupancy === 'vacant')

    const handleSubmit = async (formData: FormData) => {
        const res = await inviteTenant(formData)

        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success("Tenant invited & assigned successfully!")
            setCreatedUser({
                email: formData.get('email') as string,
                pass: res.tempPassword!
            })
            // Don't close immediately so they can see the password
        }
    }

    const handleClose = () => {
        setIsOpen(false)
        setCreatedUser(null)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button><UserPlus className="w-4 h-4 mr-2" /> Invite Tenant</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite New Tenant</DialogTitle>
                    <DialogDescription>
                        Create an account for a new tenant and assign them a room.
                    </DialogDescription>
                </DialogHeader>

                {!createdUser ? (
                    <form action={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input id="full_name" name="full_name" required placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" name="email" type="email" required placeholder="john@example.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="room_id">Assign Room</Label>
                            <Select name="room_id" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a vacant room" />
                                </SelectTrigger>
                                <SelectContent>
                                    {vacantRooms.length === 0 ? (
                                        <SelectItem value="none" disabled>No vacant rooms available</SelectItem>
                                    ) : (
                                        vacantRooms.map(room => (
                                            <SelectItem key={room.id} value={room.id}>
                                                {room.name} (${room.price})
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Send Invite</Button>
                        </DialogFooter>
                    </form>
                ) : (
                    <div className="space-y-4 py-4">
                        <div className="bg-green-50 p-4 rounded-md border border-green-200 text-center">
                            <h3 className="text-green-800 font-bold mb-2">Tenant Created!</h3>
                            <p className="text-sm text-green-700 mb-4">
                                Since email is disabled in dev, please share these credentials manually:
                            </p>
                            <div className="text-left bg-white p-3 rounded border text-sm font-mono">
                                <p>Email: <strong>{createdUser.email}</strong></p>
                                <p>Password: <strong>{createdUser.pass}</strong></p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleClose}>Done</Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
