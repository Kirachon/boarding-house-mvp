---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
workflowCompleted: true
inputDocuments: []
documentCounts:
  briefs: 0
  research: 0
  brainstorming: 0
  projectDocs: 0
workflowType: 'prd'
lastStep: 0
project_name: 'boarding_house'
user_name: 'Preda'
date: '2025-12-08'
---

# Product Requirements Document - boarding_house

**Author:** Preda
**Date:** 2025-12-08

## Executive Summary

The **boarding_house** application identifies as a **SaaS B2B** platform designed for **building owners** in the **Real Estate / Property Management** domain. Its core mission is to revolutionize the management of boarding houses by providing a visually appealing, transparent, and comprehensive monitoring system.

Key capabilities include:
- **Inventory Monitoring:** Comprehensive tracking of "Room Condition + Occupancy Status" (not just vacancy).
- **Feedback Loop:** Dedicated channels for capturing grievances with **Real-time Status Tracking** to ensure transparency.
- **Visual Appeal:** A revolutionary, **Mobile-First**, high-fidelity user interface that enhances trust and usability.

### What Makes This Special

The primary differentiator for **boarding_house** is **Transparency impacting Trust**.

By making account monitoring transparent for boarders and operations transparent for owners, the platform challenges the opaque nature of traditional boarding house management. The "Aha!" moment occurs when users realize they have complete, real-time visibility into their living or management situation in a visually stunning environment.

## Project Classification

**Technical Type:** SaaS B2B
**Domain:** Real Estate / Property Management
**Complexity:** Medium
**Project Context:** Greenfield - new project

This classification suggests a focus on:
- **Open Source Strategy:** Leveraging a cost-effective, robust stack (React, Node.js, PostgreSQL) to maximize ROI for owners.
- **Mobile-First Experience:** Ensuring tenants and owners can manage everything from their phones.
- **Data Integrity:** Reliable inventory and issue tracking.


## Success Criteria

### User Success

*   **Financial & Inventory Accuracy:** The Boarding House Owner says "this was worth it" when every penny and every room item is accounted for without manual spreadsheet errors.
*   **Operational Efficiency:** Success is defined by the ability to capture and address 100% of tenant grievances and maintenance needs within the platform.
*   **Peace of Mind:** The "Aha!" moment happens when the owner realizes they have better monitoring capabilities with less effort and cost ("cost-effective monitoring").

### Business Success

*   **Occupancy Stability:** The primary indicator that "this is working" is maintaining **stable full capacity** occupancy for 12 months.
*   **User Growth & Engagement:** Success is measured by consistent month-over-month growth in active users (tenants engaging with the platform) and positive user reviews.
*   **Platform Stickiness:** High engagement rates where tenants and owners use the app as their primary communication channel.

### Technical Success

*   **Real-time Reliability:** System maintains accuracy of inventory and grievance status with < 1s latency for updates (supporting the "Transparency impact Trust" goal).
*   **Mobile Performance:** The application performs flawlessly on mobile devices, ensuring accessibility for all user types.
*   **Data Integrity:** Zero discrepancy between physical inventory/payments and digital records.

### Measurable Outcomes

*   **Occupancy Rate:** Achieve and maintain >95% occupancy rate over a 12-month period.
*   **Issue Resolution Time:** Reduce average time to resolve grievances by 30% through transparent tracking.
*   **User Satisfaction:** Achieve a User Review rating of > 4.5/5 stars from both Tenants and Owners.

## Product Scope

### MVP - Minimum Viable Product

*   **Core RBAC:** Admin (Owner), Tenant, Guest roles.
*   **Inventory Management:** Track Room Condition + Occupancy Status.
*   **Grievance System:** Create, Track, and Resolve issues with real-time updates.
*   **Mobile-First Dashboard:** Responsive web app for monitoring key metrics.
*   **Basic Financials:** Track rent payments and basic expenses.

### Growth Features (Post-MVP)

*   **Advanced Analytics:** Trends in occupancy, grievance types, and financial forecasting.
*   **Automated Notifications:** SMS/Email alerts for rent due or urgent grievances.
*   **Asset Depreciation Tracking:** Detailed history of room items (bed, fan, etc.) to predict replacement needs.

