# Story 5.1: Room Management (CRUD)

Status: Done

## Story

As an Owner,
I want to add and configure rooms (Number, Capacity, Price),
So that I can assign tenants and inventory to them.

## Acceptance Criteria

1. **Schema Update:** Update `rooms` table to include `price` (numeric) and `capacity` (int).
2. **Management UI:** Create `/owner/rooms` page.
3. **List View:** Display all rooms with their details (Name, Occupancy, Price, Capacity).
4. **CRUD Actions:**
    - **Create:** Modal/Form to add a new room.
    - **Update:** Edit room details.
    - **Delete:** Remove a room (Optional constraint: prevent if occupied?).

## Tasks / Subtasks

## Tasks / Subtasks

- [x] **Task 1: Schema Migration**
  - [x] Add `price` and `capacity` columns to `rooms`.
  - [x] Add policy for DELETE (Owners only).

- [x] **Task 2: Server Actions**
  - [x] `createRoom`, `updateRoom`, `deleteRoom`.
  - [x] Validate inputs (Zod).

- [x] **Task 3: Room Management UI**
  - [x] Create `app/(protected)/owner/rooms/page.tsx`.
  - [x] Create `components/features/owner/room-data-table.tsx` (using Shadcn Table or simple list).
  - [x] Create `components/features/owner/room-dialog.tsx` (Add/Edit Form).

## Dev Notes

### Technical Requirements
- **Validation:** Price must be positive. Capacity must be >= 1.
- **UX:** Use a Dialog for Add/Edit to keep context.

## References

- [Epics] `docs/epics.md`

## Dev Agent Record

### Implementation Notes
- Created migration `20251209153629_update_rooms.sql` adding `price` and `capacity` to `rooms`, and allowing owners to DELETE.
- Updated Typescript types.
- Implemented `actions/room.ts` with Zod validation for safe CRUD operations.
- Built `RoomDialog` component for reusable Add/Edit modal.
- Built `RoomDataTable` using Shadcn table for listing rooms with Edit/Delete actions.
- Assembled `/owner/rooms/page.tsx` as the main management view.
- Linting passed.

### File List
- `supabase/migrations/20251209153629_update_rooms.sql` (created)
- `types/supabase.ts` (modified)
- `actions/room.ts` (created)
- `components/features/owner/room-dialog.tsx` (created)
- `components/features/owner/room-data-table.tsx` (created)
- `app/(protected)/owner/rooms/page.tsx` (created)

### Completion Notes
✅ Story 5.1 Complete - Room Management CRUD
- Owners can fully manage their room inventory.
- Data flows correctly from UI to DB via Server Actions.
- Validations ensure clean data (no negative prices).
- Ready for Story 5.2: Tenant Onboarding.

