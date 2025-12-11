import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database } from "@/types/supabase"

type Room = Database["public"]["Tables"]["rooms"]["Row"]

interface RoomAvailabilityPanelProps {
  rooms: Room[]
}

export function RoomAvailabilityPanel({ rooms }: RoomAvailabilityPanelProps) {
  const totalRooms = rooms.length
  const occupied = rooms.filter((room) => room.occupancy_status === "occupied").length
  const vacant = rooms.filter((room) => room.occupancy_status === "vacant").length
  const maintenance = rooms.filter(
    (room) => room.occupancy_status === "maintenance"
  ).length

  const percentage = (count: number) =>
    totalRooms > 0 ? Math.round((count / totalRooms) * 100) : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Room availability</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {totalRooms === 0 ? (
          <p className="text-sm text-muted-foreground">
            No rooms configured yet. Add rooms to start tracking availability.
          </p>
        ) : (
          <div className="space-y-3">
            <AvailabilityRow
              label="Occupied"
              count={occupied}
              total={totalRooms}
              colorClassName="bg-primary"
            />
            <AvailabilityRow
              label="Vacant"
              count={vacant}
              total={totalRooms}
              colorClassName="bg-emerald-500"
            />
            <AvailabilityRow
              label="Maintenance"
              count={maintenance}
              total={totalRooms}
              colorClassName="bg-amber-500"
            />
          </div>
        )}
        <p className="pt-1 text-xs text-muted-foreground">
          Need to adjust rooms?{" "}
          <Link
            href="/owner/rooms"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Open room management
          </Link>
          .
        </p>
      </CardContent>
    </Card>
  )
}

interface AvailabilityRowProps {
  label: string
  count: number
  total: number
  colorClassName: string
}

function AvailabilityRow({
  label,
  count,
  total,
  colorClassName,
}: AvailabilityRowProps) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0

  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <div className="flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-full ${colorClassName}`}
          aria-hidden="true"
        />
        <span className="font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="tabular-nums">
          {count}/{total}
        </span>
        <span className="text-xs">({percentage}%)</span>
      </div>
    </div>
  )
}
