---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
status: 'complete'
completedAt: '2025-12-08'
inputDocuments: ['d:/GitProjects/boarding_house/docs/prd.md', 'd:/GitProjects/boarding_house/docs/ux-design-specification.md']
workflowType: 'architecture'
lastStep: 1
project_name: 'boarding_house'
user_name: 'Preda'
date: '2025-12-08'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
*   **Tenant Portal:** Mobile-first PWA for submitting grievances (photo + category) and tracking status (real-time).
*   **Owner Dashboard:** Desktop-optimized "Command Center" for triaging issues, assigning tasks, and viewing "Living Inventory" health.
*   **Guest Portal:** Public-facing, SEO-optimized pages for verifying room availability and quality.
*   **Trust Engine:** The core logic connecting reports to updates with audit trails.

**Non-Functional Requirements:**
*   **Real-time Latency:** Updates must appear <1s (Optimistic UI required).
*   **Offline Capability:** Tenants must be able to view status and queue reports while offline.
*   **Accessibility:** WCAG AA (Mobile focus, high contrast for outdoor use).
*   **Responsive:** Extreme adaptability from 320px (Mobile) to 1920px (Owner Desktop).

**Scale & Complexity:**
*   **Primary domain:** Full-stack Web (Next.js PWA).
*   **Complexity level:** Medium (Standard CRUD + Real-time + Offline Sync).
*   **Estimated architectural components:** ~15 (Auth, Database, Real-time Engine, Storage, Notification Service, etc.).

### Technical Constraints & Dependencies
*   **Frontend:** Shadcn/UI (Strict requirement), Tailwind CSS.
*   **Mobile:** PWA (No native stores).
*   **Database:** PostgreSQL (Implicit from "Living Inventory" relational needs).

### Cross-Cutting Concerns Identified
*   **Multi-tenancy:** Data isolation per Boarding House owner.
*   **RBAC:** Strict separation between Tenant, Owner, and Guest roles.
*   **Image Handling:** Heavy reliance on photos for grievances (storage + optimization).


## Starter Template Evaluation

### Primary Technology Domain
**Full-stack Web Application (PWA)**

### Selected Starter: Next.js + Supabase (Official)

**Rationale for Selection:**
*   **"Experience MVP" Alignment:** Supabase handles the entire backend (Auth, DB, Real-time, Storage), allowing us to focus 100% on the UX/UI "Trust Loop".
*   **Real-time:** Supabase "Realtime" is built-in, perfect for the "Pizza Tracker" grievance updates.
*   **SEO:** Next.js App Router provides Server-Side Rendering (SSR) for the Guest Portal (Public Verification pages).
*   **PWA:** Next.js ecosystems has mature PWA plugins (`next-pwa` or `@ducanh2912/next-pwa`).

**Initialization Command:**

