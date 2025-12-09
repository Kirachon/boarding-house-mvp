# Story 2.1: Grievance Schema & Actions

Status: Done

## Story

As a Developer,
I want to create the database table and Server Actions for grievances,
So that the frontend has an API to submit reports.

## Acceptance Criteria

1. **Schema Definition:** `grievances` table exists with columns:
    - `id` (UUID, PK)
    - `tenant_id` (UUID, FK to auth.users)
    - `category` (Enum: 'wifi', 'cleaning', 'maintenance', 'other')
    - `description` (Text)
    - `photo_url` (Text, optional)
    - `status` (Enum: 'open', 'in_progress', 'resolved', 'rejected')
    - `created_at` (Timestamp)
2. **RLS Policies:**
    - Tenants: Can INSERT (own ID) and SELECT (own ID).
    - Owners: Can SELECT (all tenant grievances) and UPDATE (status).
3. **Database Types:** TypeScript definitions generated/updated in `types/supabase.ts`.
4. **Server Action:** `createGrievance(formData)` implemented in `actions/grievance.ts` with Zod validation.

## Tasks / Subtasks

## Tasks / Subtasks

- [x] **Task 1: Database Migration**
  - [x] Define Enums: `grievance_category`, `grievance_status`.
  - [x] Create Table: `public.grievances`.
  - [x] Enable RLS.
  - [x] Add Policies (Tenant View/Create, Owner View/Update).

- [x] **Task 2: Update Types**
  - [x] Update `types/supabase.ts` with new table and enums.

- [x] **Task 3: Server Actions**
  - [x] Create `actions/grievance.ts`.
  - [x] Implement `createGrievance` with Zod schema (`category`, `description`).
  - [x] Handle error states and validation.

## Dev Notes

### Technical Requirements
- **Validation:** Enforce `tenant_id` matches `auth.uid()` on the server side (Action or RLS, ideally both/Action sets it from session).
- **Status Defaults:** Default status should be `open`.

### Architecture Guidance
- **File Structure:**
  ```
  actions/
    grievance.ts
  supabase/
    migrations/
      ..._grievances.sql
  ```

## References

- [Epics] `docs/epics.md`
- [Supabase] Database/Auth Rules

## Dev Agent Record

### Implementation Notes
- Created migration `20251209133753_create_grievances.sql` defining `grievances` table, enums, and RLS policies.
- Updated `types/supabase.ts` to include `grievances` table and new enums.
- Created `actions/grievance.ts` with `createGrievance` Server Action, including Zod validation and server-side `tenant_id` assignment.
- Linting passed.

### File List
- `supabase/migrations/20251209133753_create_grievances.sql` (created)
- `types/supabase.ts` (modified)
- `actions/grievance.ts` (created)

### Completion Notes
✅ Story 2.1 Complete - Grievance Backend Ready
- Database ready for grievance data.
- API (Server Action) ready for frontend integration.
- Ready for Story 2.2: Mobile-First Reporting Form.

