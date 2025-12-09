import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Database } from '@/types/supabase'
import { Home, Package, AlertTriangle, CheckCircle2 } from 'lucide-react'

type Room = Database['public']['Tables']['rooms']['Row']
type InventoryItem = Database['public']['Tables']['inventory_items']['Row']

interface RoomWithItems extends Room {
    inventory_items: InventoryItem[]
}

interface RoomHealthGridProps {
    rooms: RoomWithItems[]
}

const occupancyConfig: Record<string, { variant: "secondary" | "default" | "destructive" | "outline", label: string }> = {
    vacant: { variant: "secondary", label: "Available" },
    occupied: { variant: "default", label: "Occupied" },
    maintenance: { variant: "destructive", label: "Maintenance" },
}

export function RoomHealthGrid({ rooms }: RoomHealthGridProps) {
    if (!rooms || rooms.length === 0) {
        return (
            <Card className="card-premium">
                <CardContent className="flex flex-col items-center justify-center py-16">
                    <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Home className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">No rooms yet</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">Add your first room to get started</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {rooms.map((room) => {
                const totalItems = room.inventory_items.length
                const goodItems = room.inventory_items.filter(i => i.condition === 'good').length
                const damagedItems = room.inventory_items.filter(i => i.condition === 'broken' || i.condition === 'poor').length

                // Determine room health status
                let healthStatus: 'good' | 'warning' | 'critical' = 'good'
                let healthColor = 'bg-emerald-500'
                if (damagedItems > 0) {
                    healthStatus = 'critical'
                    healthColor = 'bg-red-500'
                } else if (room.inventory_items.some(i => i.condition === 'fair')) {
                    healthStatus = 'warning'
                    healthColor = 'bg-amber-500'
                }

                const occupancy = occupancyConfig[room.occupancy] || { variant: "outline" as const, label: room.occupancy }

                return (
                    <Card
                        key={room.id}
                        className="card-premium group cursor-pointer overflow-hidden"
                    >
                        {/* Health Indicator Bar */}
                        <div className={`h-1 ${healthColor}`} />

                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${room.occupancy === 'occupied'
                                            ? 'gradient-blue'
                                            : room.occupancy === 'maintenance'
                                                ? 'bg-red-500'
                                                : 'bg-slate-200'
                                        }`}>
                                        <Home className={`h-5 w-5 ${room.occupancy === 'vacant' ? 'text-slate-500' : 'text-white'}`} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base font-semibold">{room.name}</CardTitle>
                                        <p className="text-xs text-muted-foreground">${room.price}/mo</p>
                                    </div>
                                </div>
                                <Badge variant={occupancy.variant} className="text-[10px] font-medium">
                                    {occupancy.label}
                                </Badge>
                            </div>
                        </CardHeader>

                        <CardContent className="pt-0">
                            {/* Asset Health Summary */}
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 mb-3">
                                <div className="flex items-center gap-2">
                                    <Package className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-xs font-medium text-muted-foreground">Assets</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                        <span className="text-xs font-semibold">{goodItems}</span>
                                    </div>
                                    {damagedItems > 0 && (
                                        <div className="flex items-center gap-1">
                                            <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                                            <span className="text-xs font-semibold text-red-600">{damagedItems}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Asset List - Collapsed by default, show on hover */}
                            {totalItems > 0 && (
                                <div className="space-y-1.5 max-h-0 overflow-hidden group-hover:max-h-40 transition-all duration-300">
                                    {room.inventory_items.slice(0, 4).map(item => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between text-xs py-1.5 px-2 rounded-md bg-background"
                                        >
                                            <span className="text-foreground truncate">{item.name}</span>
                                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${item.condition === 'good' ? 'bg-emerald-100 text-emerald-700' :
                                                    item.condition === 'fair' ? 'bg-amber-100 text-amber-700' :
                                                        item.condition === 'poor' ? 'bg-orange-100 text-orange-700' :
                                                            'bg-red-100 text-red-700'
                                                }`}>
                                                {item.condition}
                                            </span>
                                        </div>
                                    ))}
                                    {totalItems > 4 && (
                                        <p className="text-[10px] text-muted-foreground text-center pt-1">
                                            +{totalItems - 4} more items
                                        </p>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
