---
stepsCompleted: [1, 2, 3, 4]
workflowCompleted: true
inputDocuments: ['d:/GitProjects/boarding_house/docs/prd.md', 'd:/GitProjects/boarding_house/docs/architecture.md', 'd:/GitProjects/boarding_house/docs/ux-design-specification.md']
workflowType: 'create-epics-stories'
lastStep: 1
project_name: 'boarding_house'
user_name: 'Preda'
date: '2025-12-08'
---

# boarding_house - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for boarding_house, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: User Authentication & Role Management
- System must support distinct roles: Admin, Boarding House Owner, Tenant, and Guest.
- Users must be able to log in via Email/Password or OTP (Magic Link). (Supabase Auth).
- System must enforce Role-Based Access Control (RBAC) via RLS.

FR2: Tenant Grievance Reporting (The Trust Loop)
- Tenants must be able to submit a grievance with: Category, Description, and Photo.
- Tenants must see the detailed status history of their grievance (Received -> Viewed -> In Progress -> Resolved).
- Tenants must receive real-time updates without refreshing the page.

FR3: Owner Command Center & Inventory Management
- Owners must see a "Living Inventory" dashboard showing the health status of all rooms and assets.
- Owners must be able to triage grievances: Update Status, Assign Priority, Add Comments.
- Owners must be able to manage room occupancy and tenant assignment.

FR4: Guest Verification Portal
- Guests must be able to view a public profile of a boarding house via a unique URL/QR code.
- Guests must see verified badges for: "Authorized Owner," "Safety Inspection," and "Verified Amenities."
- Guests must see up-to-date room availability.

FR5: Offline Capability
- Application must function in offline mode for viewing cached data (Next.js PWA).
- System must queue offline mutations (grievance submission) and sync when online.

### NonFunctional Requirements

NFR1: Performance & Real-time
- Grievance status updates must propagate to the tenant dashboard in < 1 second.
- First Contentful Paint (FCP) must be < 1.5 seconds on 4G networks.

NFR2: Mobile-First Design
- UI must be optimized for "Thumb Zone" navigation on mobile devices.
- Touch targets must meet WCAG AA standards (minimum 44x44px).

NFR3: Data Security & Privacy
- Tenant data must be strictly isolated (RLS). Tenants cannot see other tenants' tickets.
- Public pages must never leak sensitive tenant details.

### Additional Requirements

From Architecture:
- **Starter Template**: Must be initialized using `npx create-next-app@latest boarding_house --typescript --tailwind --eslint`, plus Supabase and Shadcn.
- **Technology Stack**: Next.js (App Router), Supabase (Auth/DB/Realtime), Shadcn/UI, Zod (Validations).
- **Communication Pattern**: Use Server Actions for all mutations.
- **Project Structure**: Follow the specified Feature-Sliced Directory Structure.

From UX Design:
- **Components**: Implement custom "Status Card" and "Living Inventory Icon" components.
- **Visuals**: Use "Teal" (`#0D9488`) primary color themes.
- **Feedback**: Implement "Optimistic UI" for all state changes (immediate visual update before server confirmation).

### FR Coverage Map

{{requirements_coverage_map}}

## Epic List

{{epics_list}}

### FR Coverage Map

FR1: Epic 1 - Authentication & RBAC System (Admin, Owner, Tenant, Guest)
FR2: Epic 2 - The Trust Loop (Tenant Grievance Reporting & Updates)
FR3: Epic 3 - Living Inventory (Owner Command Center)
FR4: Epic 4 - Guest Verification Portal (Public Access)
FR5: Epic 2 & 3 - Offline Capability (PWA Sync for Tenants & Owners)
FR-02, FR-03, FR-06, FR-09: Epic 5 - Core Management (Rooms & Tenants)
FR-16, FR-17, FR-18, FR-19, FR-24: Epic 6 - Financials (Manual MVP)

## Epic List

### Epic 1: Project Foundation & Authentication
Establish the secure, scalable foundation of the platform, enabling users (Owner, Tenant, Guest) to sign up, log in, and access their specific role-based dashboards locally and in production.
**FRs covered:** FR1, NFR3, Additional (Starter Template, Architecture)

### Epic 2: The Trust Loop (Tenant Experience)
Enable tenants to "Fire and Forget" grievances with zero friction (Photo+Category) and receive "Pizza Tracker" style real-time updates, building confidence in the resolution process.
**FRs covered:** FR2, FR5, NFR1, NFR2 (Mobile First)