```bash
npx create-next-app@latest boarding_house --typescript --tailwind --eslint
# Then add Supabase
npm install @supabase/supabase-js
# Then add Shadcn
npx shadcn@latest init
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
*   TypeScript (Strict mode).
*   Node.js (for edge functions/middleware).

**Styling Solution:**
*   Tailwind CSS (Utility-first).
*   PostCSS (standard build).

**Data & State:**
*   **Database:** PostgreSQL (via Supabase).
*   **Auth:** Supabase Auth (JWT).
*   **State:** React Server Components (Server state) + React Context/Zustand (Client state).

**Build Tooling:**
*   Turbopack (Dev).
*   Webpack (Build).

**Code Organization:**
*   App Router (`/app` directory) for file-system based routing and layouts.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
*   **Real-time Strategy:** Supabase Realtime (Postgres Changes) vs Socket.io. **Selected: Supabase Realtime.** (Provided by Starter).
*   **Schema Access:** Direct DB calls (RSC) vs API Layer. **Selected: Server Actions.** (Modern Next.js pattern).

**Important Decisions (Shape Architecture):**
*   **Inventory Logic:** Where does the "Health Bar" logic live? **Selected: Encapsulated React Components (`<LivingInventoryIcon />`) calculating state from props.**

### Data Architecture
*   **Database:** PostgreSQL (Supabase).
*   **Migration Tool:** Supabase CLI (Flow: local dev -> db push -> migration commit).
*   **Validation:** **Zod**. We will define Zod schemas for "Grievance", "InventoryItem", and "Room" to ensure type safety from Form -> DB.

### Authentication & Security
*   **Pattern:** **Supabase Auth + RLS (Row Level Security).**
*   **Role Management:** A `public.profiles` table linked to `auth.users` via triggers.
    *   `role` enum: ('owner', 'tenant', 'guest').
    *   **RLS Rule:** "Tenants can only see their own tickets." "Owners can see tickets for their property."

### API & Communication Patterns
*   **API Pattern:** **Next.js Server Actions**. We will NOT build a REST API. All data mutations happen via async Server Actions called directly from Client Components.
*   **Data Fetching:** **React Server Components (RSC)**. We fetch data directly in the component (`async function Page()`).
*   **Real-time Pattern:** Client-side `supabase.channel().on()` listeners in `useEffect` hooks for active dashboards.

### Frontend Architecture
*   **State Management:**
    *   **Server State:** React Query (or native `cache`).
    *   **Client State:** `nuqs` (URL-based state) for filters/tabs. Global state minimized (Zustand only if absolutely needed).
*   **PWA:** `next-pwa` configuration in `next.config.js`.

### Infrastructure & Deployment
*   **Frontend:** Vercel (Zero-config Next.js deployment).
*   **Backend:** Supabase Cloud (Managed Postgres).
*   **CI/CD:** GitHub Actions (Run ESLint + TypeCheck on PR).

## Implementation Patterns & Consistency Rules

### Naming Patterns
*   **Database:** `snake_case` for all tables and columns. Plural table names (`users`, `grievances`, `inventory_items`).
*   **Server Actions:** `camelCase` verbs. `createGrievance`, `updateProfile`.
*   **Components:** `PascalCase` filenames and component names. `StatusCard.tsx`.
*   **Files:** `kebab-case` for non-component files (`utils.ts`, `data-fetching.ts`).

### Code Structure Patterns
*   **Co-location:** We follow the Next.js App Router convention. Code that is unique to a route stays in that route's folder (e.g., `_components/` folder inside `app/dashboard/`).
*   **Shared Components:** Reusable UI components go in `/components/ui` (Shadcn) or `/components/shared`.
*   **Server Actions:** All mutations in `/actions/[feature].ts`. NOT inside component files.

### Error Handling Patterns
*   **Server Actions:** MUST return a standardized object:
    ```typescript
    type ActionResponse<T> = { success: true; data: T } | { success: false; error: string };
    ```
*   **Client Feedback:** Check `result.success`. If false, `toast.error(result.error)`. If true, `toast.success()`.

### Loading Patterns
*   **Mutations:** Wrap all Server Action calls in `useTransition` to show pending states on buttons (`isPending && "Saving..."`).
*   **Data Fetching:** Use `<Suspense fallback={<Skeleton />}>` for all async Server Components. We do not use `useEffect` for initial data fetching.

## Project Structure & Boundaries

### Complete Project Directory Structure

```
boarding_house/
├── README.md
├── package.json
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── .env.local
├── supabase/
│   ├── config.toml
│   └── migrations/
│       └── 20240101_init.sql
├── app/
│   ├── layout.tsx                # Root layout (fonts, providers)
│   ├── output/                   # Global styles
│   ├── error.tsx                 # Global error boundary
│   ├── page.tsx                  # Landing page (Guest Portal)
│   ├── (auth)/                   # Auth Group
│   │   ├── login/page.tsx
│   │   └── callback/route.ts     # Auth callback
│   ├── (dashboard)/              # Protected Routes
│   │   ├── layout.tsx            # Dashboard shell (Sidebar)
│   │   ├── owner/page.tsx
│   │   └── tenant/page.tsx
│   └── api/                      # (Minimal) Webhooks only
│       └── revalidate/route.ts
├── components/
│   ├── ui/                       # Shadcn Primitives (Button, Input)
│   ├── shared/                   # Global shared (Navbar, Footer)
│   └── features/                 # Feature-specific components
│       ├── grievance/            # (GrievanceCard, GrievanceForm)
│       ├── inventory/            # (LivingInventoryIcon)
│       └── tenant-nav.tsx
├── lib/
│   ├── supabase/
│   │   ├── server.ts             # Server Action client
│   │   └── client.ts             # Browser client
│   └── utils.ts                  # cn() helper
├── actions/
│   ├── grievance.ts              # Server Actions (Mutations)
│   ├── inventory.ts
│   └── auth.ts
├── types/
│   ├── database.types.ts         # Generated from Supabase
│   └── schema.ts                 # Zod definitions
└── public/
    └── manifest.json             # PWA Manifest
