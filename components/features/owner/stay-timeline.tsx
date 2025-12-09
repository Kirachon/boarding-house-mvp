import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type StayAssignment = {
  id: string
  start_date: string
  end_date: string | null
  is_active: boolean
  tenant?: {
    full_name: string | null
  } | null
  room?: {
    name: string | null
  } | null
}

interface StayTimelineProps {
  assignments: StayAssignment[]
}

export function StayTimeline({ assignments }: StayTimelineProps) {
  if (!assignments.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current stays</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            There are no active stays right now.
          </p>
        </CardContent>
      </Card>
    )
  }

  const active = assignments.filter((assignment) => assignment.is_active)
  const recent = assignments
    .filter((assignment) => !assignment.is_active && assignment.end_date)
    .slice(0, 5)

  const formatDate = (date: string | null) =>
    date ? new Date(date).toLocaleDateString() : "—"

  const renderItem = (assignment: StayAssignment) => {
    const tenantName = assignment.tenant?.full_name || "Tenant"
    const roomName = assignment.room?.name || "Room"
    const startLabel = formatDate(assignment.start_date)
    const endLabel = assignment.is_active
      ? "Present"
      : formatDate(assignment.end_date)

    return (
      <li
        key={assignment.id}
        className="flex items-start justify-between gap-3 rounded-lg border bg-card px-3 py-2 text-sm"
      >
        <div className="space-y-1">
          <p className="font-medium">
            {tenantName} <span className="text-muted-foreground">in</span>{" "}
            {roomName}
          </p>
          <p className="text-xs text-muted-foreground">
            {startLabel} — {endLabel}
          </p>
        </div>
      </li>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current stays</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {active.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Active
            </p>
            <ul className="space-y-2">
              {active.map((assignment) => renderItem(assignment))}
            </ul>
          </div>
        )}

        {recent.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Recent check-outs
            </p>
            <ul className="space-y-2">
              {recent.map((assignment) => renderItem(assignment))}
            </ul>
          </div>
        )}

        {!active.length && !recent.length && (
          <p className="text-sm text-muted-foreground">
            There are no stays to show yet.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

