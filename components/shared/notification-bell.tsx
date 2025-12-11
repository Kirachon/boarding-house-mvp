'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface Notification {
    id: string
    title: string
    message: string
    is_read: boolean
    created_at: string | null
    user_id: string
}

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [pendingProofCount, setPendingProofCount] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        const fetchNotifications = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(10)

            let baseUnread = 0
            if (data) {
                setNotifications(data)
                baseUnread = data.filter(n => !n.is_read).length
            }

            // For owners, also surface number of payment proofs pending verification
            const role = (user.user_metadata as any)?.role
            if (role === 'owner') {
                const { data: pending } = await supabase
                    .from('invoices')
                    .select('id')
                    .eq('status', 'pending_verification')

                const extra = pending?.length ?? 0
                setPendingProofCount(extra)
                setUnreadCount(baseUnread + extra)
            } else {
                setPendingProofCount(0)
                setUnreadCount(baseUnread)
            }
        }

        fetchNotifications()

        const interval = setInterval(fetchNotifications, 60000)
        return () => clearInterval(interval)
    }, [])

    const markAsRead = async (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
        setUnreadCount(prev => Math.max(0, prev - 1))

        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id)
    }

    const markAllRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('user_id', user.id)
                .eq('is_read', false)
        }
        // Only clear unread notifications, keep pendingProofCount contribution
        setUnreadCount(pendingProofCount)
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-9 w-9">
                    <Bell className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-slate-950" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between p-4 border-b">
                    <h4 className="font-semibold text-sm">Notifications</h4>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={markAllRead} className="text-xs h-auto py-1 px-2">
                            Mark all read
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-[300px]">
                    {notifications.length === 0 && pendingProofCount === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground">
                            <Bell className="h-8 w-8 mb-2 opacity-20" />
                            <p className="text-sm">No notifications</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {pendingProofCount > 0 && (
                                <div className="p-4 bg-blue-50/60 dark:bg-blue-900/10 text-xs text-blue-700">
                                    You have {pendingProofCount} payment proof
                                    {pendingProofCount > 1 ? 's' : ''} pending verification in
                                    the Financials tab.
                                </div>
                            )}
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={cn(
                                        "p-4 hover:bg-muted/50 transition-colors cursor-pointer text-left",
                                        !notification.is_read && "bg-blue-50/50 dark:bg-blue-900/10"
                                    )}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <h5 className={cn("text-sm font-medium mb-1", !notification.is_read && "text-blue-600 dark:text-blue-400")}>
                                        {notification.title}
                                    </h5>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        {notification.message}
                                    </p>
                                    <span className="text-[10px] text-muted-foreground mt-2 block">
                                        {new Date(notification.created_at ?? '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    )
}
