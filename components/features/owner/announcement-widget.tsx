'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Megaphone, Trash2, Bell } from 'lucide-react'
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
        <Card className="card-premium h-full overflow-hidden">
            <CardHeader className="pb-3 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg gradient-indigo flex items-center justify-center">
                        <Megaphone className="h-4 w-4 text-white" />
                    </div>
                    <span>Announcements</span>
                    {announcements.length > 0 && (
                        <span className="ml-auto text-xs font-normal text-muted-foreground bg-white px-2 py-0.5 rounded-full shadow-sm">
                            {announcements.length} active
                        </span>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                {announcements.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 px-4">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                            <Bell className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground text-center">
                            No active announcements.<br />
                            <span className="text-xs">Post one to notify tenants.</span>
                        </p>
                    </div>
                ) : (
                    <div className="divide-y max-h-[280px] overflow-y-auto">
                        {announcements.map((item) => (
                            <div
                                key={item.id}
                                className="group p-4 hover:bg-muted/30 transition-colors"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-sm truncate">{item.title}</h4>
                                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                            {item.content}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground/70 mt-2">
                                            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
