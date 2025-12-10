'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'
import { Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

type Notification = Database['public']['Tables']['notifications']['Row']

export function TenantNotificationList() {
  const supabase = createClient()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      setNotifications(data || [])
      setLoading(false)
    }

    fetchNotifications()
  }, [supabase])

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const markAsRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)))
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
  }

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-100 flex items-center justify-center">
            <Bell className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base">Notifications</CardTitle>
            <p className="text-xs text-muted-foreground">
              Payment updates, issue resolutions, and other activity.
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" className="text-xs h-7" onClick={markAllRead}>
            Mark all read
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[360px]">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-sm text-muted-foreground">
              <Bell className="h-8 w-8 mb-2 opacity-20" />
              <p>No notifications yet.</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <button
                  type="button"
                  key={notification.id}
                  className={cn(
                    'w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors',
                    !notification.is_read && 'bg-blue-50/60 dark:bg-blue-900/10',
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <p
                    className={cn(
                      'text-sm font-medium',
                      !notification.is_read && 'text-blue-700 dark:text-blue-300',
                    )}
                  >
                    {notification.title}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {notification.message}
                  </p>
                  <span className="text-[10px] text-muted-foreground mt-1 block">
                    {new Date(notification.created_at).toLocaleString()}
                  </span>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