### Vision (Future)

*   **Smart Building Integration:** IoT integration for automated utility meter reading.
*   **Multi-Property Support:** Scaling the platform to manage multiple boarding houses seamlessly.
*   **Community Features:** Events and social features for boarders to build community.


## User Journeys

### Journey 1: Elena - From Chaos to Control (The Owner)
Elena owns a 20-room boarding house. Before **boarding_house**, she managed everything on a whiteboard and a messy Excel sheet. Rent collection was a headache, often relying on trust and memory. One day, a tenant moved out without paying owing to a "lost record." Frustrated, Elena switches to **boarding_house**.

On her first login, she sees the **Dashboard**—a visual layout of her building. Room 104 is flashing red (Rent Overdue). Room 202 is yellow (Open Grievance). She clicks Room 104 and sends a pre-generated payment reminder via SMS. Then, she checks the grievance for 202: "Leaking Faucet." She assigns it to her handyman immediately within the app.

**The Climax:** At the end of the month, she generates a "Profit & Loss" report in one click. She realizes she's collected 100% of rent for the first time in years. The transparency of the system made it impossible for payments to slip through the cracks.

### Journey 2: Marcus - Living with Peace of Mind (The Tenant)
Marcus moves into Room 305. In his previous place, the landlord never fixed anything. On move-in day, he receives a login to **boarding_house**. He notices the AC isn't cooling well. Instead of an awkward text, he opens the app and logs a "Grievance" with a photo.

Instantly, he sees the status change to "Submitted." Two hours later, he gets a notification: "Status: In Progress - Handyman Assigned." He feels heard. The next day, the issue is resolved, and he rates the service 5 stars. When rent is due, he pays directly through the app and sees his "Paid" status update immediately. He feels secure knowing his payments are recorded transparently.

### Journey 3: Sarah - The Trust-First Search (The Guest)
Sarah is looking for a room. She's tired of seeing fake photos online. She lands on the **boarding_house** public portal for Elena's building. She sees "Verified" room photos and a calendar showing *real-time* availability, not just a "Call for Info" button.

She filters by "AC" and "Private Bath." She sees Room 201 is available starting next week. Impressed by the professional presentation and transparency, she sends an inquiry. She receives an automated response confirming her inquiry is with the verified owner. She feels safe booking a viewing.

### Journey Requirements Summary

These journeys reveal requirements for:

*   **Owner Dashboard:** Visual status indicators (Red/Yellow/Green) for Room and Tenant status.
*   **Grievance Workflow:** Ticket creation, photo upload, status states (Submitted -> In Progress -> Resolved), and assignment logic.
*   **Tenant Portal:** Payment history view, real-time grievance tracking, and mobile-optimized interface.
*   **Public Portal:** Verified gallery, real-time availability calendar, and detailed search/filter capability.
*   **Automated Communication:** SMS/Email notifications for critical events (Rent, Status Changes).


## Innovation & Novel Patterns

### Detected Innovation Areas

**1. Radial Transparency as a Service (TaaS):**
Unlike effective property management tools that obscure issues, **boarding_house** gamifies resolution. By exposing "Real-time Grievance Status" to the boarder, we flip the dynamic from "Landlord vs. Tenant" to "Collaborative Maintenance." This level of transparency in the Boarding House market (typically opaque) is the disruption.

**2. The "Living Inventory" Model:**
We are shifting from static inventory (Bed, Chair) to "Living Inventory" (Bed - Clean Condition, Chair - Needs Repair). The asset tracks its own lifecycle through tenant feedback, predicting maintenance before breakage.

### Market Context & Competitive Landscape

*   **Current State:** Market is dominated by generic PMS (Property Management Systems) that are too complex (enterprise) or too simple (Excel/Notion).
*   **The Gap:** No specific solution exists for the *Boarding House* niche that focuses on the *Tenant Experience* as the driver for *Owner Profitability*.
*   **Opportunity:** Become the standard for "Premium Boarding" experiences.

### Validation Approach

*   **Trust Metrics:** We will measure "Time to Ticket Closure" correlated with "Tenant Retention Rate." faster closure = longer stays.
*   **The "Nudge" Experiment:** validate if automated "Rent Due" SMS reminders (Transparent Nudges) are more effective than manual collections.

