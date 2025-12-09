# Story 6.2: Payment Tracking & P/L

Status: Done

## Story

As an Owner,
I want to mark an invoice as "Paid" when I receive cash/transfer, and see my total monthly income,
So that I can track who has paid and view my basic Profit & Loss.

## Acceptance Criteria

1. **Mark Paid:** (Already implemented in 6.1 via `updateInvoiceStatus`).
2. **P/L Summary:**
    - Owner sees a summary card on `/owner/finance` showing:
        - Total Income This Month (sum of paid invoices).
        - Total Outstanding (sum of unpaid invoices).
        - Optionally: Total Overdue.
3. **Optimistic UI:** (Nice to have - current approach revalidates path).

## Tasks / Subtasks

## Tasks / Subtasks

- [x] **Task 1: P/L Summary Component**
  - [x] Create `FinanceSummary` component.
  - [x] Calculate: Total Paid (Current Month), Total Outstanding.

- [x] **Task 2: Integrate into Finance Page**
  - [x] Add summary cards above the invoice list.

## Dev Notes

### Technical Requirements
- **Date Filtering:** Filter invoices by `created_at` for current month OR use `due_date`.
- **Calculation:** Simple `reduce` on fetched invoices.

## References

- [Epics] `docs/epics.md`

## Dev Agent Record

### Implementation Notes
- Created `FinanceSummary` component with three metric cards:
    - **Income This Month:** Sum of paid invoices with due_date in current month.
    - **Outstanding:** Sum of unpaid/overdue invoices.
    - **Overdue:** Sum of overdue invoices (past due date).
- Integrated into `/owner/finance` page above the invoice list.
- Page fetches raw invoices separately for summary calculation.
- Linting passed.

### File List
- `components/features/owner/finance-summary.tsx` (created)
- `app/(protected)/owner/finance/page.tsx` (modified)

### Completion Notes
✅ Story 6.2 Complete - Payment Tracking & P/L
- Owners now have a clear financial overview.
- Epic 6 is COMPLETE.
- All 6 Epics are now COMPLETE! 🎉

