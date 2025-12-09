'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Megaphone, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button'
import { deleteAnnouncement } from '@/actions/announcement'
import { toast } from 'sonner'

interface Announcement {
    id: string
    title: string
    content: string
    created_at: string
    is_active: boolean
}

export function AnnouncementWidget({ announcements }: { announcements: Announcement[] }) {

    async function handleDelete(id: string) {
        const res = await deleteAnnouncement(id)
        if (res?.error) toast.error(res.error)
        else toast.success('Announcement removed')
    }

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-md font-medium flex items-center gap-2">
                    <Megaphone className="h-4 w-4 text-indigo-500" />
                    Announcements
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {announcements.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        No active announcements.
                    </p>
                ) : (
                    announcements.map((item) => (
                        <div key={item.id} className="group flex flex-col gap-1 rounded-lg border p-3 text-sm shadow-sm transition-colors hover:bg-muted/50">
                            <div className="flex items-center justify-between font-semibold">
                                <span>{item.title}</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleDelete(item.id)}
                                >
                                    <Trash2 className="h-3 w-3 text-destructive" />
                                </Button>
                            </div>
                            <p className="line-clamp-2 text-muted-foreground text-xs">
                                {item.content}
                            </p>
                            <p className="text-[10px] text-muted-foreground pt-1">
                                Posted {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                            </p>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    )
}
