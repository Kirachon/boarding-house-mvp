# Implementation Readiness Assessment Report

**Date:** 2025-12-08
**Project:** boarding_house

## 1. Document Inventory

The following documents were identified and used for this assessment:

*   **PRD:** `d:/GitProjects/boarding_house/docs/prd.md`
*   **Architecture:** `d:/GitProjects/boarding_house/docs/architecture.md`
*   **Epics:** `d:/GitProjects/boarding_house/docs/epics.md`
*   **UX Design:** `d:/GitProjects/boarding_house/docs/ux-design-specification.md`

## 2. PRD Analysis

### Functional Requirements

*   **FR-01:** Users (Owners, Tenants) can log in via Email/Password.
*   **FR-02:** Owners can invite new Tenants via Email or SMS.
*   **FR-03:** Owners can deactivate a Tenants access upon move-out.
*   **FR-04:** Staff Members can only access assigned Grievance features (no Financials).
*   **FR-05:** Users can reset their password via email link.
*   **FR-06:** Owners can create Rooms with details (Number, Price, capacity, Amenities).
*   **FR-07:** Owners can manage "Living Inventory" items per room (e.g., Bed, AC) with status (Good, Needs Repair, Broken).
*   **FR-08:** Tenants can view the inventory list and current condition status of their assigned room.
*   **FR-09:** Owners can update the occupancy status of a room (Vacant/Occupied/Maintenance).
*   **FR-10:** Tenants can submit a Grievance Ticket with description, category, and photo attachment.
*   **FR-11:** Tenants can track the real-time status of their Grievance (Submitted -> In Progress -> Resolved).
*   **FR-12:** Owners/Staff can update the status of a Grievance tickets.
*   **FR-13:** The system must record an immutable Audit Log entry for every Grievance status change.
*   **FR-14:** Owners can assign specific Grievances to external Handyman contacts (text field).
*   **FR-15:** Tenants can "Rate" the resolution quality (1-5 stars) after a ticket is closed.
*   **FR-16:** Owners can manually generate a "Rent Invoice" for a Tenant.
*   **FR-17:** Owners can manually mark an invoice as "Paid" or "Overdue".
*   **FR-18:** Tenants can view their history of Invoices and Payment Status.
*   **FR-19:** Owners can view a basic "Profit & Loss" summary (Total Collected vs. Expenses).
*   **FR-20:** Guests can view a public gallery of the Boarding House with verified photos.
*   **FR-21:** Guests can see real-time availability of rooms (Vacant/Occupied dates).
*   **FR-22:** Guests can submit an "Inquiry Form" to the Owner.
*   **FR-23:** Tenants receive an automatic notification when their Grievance status changes.
*   **FR-24:** Tenants receive a notification when a new Rent Invoice is generated.
*   **FR-25:** Owners receive a notification when a new Grievance is submitted.

### Non-Functional Requirements

*   **NFR-01:** "Real-time" status updates (Grievance changes) must appear on the Tenants screen within **1 second** of the Owners action (using optimistic UI).
*   **NFR-02:** The Dashboard for Owners must load even with low bandwidth (3G speeds), utilizing offline-first caching for essential inventory data.
*   **NFR-03:** All API responses for CRUD operations must complete within **200ms**.
*   **NFR-04:** **Tenant Isolation:** A database query MUST NEVER return data belonging to a different Owner_ID (enforced via Row-Level Security policies).
*   **NFR-05:** All public-facing "Gallery" pages must not expose precise room numbers (e.g., "Room 101") until a booking is confirmed, to protect privacy.
*   **NFR-06:** Passwords must be hashed using Bcrypt with a work factor of at least 10.
*   **NFR-07:** The "Grievance Submission" flow must be completable in **< 3 taps** on a mobile device.
*   **NFR-08:** Touch targets on buttons must be at least 44x44 pixels to accommodate thumb usage on mobile.
*   **NFR-09:** The application must support "Dark Mode" native to the operating system setting (for late-night grievance checks).
*   **NFR-10:** Audit Logs for Grievances are **immutable**; not even the Database Administrator should be able to alter a recorded history event.
*   **NFR-11:** The system availability target is **99.9%** during waking hours (6 AM - 12 AM).

### Additional Requirements

*   **Innovation:** "Radial Transparency" and "Living Inventory" concepts.
*   **SaaS Context:** Multi-tenant architecture with shared database and logical isolation.

## 3. Epic Coverage Validation

### Coverage Matrix