### Epic 3: Living Inventory (Owner Experience)
Empower owners to triage incoming issues from a "Command Center" view, update statuses that sync to tenants, and visualize the health of their property assets in real-time.
**FRs covered:** FR3, FR5, NFR1

### Epic 4: Guest Verification Portal
Create the public-facing "Trust Beacon" pages that allow prospective guests to verify a boarding house's safety, amenities, and "Authorized" status via QR code or link.
**FRs covered:** FR4, NFR3 (Privacy)


## Epic 1: Project Foundation & Authentication

Establish the secure, scalable foundation of the platform, enabling users (Owner, Tenant, Guest) to sign up, log in, and access their specific role-based dashboards locally and in production.

### Story 1.1: Project Initialization
As a Developer,
I want to initialize the codebase with the chosen tech stack (Next.js, Supabase, Shadcn),
So that I have a stable environment to build features on.

**Acceptance Criteria:**
**Given** A clean development environment
**When** I run the `create-next-app` and Supabase init commands
**Then** A new Next.js project exists with TypeScript, Tailwind, and ESLint configured
**And** The Supabase client is configured and can connect to a local/cloud instance
**And** The directory structure matches the Feature-Sliced design from Architecture.md

### Story 1.2: Authentication & Role Schema
As a System Admin,
I want to define the database schema for users and roles,
So that the system knows who is an Owner, Tenant, or Guest.

**Acceptance Criteria:**
**Given** The Supabase database is initialized
**When** I apply the migration for `public.profiles` with a `role` enum
**Then** The table is created with columns for `id` (references auth.users), `role`, and `full_name`
**And** A database trigger automatically creates a profile entry when a new user signs up

### Story 1.3: Login & Sign Up UI
As a User (Owner or Tenant),
I want to log in using my email and password,
So that I can access my private dashboard.

**Acceptance Criteria:**
**Given** A user is on the `/login` page
**When** They enter valid credentials and click "Sign In"
**Then** They are authenticated via Supabase Auth
**And** They are redirected to `/dashboard` (which routes to `/owner` or `/tenant` based on their role)
**And** Invalid credentials show a clear error message from Shadcn UI

### Story 1.4: Role-Based Access Control (RBAC)
As a Security Officer,
I want to ensure users can only access routes and data permitted for their role,
So that tenants cannot see owner data and vice versa.

**Acceptance Criteria:**
**Given** A logged-in Tenant
**When** They attempt to navigate to `/owner`
**Then** They are redirected to `/tenant` or a 403 Forbidden page
**When** They try to query the `inventory_items` table (which is owner-only)
**Then** The Database RLS policy blocks the request


## Epic 2: The Trust Loop (Tenant Experience)

Enable tenants to "Fire and Forget" grievances with zero friction (Photo+Category) and receive "Pizza Tracker" style real-time updates, building confidence in the resolution process.

### Story 2.1: Grievance Schema & Actions
As a Developer,
I want to create the database table and Server Actions for grievances,
So that the frontend has an API to submit reports.

**Acceptance Criteria:**
**Given** The database is running
**When** I run the migration for `grievances` (columns: id, tenant_id, category, description, photo_url, status)
**Then** The table exists with RLS policies allowing Tenants to INSERT and SELECT (own rows)
**And** A Server Action `createGrievance` exists using Zod validation

### Story 2.2: Mobile-First Reporting Form
As a Tenant,
I want to easily report an issue using a simple form on my phone,
So that I can notify the landlord without typing a long email.

**Acceptance Criteria:**
**Given** A logged-in Tenant on the dashboard
**When** They tap the "Report Issue" action
**Then** A mobile-optimized form opens (Category Select, Description, optional Photo)
**When** They submit
**Then** The `createGrievance` action is called, and a success toast appears with "Status: Received"

### Story 2.3: Real-time "Pizza Tracker"
As a Tenant,
I want to see the status of my active grievance update in real-time,
So that I know the landlord is working on it without refreshing the page.

**Acceptance Criteria:**
**Given** A Tenant viewing their active grievance card
**When** An Owner updates the status from "Received" to "In Progress" in the database
**Then** The UI updates instantly via Supabase Realtime subscription
**And** The visual indicator moves to the next step in the tracker


## Epic 3: Living Inventory (Owner Experience)

Empower owners to triage incoming issues from a "Command Center" view, update statuses that sync to tenants, and visualize the health of their property assets in real-time.

