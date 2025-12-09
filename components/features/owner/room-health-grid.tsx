import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Database } from '@/types/supabase'

type Room = Database['public']['Tables']['rooms']['Row']
type InventoryItem = Database['public']['Tables']['inventory_items']['Row']

interface RoomWithItems extends Room {
    inventory_items: InventoryItem[]
}

interface RoomHealthGridProps {
    rooms: RoomWithItems[]
}

const conditionColorMap: Record<string, string> = {
    good: 'bg-green-100 text-green-800 border-green-200',
    fair: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    poor: 'bg-orange-100 text-orange-800 border-orange-200',
    broken: 'bg-red-100 text-red-800 border-red-200',
}

const occupancyColorMap: Record<string, "secondary" | "default" | "destructive" | "outline"> = {
    vacant: "secondary", // Greenish/Grey
    occupied: "default", // Blue/dark
    maintenance: "destructive", // Red
}

export function RoomHealthGrid({ rooms }: RoomHealthGridProps) {
    if (!rooms || rooms.length === 0) {
        return (
            <p className="text-sm text-muted-foreground">
                No rooms found. Add some to get started.
            </p>
        )
    }

    return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {rooms.map((room) => {
                const totalItems = room.inventory_items.length
                const damagedItems = room.inventory_items.filter(
                    (i) => i.condition === 'broken' || i.condition === 'poor'
                ).length

                // Calculate health Color
                let healthBorder = "border-l-4 border-l-green-500"
                if (damagedItems > 0) healthBorder = "border-l-4 border-l-red-500"
                else if (room.inventory_items.some(i => i.condition === 'fair')) healthBorder = "border-l-4 border-l-yellow-500"

                return (
                    <Card key={room.id} className={`overflow-hidden shadow-sm transition-shadow hover:shadow-md ${healthBorder}`}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-muted/50 pb-2">
                            <CardTitle className="text-lg font-bold text-foreground">
                                {room.name}
                            </CardTitle>
                            <Badge variant={occupancyColorMap[room.occupancy] || "outline"}>
                                {room.occupancy}
                            </Badge>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="mb-4 flex items-end justify-between">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                        Asset Health
                                    </p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-bold text-foreground">
                                            {totalItems - damagedItems}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            / {totalItems} Good
                                        </span>
                                    </div>
                                </div>
                                {damagedItems > 0 && (
                                    <Badge variant="destructive" className="h-6">
                                        {damagedItems} Issues
                                    </Badge>
                                )}
                            </div>

                            <div className="max-h-40 space-y-2 overflow-y-auto">
                                {room.inventory_items.map(item => (
                                    <div key={item.id} className="flex items-center justify-between border-b border-border/40 pb-1 text-sm last:border-0 last:pb-0">
                                        <span className="text-foreground">{item.name}</span>
                                        <span className={`px-2 py-0.5 rounded text-xs border ${conditionColorMap[item.condition]}`}>
                                            {item.condition}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
