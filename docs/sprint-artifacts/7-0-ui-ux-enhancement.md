# Epic 7: UI/UX Enhancement & Feature Expansion

## Goal
Transform the operational MVP into a polished, feature-complete application by adding industry-standard features and improving the visual design.

---

## Current State Audit

### ✅ What We Have
- Tenant Management & Room Assignments
- Room CRUD with Occupancy Tracking
- Invoice Generation & Payment Status
- Grievance/Maintenance System
- Guest Verification Portal
- Basic Dashboard (Occupancy, Issues, Room Grid)

### ❌ What's Missing (Based on Industry Research)
- Announcements/Notices System
- Payment Reminder Automation
- Lease/Contract Date Tracking
- Expense Tracking (Utilities, Repairs)
- Analytics Charts (Occupancy Trends, Revenue)
- Mobile-Responsive Polish

---

## Proposed Changes

### 7.1 Design System & Branding
Establish a premium visual identity.

#### [MODIFY] [app/globals.css](file:///d:/GitProjects/boarding_house/app/globals.css)
- Switch from "Neutral" to "Trust Blue/Indigo" primary color
- Add glassmorphism utility classes

#### [MODIFY] [app/layout.tsx](file:///d:/GitProjects/boarding_house/app/layout.tsx)
- Add Inter or Outfit font family

---

### 7.2 Marketing Landing Page
Create a professional entry point.

#### [MODIFY] [app/page.tsx](file:///d:/GitProjects/boarding_house/app/page.tsx)
- Hero section with value proposition
- Features grid (Room Management, Billing, Verification)
- Call-to-action buttons

#### [NEW] components/landing/hero.tsx
#### [NEW] components/landing/features.tsx

---

### 7.3 Dashboard Enhancements

#### [MODIFY] [app/(protected)/owner/dashboard/page.tsx](file:///d:/GitProjects/boarding_house/app/(protected)/owner/dashboard/page.tsx)
- Add Financial Summary (Income/Outstanding/Overdue)
- Add Quick Actions toolbar (Add Tenant, Create Invoice)
- Add Lease Expiring Soon alerts
- Add Announcements widget

---

### 7.4 New Feature: Announcements System
Owner can post notices visible to all tenants.

#### Schema Changes
```sql
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### [NEW] actions/announcement.ts
#### [NEW] components/features/owner/announcement-form.tsx
#### [NEW] components/features/tenant/announcements-list.tsx

---

### 7.5 New Feature: Lease Management
Track contract dates and show expiry alerts.

#### Schema Changes
```sql
ALTER TABLE public.tenant_room_assignments
ADD COLUMN lease_start DATE,
ADD COLUMN lease_end DATE;
```

#### [NEW] components/features/owner/lease-expiry-alert.tsx
- Shows tenants with leases expiring in next 30 days

---

### 7.6 New Feature: Expense Tracking
Record property expenses for P&L calculation.

#### Schema Changes
```sql
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL, -- 'utilities', 'repairs', 'supplies', 'other'
  amount NUMERIC(10,2) NOT NULL,
  description TEXT,
  expense_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### [NEW] actions/expense.ts
#### [NEW] components/features/owner/expense-form.tsx
#### [NEW] components/features/owner/expense-list.tsx
#### [MODIFY] Finance page to show Expenses vs Income

---

### 7.7 Feature Polish

#### [MODIFY] components/features/owner/room-health-grid.tsx
- Color-coded status cards (Green=Vacant, Yellow=Maintenance, Red=Issues)

#### [MODIFY] components/features/owner/invoice-list.tsx
- Status badges with colors
- Empty state with illustration

---

## Implementation Priority

| Phase | Features | Effort |
|-------|----------|--------|
| **Phase 1** | Design System + Landing Page | 2-3 hours |
| **Phase 2** | Dashboard Financial Summary + Quick Actions | 1-2 hours |
| **Phase 3** | Announcements System | 2-3 hours |
| **Phase 4** | Lease Management + Expiry Alerts | 1-2 hours |
| **Phase 5** | Expense Tracking | 2-3 hours |
| **Phase 6** | Component Polish (Room Grid, Invoices) | 1-2 hours |

---

## Verification Plan
1. **Visual Check:** Landing page, Dashboard on Desktop and Mobile
2. **Functional Check:** Create announcement, add expense, view alerts
3. **Build Check:** Verify Vercel deployment succeeds