```

### Architectural Boundaries

**API Boundaries:**
*   **External:** No public REST API. All access is via Next.js Server Actions or direct Client-to-Supabase (for Realtime).
*   **Database:** Strict RLS at the Postgres level. The "API" is effectively the RLS policies.

**Feature Mapping:**
*   **Trust Loop:** `app/(dashboard)/tenant`, `actions/grievance.ts`, `components/features/grievance/`.
*   **Living Inventory:** `app/(dashboard)/owner`, `actions/inventory.ts`, `components/features/inventory/`.
*   **Authentication:** `app/(auth)`, `lib/supabase`, `middleware.ts`.

## Architecture Validation Results

### Coherence Validation ✅
*   **Decision Compatibility:** Next.js Server Actions + Supabase is a proven, cohesive stack. No conflicting paradigms (e.g., we aren't mixing Redux with React Query).
*   **Pattern Consistency:** Zod is used universally (Frontend forms + Backend validation). PascalCase for components is standard.
*   **Structure Alignment:** Feature-based folder structure in `components/features` aligns with the modular nature of "Grievance" and "Inventory" logic.

### Requirements Coverage Validation ✅
*   **Trust Loop:** Supported by Real-time subscription architecture.
*   **Living Inventory:** Supported by relational Postgres schema and React component encapsulation.
*   **Tenant Portal:** Supported by Mobile-First PWA design and "Thumb Zone" navigation mapping.

### Implementation Readiness Validation ✅
*   **Decision Completeness:** High. All major tech choices (Auth, DB, State, UI) are locked.
*   **Structure Completeness:** Directory tree is explicit.
*   **Pattern Completeness:** Naming and Error Handling rules are defined.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed

**✅ Architectural Decisions**
- [x] Technology stack fully specified (Next.js + Supabase)
- [x] Integration patterns defined (Server Actions)

**✅ Implementation Patterns**
- [x] Naming conventions established
- [x] Error handling patterns defined

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established

### Architecture Readiness Assessment
**Overall Status:** READY FOR IMPLEMENTATION
**Confidence Level:** High

### Implementation Handoff
**First Implementation Priority:**
Initialize the project using the specific CLI commands in the "Starter Template Evaluation" section.

## Architecture Completion Summary

### Workflow Completion

**Architecture Decision Workflow:** COMPLETED ✅
**Total Steps Completed:** 8
**Date Completed:** 2025-12-08
**Document Location:** d:/GitProjects/boarding_house/docs/architecture.md

### Implementation Handoff

**For AI Agents:**
This architecture document is your complete guide for implementing **boarding_house**. Follow all decisions, patterns, and structures exactly as documented.

**Development Sequence:**
1.  Initialize project using: `npx create-next-app@latest boarding_house --typescript --tailwind --eslint`
2.  Install Backend: `npm install @supabase/supabase-js`
3.  Install UI: `npx shadcn@latest init`
4.  Implement core architectural foundations (Layouts, Auth Provider).
5.  Build features following established patterns (Server Actions, Zod).

### Architecture Status: READY FOR IMPLEMENTATION ✅




