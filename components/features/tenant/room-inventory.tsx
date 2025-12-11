'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Database } from '@/types/supabase'
import { Badge } from '@/components/ui/badge'
import { Home } from 'lucide-react'

type InventoryItem = Database['public']['Tables']['inventory_items']['Row']

interface TenantRoomInventoryProps {
  roomName?: string | null
  occupancy?: Database['public']['Enums']['room_occupancy'] | null
  items: InventoryItem[]
}

const conditionVariant: Record<
  Database['public']['Enums']['item_condition'],
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  good: 'secondary',
  fair: 'default',
  poor: 'destructive',
  broken: 'destructive',
}

export function TenantRoomInventory({ roomName, occupancy, items }: TenantRoomInventoryProps) {
  const occupancyLabel =
    occupancy === 'occupied'
      ? 'Occupied'
      : occupancy === 'vacant'
        ? 'Vacant'
        : occupancy === 'maintenance'
          ? 'Under maintenance'
          : undefined

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-3">
        <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200 flex items-center justify-center">
          <Home className="h-4 w-4" />
        </div>
        <div>
          <CardTitle className="text-base">My room inventory</CardTitle>
          <p className="text-xs text-muted-foreground">
            Items documented by the owner for your room.
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {roomName && (
          <p className="text-muted-foreground">
            Room: <span className="font-medium">{roomName}</span>
            {occupancyLabel && (
              <span className="ml-2 text-xs text-muted-foreground">
                ({occupancyLabel})
              </span>
            )}
          </p>
        )}
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No inventory recorded yet for your room. If you think this is incorrect, you can mention
            it when reporting an issue.
          </p>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-md border bg-card/50 px-3 py-2"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    Last checked {new Date((item as any).last_checked ?? item.created_at ?? '').toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={conditionVariant[item.condition]}>
                  {item.condition}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

