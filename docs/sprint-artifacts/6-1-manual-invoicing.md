# Story 6.1: Manual Invoice Generation

Status: Ready for Review

## Story

As an Owner,
I want to generate a rent invoice for a tenant,
So that they receive a notification and can see what they owe.

## Acceptance Criteria

1. **Schema:** Create `invoices` table (id, tenant_id, amount, due_date, status, period, items JSON).
2. **Generation:**
    - Owner can click "Bill Tenant".
    - Manual entry of Amount and Due Date.
    - Default description "Rent for [Month]".
3. **Dashboards:**
    - **Owner:** See list of Overdue/Unpaid invoices.
    - **Tenant:** See "My Bills" section with Unpaid invoices highlighted.
4. **Notifications:** (Optional for this story, maybe just Realtime update?)
    - Let's stick to simple DB insert.

## Tasks / Subtasks

## Tasks / Subtasks

- [x] **Task 1: Schema**
  - [x] Create `invoices` table.
  - [x] RLS: Owner manages, Tenant views own.

- [x] **Task 2: Owner Invoice UI**
  - [x] `/owner/finance` page? Or just add to Tenant Details?
  - [x] Let's create `/owner/finance` as a hub.
  - [x] "Create Invoice" Modal.

- [x] **Task 3: Tenant Invoice View**
  - [x] Update `/tenant/dashboard` to show Invoices list.

## Dev Notes

### Technical Requirements
- **Status Enum:** 'unpaid', 'paid', 'overdue', 'cancelled'.
- **Items:** Store line items as JSONB for flexibility (Rent, Utilities, etc) or keep simple text description for MVP. Simple text description or single line item is fine for MVP.

## References

- [Epics] `docs/epics.md`

## Dev Agent Record

### Implementation Notes
- Created migration `20251209154758_create_invoices.sql` with `invoices` table and RLS.
- Updated `types/supabase.ts` for invoices table.
- Implemented `actions/invoice.ts`:
    - `createInvoice`: Creates invoice for a tenant.
    - `updateInvoiceStatus`: Allows Owner to mark as paid/cancelled.
- Components:
    - `InvoiceDialog`: Modal for Owner to create invoices.
    - `InvoiceList`: Table for Owner to view and manage all invoices.
    - `TenantInvoiceList`: Card component for Tenant to view their bills.
- Pages:
    - `/owner/finance`: Finance management hub.
    - Updated `/tenant/dashboard` to include the invoice list.
- Fixed multiple lint errors (unused imports, ts-ignore -> ts-expect-error -> removed, require -> import).
- Linting passed.

### File List
- `supabase/migrations/20251209154758_create_invoices.sql` (created)
- `types/supabase.ts` (modified)
- `actions/invoice.ts` (created)
- `components/features/owner/invoice-dialog.tsx` (created)
- `components/features/owner/invoice-list.tsx` (created)
- `components/features/tenant/tenant-invoice-list.tsx` (created)
- `app/(protected)/owner/finance/page.tsx` (created)
- `app/(protected)/tenant/dashboard/page.tsx` (modified)

### Completion Notes
✅ Story 6.1 Complete - Manual Invoicing
- Owners can now issue invoices to tenants.
- Tenants see their bills on their dashboard.
- Ready for Story 6.2: Payment Tracking & P/L.