### Risk Mitigation

*   **Risk:** Owners may fear transparency reveals too much incompetence.
*   **Mitigation:** "Private Mode" for sensitivity issues, but incentivize "Public Resolution" with badges/ratings (e.g., "Super Host" equivalent).


## SaaS B2B Specific Requirements

### Project-Type Overview
**boarding_house** operates as a multi-tenant SaaS platform where every "Boarding House" is a distinct tenant context. While the database is shared (to reduce hosting costs), logical isolation via Row-Level Security ensures strict data privacy between different building owners.

### Technical Architecture Considerations

*   **Tenant Strategy:** Shared Database, Shared Schema with `tenant_id` isolation.
*   **Authentication:** JWT-based stateless authentication.
    *   *Identity Provider:* Custom Auth (Node.js + Bcrypt) or Supabase Auth (Open Source tier) to keep costs low.
*   **Real-time Engine:** Socket.io namespace per tenant to broadcast updates (e.g., "New Grievance") only to relevant users.

### Tenant Model & Permissions

*   **Isolation Level:** Strict logical separation. An Owner can NEVER see another Owner Data. A Tenant can ONLY see their specific Room details and Building-wide announcements.
*   **RBAC Matrix:**
    *   **Owner:** CRUD on everything (Rooms, Tenants, Finances).
    *   **Staff:** View Grievances, Update Grievance Status. NO access to Financials.
    *   **Tenant:** View own Profile, Create Grievance, View Bill.
    *   **Guest:** View Public Availability Calendar.

### Compliance & Data Integrity

*   **Audit Trail:** A dedicated `audit_logs` table tracks every CREATE/UPDATE/DELETE action.
    *   *Fields:* `user_id`, `action`, `resource_id`, `timestamp`, `old_value`, `new_value`.
    *   *Purpose:* Resolution of disputes (e.g., "I paid rent on time" vs "System shows late").
*   **Data Retention:** Grievance history is never deleted, only "Archived," to maintain the long-term trust score of the building.

### Implementation Considerations

*   **API Design:** RESTful API with standardized Resource URLs (e.g., `/api/v1/tenants/:id/grievances`).
*   **Rate Limiting:** Basic implementation (e.g., `express-rate-limit`) to prevent API abuse from malicious guests.


## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** **Experience MVP**
We prioritize the "Transparency Experience" (UI/UX, Real-time status) over backend complexity (Billing integrations). The goal is to prove that "radical transparency" increases tenant retention.

**Resource Requirements:**
*   1 Senior Frontend Dev (React/Vite/Tailwind) - Critical for "Wow" factor.
*   1 Full Stack Dev (Node/Postgres) - For RBAC and Real-time logic.
*   1 Designer - For the Mobile-first, "Home-like" aesthetic.

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
*   **Elena (Owner):** Visual Dashboard, Inventory Tracking, Grievance Management.
*   **Marcus (Tenant):** Mobile Grievance Submission, Status Tracking, Bill Viewing (Read-only).
*   **Sarah (Guest):** Trusted Public Gallery Search.

**Must-Have Capabilities:**
*   **Real-time "Trust Engine":** Incident tracking with strict audit logs.
*   **Living Inventory:** Asset status updates (Good/Damaged/Fixed).
*   **Visual Dashboard:** High-fidelity "Digital Twin" of the boarding house.
*   **Manual Billing:** Owners mark invoices as "Paid"; no Stripe integration yet.

### Post-MVP Features

**Phase 2 (Growth):**
*   **Integrated Payments:** Stripe/PayPal integration for automated rent collection.
*   **Advanced Analytics:** "Tenant Retention Score" and "Owner MRI" (Maintenance ROI).
*   **Community Board:** Event planning and social features for tenants.

**Phase 3 (Expansion):**
*   **PropTech IoT:** Integration with smart locks and electricity meters.
*   **Multi-Property Franchise:** Features for managing chains of boarding houses.

### Risk Mitigation Strategy

