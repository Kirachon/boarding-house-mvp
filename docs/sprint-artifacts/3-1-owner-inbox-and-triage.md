# Story 3.1: Owner Inbox & Triage

Status: Done

## Story

As an Owner,
I want to see a list of all active grievances sorted by urgency,
So that I can quickly decide what to fix first.

## Acceptance Criteria

1. **Inbox View:** `/owner/dashboard` displays a list of all grievances with status `open` or `in_progress`.
2. **Sorting:** Items are sorted by date (oldest first) or severity (if we had it, but date is fine for now). 
3. **Status Management:** Owner can update status to `in_progress`, `resolved`, or `rejected`.
4. **Real-time:** The inbox updates in real-time (Owner subscription).
5. **Details:** Clicking a grievance shows full description and photo (if present).

## Tasks / Subtasks

## Tasks / Subtasks

- [x] **Task 1: Server Action Update**
  - [x] Add `updateGrievanceStatus(id, newStatus)` to `actions/grievance.ts`.
  - [x] Ensure only Owners can call this.

- [x] **Task 2: Owner Grievance List Component**
  - [x] Create `components/features/owner/owner-grievance-list.tsx`.
  - [x] Fetch all grievances (filter by role/RLS ensures they get all tenants).
  - [x] Implement Realtime subscription (similar to Tenant's but for *all* rows).
  - [x] UI: List/Table with actions to change status.

- [x] **Task 3: Dashboard Integration**
  - [x] Update `app/(protected)/owner/dashboard/page.tsx`.
  - [x] Replace placeholder stats with the actual Grievance List.

## Dev Notes

### Technical Requirements
- **RLS Check:** Ensure the "Owner view all" policy works as expected.
- **Optimistic UI:** When Owner clicks "Resolve", UI updates immediately.

## References

- [Epics] `docs/epics.md`

## Dev Agent Record

### Implementation Notes
- Implemented `updateGrievanceStatus` Server Action with strict Role check.
- Created `OwnerGrievanceList` client component with Supabase Realtime subscription for live updates.
- Integrated `Select` component for easier status toggling.
- Updated Owner Dashboard to fetch all grievances and display them.
- Linting passed.

### File List
- `actions/grievance.ts` (modified)
- `components/features/owner/owner-grievance-list.tsx` (created)
- `app/(protected)/owner/dashboard/page.tsx` (modified)

### Completion Notes
✅ Story 3.1 Complete - Owner Inbox & Triage
- Owners can now see all tenant grievances in one place.
- Status updates are real-time for both Owner and Tenant.
- Ready for Story 3.2: Living Inventory Dashboard.

