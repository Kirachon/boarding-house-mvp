# Story 4.2: Verification Badges & Availability

Status: Done

## Story

As a Guest,
I want to see official verification badges and current room availability,
So that I feel safe booking a visit.

## Acceptance Criteria

1. **Verification Logic:**
    - Property or Owner needs a `is_verified` flag.
    - If true, display "Official Verified Partner" badge.
2. **Availability Count:**
    - Public page fetches count of rooms where `occupancy = 'vacant'` for that property.
    - Display "X Rooms Available" or "Fully Booked".
3. **Privacy:** Do not show which specific rooms are empty (security risk). Just the count.

## Tasks / Subtasks

## Tasks / Subtasks

- [x] **Task 1: Schema Update**
  - [x] Add `is_verified` (boolean) to `properties` table.
  - [x] Update seed data to set it to true.

- [x] **Task 2: Availability Logic**
  - [x] Update `getProperty` function (or new fetcher) to count vacant rooms.
  - [x] Ensure query is efficient (count only).

- [x] **Task 3: UI Updates**
  - [x] Property Page: Add dynamic Availability Status card/badge.
  - [x] Property Page: Enhance Verification Badge visual.

## Dev Notes

### Technical Requirements
- **Count Query:** `supabase.from('rooms').select('*', { count: 'exact', head: true }).eq('property_id', id).eq('occupancy', 'vacant')`

## References

- [Epics] `docs/epics.md`

## Dev Agent Record

### Implementation Notes
- Added `is_verified` column to `properties` table via migration.
- Updated `types/supabase.ts` to reflect the new column.
- Updated `app/verify/[id]/page.tsx` to:
    - Include `is_verified` logic to show "Official Verified Partner" badge.
    - Fetch and calculate `available_rooms` using an efficient `count` query on the `rooms` table.
    - Display a dynamic availability section (Green/Gray card) based on room vacancy.
- Linting passed.

### File List
- `supabase/migrations/20251209145111_add_verification.sql` (created)
- `types/supabase.ts` (modified)
- `app/verify/[id]/page.tsx` (modified)

### Completion Notes
✅ Story 4.2 Complete - Verification Badges & Availability
- The Public Profile Page is now a complete "Trust Beacon".
- Guests can see verification status and real-time room availability count.
- Privacy is preserved (vacant room IDs are not leaked).
- Ready for Epic 5.

