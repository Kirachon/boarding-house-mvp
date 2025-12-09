'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { UserPlus, FileText, Plus, Megaphone } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createAnnouncement } from '@/actions/announcement'
import { toast } from 'sonner'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export function QuickActions() {
    const [open, setOpen] = useState(false)

    async function handleAnnouncement(formData: FormData) {
        const res = await createAnnouncement(formData)
        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success('Announcement posted!')
            setOpen(false)
        }
    }

    return (
        <div className="flex flex-wrap gap-3 p-1">
            <Link href="/owner/tenants">
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm border border-blue-500/20">
                    <UserPlus size={16} />
                    Add Tenant
                </Button>
            </Link>
            <Link href="/owner/finance">
                <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm border border-indigo-500/20">
                    <FileText size={16} />
                    Create Invoice
                </Button>
            </Link>
            <Link href="/owner/rooms">
                <Button variant="outline" className="gap-2 border-teal-200 text-teal-700 hover:bg-teal-50 hover:text-teal-800 shadow-sm">
                    <Plus size={16} />
                    Add Room
                </Button>
            </Link>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2 border-dashed">
                        <Megaphone size={16} />
                        Post Notice
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Post New Announcement</DialogTitle>
                        <DialogDescription>
                            This will be visible to all active tenants on their dashboard.
                        </DialogDescription>
                    </DialogHeader>
                    <form action={handleAnnouncement} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" placeholder="e.g., Water Maintenance Scheduled" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="content">Content</Label>
                            <Textarea id="content" name="content" placeholder="Details about the announcement..." required />
                        </div>
                        <div className="flex justify-end gap-2 text-sm"> {/* text-sm added to ensure proper alignment if needed */}
                            <Button type="submit">Post Announcement</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
