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
    const vacantRooms = rooms.filter(r => r.occupancy_status === 'vacant')

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
                <Button className="gradient-blue text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite Tenant
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <div className="h-8 w-8 rounded-lg gradient-blue flex items-center justify-center">
                            <UserPlus className="h-4 w-4 text-white" />
                        </div>
                        Invite New Tenant
                    </DialogTitle>
                    <DialogDescription>
                        Create an account for a new tenant and assign them a room.
                    </DialogDescription>
                </DialogHeader>

                {!createdUser ? (
                    <form action={handleSubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input
                                id="full_name"
                                name="full_name"
                                required
                                placeholder="John Doe"
                                className="h-10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                placeholder="john@example.com"
                                className="h-10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="room_id">Assign Room</Label>
                            <Select name="room_id" required>
                                <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Select a vacant room" />
                                </SelectTrigger>
                                <SelectContent>
                                    {vacantRooms.length === 0 ? (
                                        <SelectItem value="none" disabled>No vacant rooms available</SelectItem>
                                    ) : (
                                        vacantRooms.map(room => (
                                            <SelectItem key={room.id} value={room.id}>
                                                {room.name} (${room.price_per_month})
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                            <Button type="submit" className="gradient-blue text-white">Send Invite</Button>
                        </DialogFooter>
                    </form>
                ) : (
                    <div className="space-y-4 py-4">
                        <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 text-center shadow-inner">
                            <h3 className="text-emerald-800 font-bold mb-2 text-lg">Tenant Account Created!</h3>
                            <p className="text-sm text-emerald-700 mb-6">
                                The account has been set up successfully. Share these credentials with the tenant:
                            </p>
                            <div className="text-left bg-white p-4 rounded-lg border border-emerald-100 shadow-sm text-sm font-mono space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Email:</span>
                                    <strong className="select-all">{createdUser.email}</strong>
                                </div>
                                <div className="flex justify-between border-t pt-2 mt-2">
                                    <span className="text-muted-foreground">Temp Password:</span>
                                    <strong className="select-all text-emerald-600">{createdUser.pass}</strong>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleClose} className="w-full">Done</Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
