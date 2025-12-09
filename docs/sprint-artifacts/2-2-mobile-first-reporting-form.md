# Story 2.2: Mobile-First Reporting Form

Status: Done

## Story

As a Tenant,
I want to easily report an issue using a simple form on my phone,
So that I can notify the landlord without typing a long email.

## Acceptance Criteria

1. **Form UI:** A Shadcn UI form exists with:
    - **Category:** Select/Dropdown (wifi, cleaning, maintenance, other).
    - **Description:** Textarea (min 10 chars).
    - **Submit Button:** Shows "Submitting..." state.
2. **Mobile Optimization:** Input touches are large (min 44px), layout is single column.
3. **Integration:** Submitting calls `createGrievance` server action.
4. **Feedback:** Success triggers a toast notification and form reset; Error toast on failure.
5. **Placement:** Embed the form in `/tenant/dashboard` (initially) or a modal.

## Tasks / Subtasks

## Tasks / Subtasks

- [x] **Task 1: Create Form Component**
  - [x] Create `components/features/tenant/grievance-form.tsx`.
  - [x] Use `react-hook-form` + `zod` schema (mirroring backend schema).
  - [x] Implement UI with Shadcn components (`Select`, `Textarea`, `Button`).

- [x] **Task 2: Integrate Server Action**
  - [x] Connect `onSubmit` to `createGrievance` from `actions/grievance.ts`.
  - [x] Handle `useTransition` for loading state.
  - [x] Handle `toast` for success/error.

- [x] **Task 3: Embed in Dashboard**
  - [x] Update `app/(protected)/tenant/dashboard/page.tsx`.
  - [x] Add "Report an Issue" section/card containing the form.

## Dev Notes

### Technical Requirements
- **Client Component:** The form must be `"use client"`.
- **Zod Schema:** Define strict validation client-side to match server-side.

### Architecture Guidance
- **UX:** "Fire and Forget" means the form should be very quick to fill out.
- **Decision:** Omit Photo UI for this specific story to minimalize blockers, we can add it in a "Enhancement" story later.

## References

- [Epics] `docs/epics.md`
- [Shadcn] Form Component

## Dev Agent Record

### Implementation Notes
- Created `GrievanceForm` component (`components/features/tenant/grievance-form.tsx`) using Shadcn UI and React Hook Form.
- Integrated Zod validation with proper error mapping for enums.
- Connected form to `createGrievance` Server Action.
- Updated `app/(protected)/tenant/dashboard/page.tsx` to include the new form in a mobile-optimized card layout.
- Fixed linting error in dashboard description.

### File List
- `components/features/tenant/grievance-form.tsx` (created)
- `app/(protected)/tenant/dashboard/page.tsx` (modified)

### Completion Notes
✅ Story 2.2 Complete - Mobile-First Reporting Form
- Tenant can now see and submit grievances from their dashboard.
- Form handles validation, loading states, and success notifications.
- Ready for Story 2.3: Real-time "Pizza Tracker".