### Story 3.1: Owner Inbox & Triage
As an Owner,
I want to see a list of all active grievances sorted by urgency,
So that I can quickly decide what to fix first.

**Acceptance Criteria:**
**Given** An Owner logged into the Command Center
**When** They view the "Inbox" section
**Then** All "Received" and "In Progress" tickets are displayed
**When** They click a ticket
**Then** They see full details and can change the status (e.g., to "Resolved")

### Story 3.2: Living Inventory Dashboard
As an Owner,
I want to see a visual representation of my rooms and their assets,
So that I can identify recurring issues or broken items.

**Acceptance Criteria:**
**Given** The Owner Dashboard
**When** The page loads
**Then** It fetches the `inventory_items` and aggregates their health status
**And** "Good" items are green, "Damaged" items are yellow/red
**And** This view aggregates data from the Grievance system logic

## Epic 4: Guest Verification Portal

Create the public-facing "Trust Beacon" pages that allow prospective guests to verify a boarding house's safety, amenities, and "Authorized" status via QR code or link.

### Story 4.1: Public Profile Page
As a Guest,
I want to view a boarding house's details via a public link,
So that I can verify it exists and is legitimate.

**Acceptance Criteria:**
**Given** A public user with a link `/verify/[house_id]`
**When** They load the page
**Then** They see the standardized "Trust Profile" (Name, Address, Amenities)
**And** No login is required
**And** No private tenant data is visible

### Story 4.2: Verification Badges & Availability
As a Guest,
I want to see official verification badges and current room availability,
So that I feel safe booking a visit.

**Acceptance Criteria:**
**Given** The Public Profile Page
**When** The Owner has "Authorized" status in the DB
**Then** A blue "Verified Owner" badge is displayed
**When** Rooms are vacant
**Then** The available room count is shown (e.g., "2 Rooms Available")


## Epic 5: Core Management (Rooms & Tenants)

Establish the "Middle Layer" of data management. Owners need to create the physical entities (Rooms) and human entities (Tenants) that the rest of the system operates on.

### Story 5.1: Room Management (CRUD)
As an Owner,
I want to add and configure rooms (Number, Capacity, Price),
So that I can assign tenants and inventory to them.

**Acceptance Criteria:**
**Given** An Owner on the Dashboard
**When** They navigate to "Property Settings" -> "Rooms"
**Then** They can Add a new Room (Number, Standard Price, Max Capacity)
**And** They can Edit existing details
**And** This creates the `rooms` records that `inventory_items` will link to

### Story 5.2: Tenant Onboarding & Assignment
As an Owner,
I want to invite a tenant via email and assign them to a specific room,
So that they can log in and see *their* specific room details and bill.

**Acceptance Criteria:**
**Given** A potential tenant's email
**When** The Owner uses "Invite Tenant"
**Then** An invitation email is sent (Supabase Auth Invite)
**When** The tenant accepts and creates a password
**Then** A `profiles` record is created with role `tenant`
**When** The Owner assigns this Tenant to "Room 101"
**Then** The system links `tenants.room_id` to `rooms.id`
**And** Permissions update so the Tenant can now see Room 101's data

## Epic 6: Financials (Manual MVP)

Implement the "Experience MVP" billing system. While not connected to Stripe yet, it replaces the "Excel Sheet" by allowing owners to issue digital invoices and manually track payments, giving tenants a transparent history.

### Story 6.1: Manual Invoice Generation
As an Owner,
I want to generate a rent invoice for a tenant,
So that they receive a notification and can see what they owe.

**Acceptance Criteria:**
**Given** A tenant assigned to a room
**When** The Owner clicks "Generate Rent" for that tenant
**Then** A new record is created in `invoices` (Amount, Due Date, Status: Unpaid)
**And** The Tenant receives a notification (FR-24)
**And** The Tenant sees the new bill on their Dashboard

### Story 6.2: Payment Tracking & P/L
As an Owner,
I want to mark an invoice as "Paid" when I receive cash/transfer, and see my total monthly income,
So that I can track who has paid and view my basic Profit & Loss.

**Acceptance Criteria:**
**Given** An outcome payment
**When** The Owner toggles the invoice status to "Paid"
**Then** The status updates immediately for the Tenant (Optimistic UI)
**When** The Owner views the "Financials" tab
**Then** They see a sum of all "Paid" invoices for the current month (FR-19)

