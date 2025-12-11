'use client'

import { useState, useTransition } from 'react'
import { Database } from '@/types/supabase'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { assignVendorToWorkOrder, createWorkOrderFromGrievance, updateWorkOrderStatus } from '@/actions/maintenance'
import { toast } from 'sonner'
import { Loader2, ClipboardList, Wrench } from 'lucide-react'

type Grievance = Database['public']['Tables']['grievances']['Row']
type Room = Database['public']['Tables']['rooms']['Row']
// Local interface since vendors table may not exist in generated types
interface Vendor {
  id: string
  name: string
}
type WorkOrderStatus = Database['public']['Enums']['work_order_status']

type WorkOrder = Database['public']['Tables']['work_orders']['Row'] & {
  room?: { id: string; name: string } | null
  vendor?: { id: string; name: string } | null
}

interface MaintenanceBoardProps {
  grievances: Grievance[]
  workOrders: WorkOrder[]
  vendors: Vendor[]
  rooms: Room[]
}

const statusLabel: Record<WorkOrderStatus, string> = {
  open: 'Open',
  in_progress: 'In progress',
  waiting_vendor: 'Waiting vendor',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

const statusVariant: Record<WorkOrderStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  open: 'secondary',
  in_progress: 'default',
  waiting_vendor: 'outline',
  completed: 'outline',
  cancelled: 'destructive',
}

export function MaintenanceBoard({ grievances, workOrders, vendors, rooms }: MaintenanceBoardProps) {
  const [isPending, startTransition] = useTransition()
  const [selectedRooms, setSelectedRooms] = useState<Record<string, string | 'none'>>({})

  const maintenanceTickets = grievances.filter((g) => g.category === 'maintenance')

  const handleCreateWorkOrder = (id: string) => {
    startTransition(async () => {
      const selectedRoomId = selectedRooms[id]
      const res = await createWorkOrderFromGrievance(
        id,
        !selectedRoomId || selectedRoomId === 'none' ? undefined : selectedRoomId
      )
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success('Work order created')
      }
    })
  }

  const handleStatusChange = (id: string, status: WorkOrderStatus) => {
    startTransition(async () => {
      const res = await updateWorkOrderStatus(id, status)
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success('Status updated')
      }
    })
  }

  const handleVendorChange = (id: string, vendorId: string | 'none') => {
    startTransition(async () => {
      const res = await assignVendorToWorkOrder(id, vendorId === 'none' ? null : vendorId)
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success('Vendor updated')
      }
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border-dashed border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 flex items-center justify-center">
              <ClipboardList className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base">Maintenance tickets</CardTitle>
              <p className="text-xs text-muted-foreground">
                Tenant-submitted issues tagged as maintenance.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {maintenanceTickets.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No open maintenance grievances right now.
            </p>
          ) : (
            maintenanceTickets.map((g) => (
              <div
                key={g.id}
                className="flex flex-col gap-2 rounded-md border bg-card/60 px-3 py-2.5 text-sm"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-medium line-clamp-2">{g.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Room</span>
                    <Select
                      value={selectedRooms[g.id] ?? 'none'}
                      onValueChange={(val) =>
                        setSelectedRooms((prev) => ({ ...prev, [g.id]: val }))
                      }
                      disabled={isPending}
                    >
                      <SelectTrigger className="h-8 w-32 text-xs">
                        <SelectValue placeholder="Unassigned" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Unassigned</SelectItem>
                        {rooms.map((room) => (
                          <SelectItem key={room.id} value={room.id}>
                            {room.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      variant="outline"
                      className="shrink-0"
                      disabled={isPending}
                      onClick={() => handleCreateWorkOrder(g.id)}
                    >
                      {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Create'
                      )}
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Reported on {new Date(g.created_at ?? '').toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 flex items-center justify-center">
              <Wrench className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base">Work orders</CardTitle>
              <p className="text-xs text-muted-foreground">
                Track assigned maintenance tasks and vendor work.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {workOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No work orders yet. Convert a maintenance grievance into a work order to begin tracking.
            </p>
          ) : (
            workOrders.map((wo) => (
              <div
                key={wo.id}
                className="flex flex-col gap-3 rounded-md border bg-card/60 px-3 py-2.5 text-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium line-clamp-1">{wo.title}</p>
                      <Badge variant={statusVariant[wo.status]}>
                        {statusLabel[wo.status]}
                      </Badge>
                    </div>
                    {wo.room && (
                      <p className="text-xs text-muted-foreground">
                        Room: <span className="font-medium">{wo.room.name}</span>
                      </p>
                    )}
                    {wo.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {wo.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Status</span>
                    <Select
                      defaultValue={wo.status}
                      onValueChange={(val) =>
                        handleStatusChange(wo.id, val as WorkOrderStatus)
                      }
                      disabled={isPending}
                    >
                      <SelectTrigger className="h-8 w-40 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In progress</SelectItem>
                        <SelectItem value="waiting_vendor">Waiting vendor</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Vendor</span>
                    <Select
                      defaultValue={(wo as any).vendor_id ?? 'none'}
                      onValueChange={(val) =>
                        handleVendorChange(wo.id, val as string | 'none')
                      }
                      disabled={isPending}
                    >
                      <SelectTrigger className="h-8 w-44 text-xs">
                        <SelectValue placeholder="Unassigned" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Unassigned</SelectItem>
                        {vendors.map((v) => (
                          <SelectItem key={v.id} value={v.id}>
                            {v.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
