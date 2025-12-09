# Story 3.2: Living Inventory Dashboard

Status: Done

## Story

As an Owner,
I want to see a visual representation of my rooms and their assets,
So that I can identify recurring issues or broken items.

## Acceptance Criteria

1. **Inventory Schema:** Create `rooms` and `inventory_items` tables.
    - `rooms`: id, name (e.g., "Room 101"), occupancy_status.
    - `inventory_items`: id, room_id, name (e.g., "Bed A"), condition (good, fair, poor), last_checked.
2. **Dashboard Visuals:** `/owner/dashboard` includes a "Room Health" section.
3. **Visualization:**
    - List of Rooms.
    - Each room shows stats: "3 Items, 1 Damaged".
    - Color coded: Green (All good), Yellow (Fair), Red (Poor/Damaged).
4. **Integration:** (Stretch) If a grievance is "Maintenance" for a room, flag that room. *For this story, let's stick to manual condition tracking first to keep scope small.*

## Tasks / Subtasks

## Tasks / Subtasks

- [x] **Task 1: Database Migration**
  - [x] Create `rooms` table.
  - [x] Create `inventory_items` table.
  - [x] Add RLS (Owner read/write, Tenant read-only for their room - *Simplicity: Owner only for now*).

- [x] **Task 2: Seed Data Script**
  - [x] Create a SQL seed script (or run manually) to add ~4 rooms and ~5 items each.

- [x] **Task 3: Room Health Component**
  - [x] Create `components/features/owner/room-health-grid.tsx`.
  - [x] Fetch data join `rooms` -> `inventory_items`.
  - [x] Calculate "Health Score" (Percent of items in 'good' condition).

- [x] **Task 4: Dashboard Update**
  - [x] Add `RoomHealthGrid` to `app/(protected)/owner/dashboard/page.tsx`.

## Dev Notes

### Technical Requirements
- **Join Query:** Use Supabase deep fetch: `supabase.from('rooms').select('*, inventory_items(*)')`.
- **Condition Enum:** `good`, `fair`, `poor`, `broken`.

## References

- [Epics] `docs/epics.md`

## Dev Agent Record

### Implementation Notes
- Created `rooms` and `inventory_items` tables with RLS and enums via migration `20251209142940_create_inventory.sql`.
- Migration also included seed data for rooms and items.
- Updated `types/supabase.ts` with new schema.
- Created `RoomHealthGrid` component to visualize room status and asset health.
- Updated `OwnerDashboardPage` to fetch room data (with nested inventory items) and display the grid alongside the grievance inbox.
- Updated logic to calculate occupancy rate dynamically.

### File List
- `supabase/migrations/20251209142940_create_inventory.sql` (created)
- `types/supabase.ts` (modified)
- `components/features/owner/room-health-grid.tsx` (created)
- `app/(protected)/owner/dashboard/page.tsx` (modified)

### Completion Notes
✅ Story 3.2 Complete - Living Inventory Dashboard
- Owners can now see a real-time snapshot of their property's health.
- Inventory items are tracked per room.
- Occupancy rates are calculated automatically.
- Ready for Epic 4: Guest Verification Portal.