*   **Technical Risks:** *Real-time Sync issues.* Mitigation: Use optimistic UI updates to make the app feel instant even on slow connections.
*   **Market Risks:** *Owners rejecting transparency.* Mitigation: Launch with "Beta Partners" (forward-thinking owners) to build case studies proving higher ROI.
*   **Resource Risks:** *Frontend complexity.* Mitigation: Use a robust UI component library (e.g., shadcn/ui) to speed up development without sacrificing quality.


## Functional Requirements

### Authentication & User Management
*   **FR-01:** Users (Owners, Tenants) can log in via Email/Password.
*   **FR-02:** Owners can invite new Tenants via Email or SMS.
*   **FR-03:** Owners can deactivate a Tenants access upon move-out.
*   **FR-04:** Staff Members can only access assigned Grievance features (no Financials).
*   **FR-05:** Users can reset their password via email link.

### "Living Inventory" & Room Management
*   **FR-06:** Owners can create Rooms with details (Number, Price, capacity, Amenities).
*   **FR-07:** Owners can manage "Living Inventory" items per room (e.g., Bed, AC) with status (Good, Needs Repair, Broken).
*   **FR-08:** Tenants can view the inventory list and current condition status of their assigned room.
*   **FR-09:** Owners can update the occupancy status of a room (Vacant/Occupied/Maintenance).

### Grievance & Trust Engine
*   **FR-10:** Tenants can submit a Grievance Ticket with description, category, and photo attachment.
*   **FR-11:** Tenants can track the real-time status of their Grievance (Submitted -> In Progress -> Resolved).
*   **FR-12:** Owners/Staff can update the status of a Grievance tickets.
*   **FR-13:** The system must record an immutable Audit Log entry for every Grievance status change.
*   **FR-14:** Owners can assign specific Grievances to external Handyman contacts (text field).
*   **FR-15:** Tenants can "Rate" the resolution quality (1-5 stars) after a ticket is closed.

### Financial Management (Manual MVP)
*   **FR-16:** Owners can manually generate a "Rent Invoice" for a Tenant.
*   **FR-17:** Owners can manually mark an invoice as "Paid" or "Overdue".
*   **FR-18:** Tenants can view their history of Invoices and Payment Status.
*   **FR-19:** Owners can view a basic "Profit & Loss" summary (Total Collected vs. Expenses).

### Public Portal
*   **FR-20:** Guests can view a public gallery of the Boarding House with verified photos.
*   **FR-21:** Guests can see real-time availability of rooms (Vacant/Occupied dates).
*   **FR-22:** Guests can submit an "Inquiry Form" to the Owner.

### Notifications
*   **FR-23:** Tenants receive an automatic notification when their Grievance status changes.
*   **FR-24:** Tenants receive a notification when a new Rent Invoice is generated.
*   **FR-25:** Owners receive a notification when a new Grievance is submitted.


## Non-Functional Requirements

### Performance & Latency
*   **NFR-01:** "Real-time" status updates (Grievance changes) must appear on the Tenants screen within **1 second** of the Owners action (using optimistic UI).
*   **NFR-02:** The Dashboard for Owners must load even with low bandwidth (3G speeds), utilizing offline-first caching for essential inventory data.
*   **NFR-03:** All API responses for CRUD operations must complete within **200ms**.

### Security & Privacy
*   **NFR-04:** **Tenant Isolation:** A database query MUST NEVER return data belonging to a different Owner_ID (enforced via Row-Level Security policies).
*   **NFR-05:** All public-facing "Gallery" pages must not expose precise room numbers (e.g., "Room 101") until a booking is confirmed, to protect privacy.
*   **NFR-06:** Passwords must be hashed using Bcrypt with a work factor of at least 10.

### Usability & Mobile Experience
*   **NFR-07:** The "Grievance Submission" flow must be completable in **< 3 taps** on a mobile device.
*   **NFR-08:** Touch targets on buttons must be at least 44x44 pixels to accommodate thumb usage on mobile.
*   **NFR-09:** The application must support "Dark Mode" native to the operating system setting (for late-night grievance checks).

### Reliability & Data Integrity
*   **NFR-10:** Audit Logs for Grievances are **immutable**; not even the Database Administrator should be able to alter a recorded history event.
*   **NFR-11:** The system availability target is **99.9%** during waking hours (6 AM - 12 AM).