| FR Number | PRD Requirement | Epic Coverage | Status |
|-----------|----------------|---------------|---------|
| FR-01 | Users can log in via Email/Password | Epic 1 Story 1.3 | ✓ Covered |
| FR-02 | Owners can invite new Tenants | **NOT EXPLICITLY FOUND** | ❌ MISSING |
| FR-03 | Owners can deactivate a Tenants access | **NOT EXPLICITLY FOUND** | ❌ MISSING |
| FR-04 | Staff Members restrict access | Epic 1 Story 1.4 (RBAC) | ✓ Partially Covered (Staff role mentioned?) |
| FR-05 | Users can reset their password | Epic 1 (Implicit in Supabase Auth?) | ⚠️ Implicit |
| FR-06 | Owners can create Rooms | **NOT EXPLICITLY FOUND** | ❌ MISSING |
| FR-07 | Owners can manage "Living Inventory" | Epic 3 Story 3.2 | ✓ Covered |
| FR-08 | Tenants can view inventory | Epic 3 (Implicit in Living Inventory?) | ⚠️ Implicit |
| FR-09 | Owners can update occupancy status | **NOT EXPLICITLY FOUND** | ❌ MISSING |
| FR-10 | Tenants can submit a Grievance | Epic 2 Story 2.2 | ✓ Covered |
| FR-11 | Tenants can track Grievance status | Epic 2 Story 2.3 | ✓ Covered |
| FR-12 | Owners update Grievance status | Epic 3 Story 3.1 | ✓ Covered |
| FR-13 | Audit Log for Grievance status | Epic 3 (Mentioned? NFR-10) | ⚠️ Implicit |
| FR-14 | Owners assign Handyman | Epic 3 Story 3.1 (Assign Priority mentioned, Handyman?) | ⚠️ Implicit |
| FR-15 | Tenants rate resolution | **NOT EXPLICITLY FOUND** | ❌ MISSING |
| FR-16 | Owners generate Rent Invoice | **NOT EXPLICITLY FOUND** | ❌ MISSING (Manual MVP) |
| FR-17 | Owners mark invoice Paid/Overdue | **NOT EXPLICITLY FOUND** | ❌ MISSING (Manual MVP) |
| FR-18 | Tenants view Invoice history | **NOT EXPLICITLY FOUND** | ❌ MISSING (Manual MVP) |
| FR-19 | Owners view Profit & Loss | **NOT EXPLICITLY FOUND** | ❌ MISSING (Manual MVP) |
| FR-20 | Guests view public gallery | Epic 4 Story 4.1 | ✓ Covered |
| FR-21 | Guests see room availability | Epic 4 Story 4.2 | ✓ Covered |
| FR-22 | Guests submit Inquiry Form | **NOT EXPLICITLY FOUND** | ❌ MISSING |
| FR-23 | Tenants notify on status change | Epic 2 Story 2.3 (Realtime updates) | ✓ Covered |
| FR-24 | Tenants notify on new Invoice | **NOT EXPLICITLY FOUND** | ❌ MISSING |
| FR-25 | Owners notify on new Grievance | Epic 3 Story 3.1 (Inbox) | ✓ Covered |

### Missing Requirements

#### Critical Missing FRs

*   **FR-02, FR-03 (Tenant Management):** No story covers inviting or removing tenants. Essential for onboarding.
    *   *Recommendation:* Add to Epic 1 or new Epic.
*   **FR-06 (Room Creation):** No story for creating the rooms that Inventory and Grievances attach to.
    *   *Recommendation:* Add to Epic 3 (Inventory).
*   **FR-16 to FR-19 (Financials):** Entire Financial Management module (Manual MVP) is missing from Epics.
    *   *Recommendation:* Create "Epic 5: Financials (MVP)" or add to Epic 3.

#### High Priority Missing FRs

*   **FR-22 (Guest Inquiry):** Public portal allows viewing but not contacting (Inquiry Form).
*   **FR-15 (Ratings):** Closing the loop with ratings is key to the "Trust Loop" vision but missing from stories.

### Coverage Statistics

*   **Total PRD FRs:** 25
*   **FRs covered in epics:** ~12 (Explicitly)
*   **Coverage percentage:** ~48%

## 5. Epic Quality Review

### Epic Structure Validation

*   **Epic 1 (Foundation):** Technical in nature but framed as "User Auth" value. **Pass.**
*   **Epic 2 (Trust Loop):** High user value. Independent of Epic 3. **Pass.**
*   **Epic 3 (Inventory):** Builds on Epic 1 & 2. Independent of Epic 4. **Pass.**
*   **Epic 4 (Guest):** Independent value. **Pass.**

### Story Quality Assessment

*   **Sizing:** All stories appear single-dev accessible.
*   **Dependencies:**
    *   Story 1.1 (Init) is correctly placed first.
    *   Story 1.2 (Schema) precedes 1.3 (UI) and 1.4 (RBAC). **Good sequence.**
    *   Story 2.1 (Schema) precedes 2.2 (UI). **Good sequence.**

### Best Practices Violations

#### 🟠 Major Issues
*   **Database Creation Timing:** Story 1.2 "Role Schema" implies creating `public.profiles`. Does it also create `users`? (Implicit in Supabase Auth, but good to clarify).
*   **Implicit UI:** Story 1.3 "Login UI" assumes a specific design but doesn't reference the UX spec explicitly in ACs.

### Quality Score: 90/100
## 6. Summary and Recommendations

### Overall Readiness Status

**🔴 NOT READY FOR IMPLEMENTATION** (Status: NEEDS WORK)

### Critical Issues Requiring Immediate Action

1.  **Missing Tenant Management:** How do users get into the system? FR-02 (Invite) and FR-03 (Deactivate) are not in any epic. This blocks actual usage.
2.  **Missing Financials (MVP):** The PRD lists "Manual Billing" (FR-16 to FR-19) as part of the MVP. This is completely missing from Epics.
3.  **Missing Room Creation:** You cannot "Manage Inventory" (Epic 3) if you cannot "Create Rooms" (Missing FR-06).

### Recommended Next Steps

1.  **Create "Epic 5: Core Management":**
    *   Story 5.1: Create Rooms (CRUD).
    *   Story 5.2: Invite/Manage Tenants.
2.  **Create "Epic 6: Financials (MVP)":**
    *   Story 6.1: Generate Invoices.
    *   Story 6.2: Mark as Paid/Overdue.
3.  **Update Implementation Plan:** Do not start coding until these "Core Data" stories exist. You cannot build the "Trust Loop" (Grievances) without Tenants having Rooms to complain about.

### Final Note

This assessment identified **3 critical gaps** that would block development immediately after the "Hello World" phase. Specifically, the "middle layer" of management (Rooms, Tenants, Bills) was skipped in favor of the "flashy" layer (Grievances). Address these gaps to ensure a viable MVP.
