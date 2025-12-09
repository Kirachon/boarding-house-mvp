'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Megaphone, Bell } from 'lucide-react'
import { Database } from '@/types/supabase'

type Announcement = Database['public']['Tables']['announcements']['Row']

interface TenantAnnouncementListProps {
  announcements: Announcement[]
}

export function TenantAnnouncementList({ announcements }: TenantAnnouncementListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-3">
        <div className="h-8 w-8 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200 flex items-center justify-center">
          <Megaphone className="h-4 w-4" />
        </div>
        <div>
          <CardTitle className="text-base">House announcements</CardTitle>
          <p className="text-xs text-muted-foreground">
            Notices from your boarding house owner.
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {announcements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
            <Bell className="h-6 w-6 mb-2 opacity-40" />
            <p className="text-sm">No active announcements right now.</p>
          </div>
        ) : (
          announcements.map((a) => (
            <div key={a.id} className="text-sm space-y-1 border-b last:border-b-0 pb-3 last:pb-0">
              <p className="font-medium truncate">{a.title}</p>
              <p className="text-xs text-muted-foreground whitespace-pre-line">
                {a.content}
              </p>
              <p className="text-[11px] text-muted-foreground/70">
                {new Date(a.created_at).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

