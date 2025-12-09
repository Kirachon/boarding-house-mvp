'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { UserPlus, FileText, Plus, Megaphone, Search } from 'lucide-react'
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
                <Link href="/owner/tenants">
                    <Button className="gap-2 gradient-blue text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all">
                        <UserPlus size={16} />
                        Add Tenant
                    </Button>
                </Link>
                <Link href="/owner/finance">
                    <Button className="gap-2 gradient-indigo text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all">
                        <FileText size={16} />
                        Create Invoice
                    </Button>
                </Link>
                <Link href="/owner/rooms">
                    <Button className="gap-2 gradient-teal text-white shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all">
                        <Plus size={16} />
                        Add Room
                    </Button>
                </Link>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="gap-2 border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-all">
                            <Megaphone size={16} className="text-indigo-500" />
                            Post Notice
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-xl">Post New Announcement</DialogTitle>
                            <DialogDescription>
                                This will be visible to all active tenants on their dashboard.
                            </DialogDescription>
                        </DialogHeader>
                        <form action={handleAnnouncement} className="space-y-4 pt-2">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder="e.g., Water Maintenance Scheduled"
                                    className="h-11"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="content">Content</Label>
                                <Textarea
                                    id="content"
                                    name="content"
                                    placeholder="Details about the announcement..."
                                    className="min-h-[120px] resize-none"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" className="gradient-indigo text-white">
                                    Post Announcement
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search tenants, rooms..."
                    className="pl-9 h-10 bg-muted/50 border-0 focus-visible:ring-1"
                />
            </div>
        </div>
    )
}
