---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
workflowCompleted: true
inputDocuments: ['d:/GitProjects/boarding_house/docs/prd.md']
workflowType: 'ux-design'
lastStep: 0
project_name: 'boarding_house'
user_name: 'Preda'
date: '2025-12-08'
---

# UX Design Specification - boarding_house

**Author:** Preda
**Date:** 2025-12-08

---

<!-- UX design content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

### Project Vision
**boarding_house** is a "Revolutionary" SaaS B2B platform designed to maximize trust in the transparent management of boarding houses. The core differentiator is "Radical Transparency," where tenants see the real-time status of grievances and maintenance, flipping the traditional opaque landlord dynamic. It prioritizes "Experience" (Mobile-first, Premium Visuals) over backend complexity for the MVP.

### Target Users
*   **Elena (The Owner):** An efficiency-minded operator who needs a visual "Digital Twin" of her property to manage inventory and grievances at a glance without spreadsheets.
*   **Marcus (The Tenant):** A mobile-first resident who values trust and responsiveness. He wants to track repairs like a pizza delivery and pay rent with zero friction.
*   **Sarah (The Guest):** A prospective tenant tired of fake listings. She wants verified photos and real-time availability to book with confidence.

### Key Design Challenges
*   **Trust vs. Exposure:** Designing transparency that incentivizes owners rather than exposing their unexpected failures.
*   **Offline Trust:** Ensuring the "Digital Twin" and grievance tracking remain trustworthy even when the internet connection drops (common in target markets).
*   **Mobile Fidelity:** Delivering high-end "Glassmorphism" and smooth animations on mid-range mobile devices without lag.

### Design Opportunities
*   **Gamified Resolution:** Turning maintenance into a positive loop where Owners get "badges" or "high scores" for fast resolution, visible to tenants.
*   **Living Inventory UI:** Visual icons for room assets (Bed, Chair) that visibly degrade or improve based on status, creating an intuitive "health check" for a room.
*   **Chat-Centric Workflows:** Replacing static forms with conversational interfaces for Grievances, making the interaction feel human and responsive.


## Core User Experience

### Defining Experience
The core experience is defined by **"Status Visibility."** Whether it's a broken tap or a rent payment, the user should never have to ask "What's happening?" The UI proactively answers this question through visual indicators.

### Platform Strategy
*   **Tenant Experience:** Mobile-First PWA. Bottom-tab navigation, touch-optimized, "Offline-First" architecture to handle spotty boarding house Wi-Fi.
*   **Owner Experience:** Adaptive Responsive Web App. "Card Grid" view on Desktop for high-density information, transforming into a "List Feed" on Mobile for quick triage.

### Effortless Interactions
*   **One-Tap Grievance:** Tenants can snap a photo and select a category icon. No typing required for the first step.
*   **Swipe-to-Resolve:** Owners can swipe a grievance card to move it from "Open" to "In Progress" without opening a detailed form.
*   **Magic Links:** Password-less login via Email/SMS links to reduce friction for non-tech-savvy users.

### Critical Success Moments
*   **The "Fixed" Notification:** The precise moment a Tenant sees the "Fixed" green checkmark on their phone. This is the trust-building moment.
*   **The "All Green" Dashboard:** When an Owner opens their dashboard and sees no red alerts. This is the "Peace of Mind" moment.

### Experience Principles
1.  **Don't Make Me Read:** Use color and icons (Green Dot, Red Wrench) over text status labels whenever possible.
2.  **Radical Responsiveness:** Every action has an immediate visual reaction (Optimistic UI), even if the server is slow.
3.  **Warmth over Enterprise:** Use rounded corners, soft shadows, and friendly micro-copy ("All good here!" instead of "No Records Found").


## Desired Emotional Response

### Primary Emotional Goals
*   **For Tenants:** **"Heard & Valued."** The frustration of living in a broken room is replaced by the validation of seeing their grievance acknowledged instantly.
*   **For Owners:** **"Omniscient Calm."** The anxiety of "what's breaking?" is replaced by a God-mode dashboard that shows exactly what needs attention.

### Emotional Journey Mapping
1.  **Log In:** "Welcome Home." The login screen uses warm imagery, not clinical fields. **Goal:** Belonging.
2.  **Dashboard Load:** "Everything is Green." A calm status state. **Goal:** Relief.
3.  **Grievance Submission:** "I've passed the baton." A satisfying animation when sending a ticket. **Goal:** Unburdening.
4.  **Status Update:** "Things are moving." A notification ping that feels like progress. **Goal:** Reassurance.

### Micro-Emotions
*   **Trust:** Enforced by precise timestamps and "Read Receipts" on grievances.
*   **Pride:** For Owners, seeing their property represented as beautiful digital cards.
*   **Safety:** For Guests, seeing verified "Latest Photos" with timestamps.

### Design Implications
*   **Use of Green:** We will use Green lavishly for "Good" states to trigger the "Calm" response.
*   **Animation Speed:** Transitions should be slightly slower (300-400ms) and smoother (ease-out) to convey "Premium/Stable" rather than "Fast/Cheap."
*   **Empty States:** Never just "No Data." Always "All caught up! Relax." to reinforce the "Calm" goal.

### Emotional Design Principles
*   **Transparency isn't Scary:** It's reassuring. Use UI to frame transparency as "Collaboration," not "Surveillance."
*   **The UI is the Landlord:** The app's tone *is* the landlord's voice. It must be polite, professional, and firm but fair.


## Visual Design Foundation

### Color System
*   **Primary Brand:** **Teal-600 (`#0D9488`)**. Used for primary actions, active tabs, and logo. Represents "Calm Stability."
*   **Secondary/Accent:** **Indigo-500 (`#6366F1`)**. Used for potential "Upsell" moments or "Premium" features.
*   **Backgrounds:** **Slate-50 (`#F8FAFC`)** instead of pure white to reduce eye strain and feel "softer."
*   **Dark Mode:** **Slate-950 (`#020617`)** for a deep, rich night reading experience.

### Typography System
*   **Font Family:** **Inter** (Google Fonts).
*   **Headings:** **Excalidraw-style Hand-drawn** (Optional for Marketing) or **Inter Bold tracking-tight** for App UI to feel crisp.
*   **Body:** Inter Regular with relaxed line-height (1.6) for readability.

### Spacing & Layout Foundation
*   **The 8px Grid:** All margins/padding are multiples of 8 (8, 16, 24, 32).
*   **Mobile Layout:** 16px horizontal padding.
*   **Desktop Layout:** Max-width 1200px centered container with "Masonry" card layout.

### Accessibility Considerations
*   **Contrast:** All Primary buttons must meet WCAG AA (4.5:1 ratio) against the background. Teal-600 on White is safe.
*   **Focus States:** "Ring" outlines on all interactive elements for keyboard navigation (Shadcn default).


## Design Direction Decision

### Design Directions Explored
1.  **High Density:** Useful for analytics but felt too "Enterprise" and stressful for a mobile-first MVP.
2.  **Zen Garden:** Highly visual, calm, focused on "Status" rather than "Data."
3.  **Activity Feed:** Good for history, but bad for "At a glance" state.

### Chosen Direction
**Hybrid "Zen Garden":**
*   **Home Screen:** Ultra-clean "Status Cards" (Direction B). Big numbers, lots of whitespace.
*   **Drill-Down:** When a card is tapped, it opens a "Chat/Feed" view (Direction C) for that specific item.

### Design Rationale
*   **Reduces Cognitive Load:** Owners don't want to analyze charts; they want to know "Is anything on fire?" The Zen Garden approach answers this immediately.
*   **Builds Trust:** The "Feed" view for drill-downs provides the evidence/audit trail needed for transparency without cluttering the main view.

### Implementation Approach
*   **Components:** We will build a "<StatusCard />" component that takes an "icon", "status", and "title", handling the "visual health bar" logic internally.
*   **Layout:** A simple CSS Grid "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" that naturally reflows from "Mobile Stack" to "Desktop Dashboard."


## User Journey Flows

### Tenant: Report a Grievance
This flow is optimized for speed and low-friction inputs.

\\\mermaid
graph TD
    A[Tap FAB (+)] --> B[Select Room Area]
    B --> C{Select Category}
    C -->|Plumbing| D[Tap 'Dripping Tap' Icon]
    C -->|Electrical| E[Tap 'No Power' Icon]
    D --> F[Take Photo]
    E --> F
    F --> G[Confirm & Send]
    G --> H[Animation: Ticket Flying]
    H --> I[Status: Sent]
\\\

### Owner: Triage & Resolve
This flow is optimized for "Inbox Zero" management.

\\\mermaid
graph TD
    A[Open Dashboard] --> B{Any Red Cards?}
    B -- Yes --> C[Tap Red Card]
    C --> D[View Ticket details]
    D --> E{Action?}
    E -->|Fix Myself| F[Mark 'In Progress']
    E -->|Assign| G[Send to Handyman]
    F --> H[Update Status]
    G --> H
    H --> I[Card Turns Amber]
\\\

### Guest: Verify & Book
This flow is optimized for building trust through verification.

\\\mermaid
graph TD
    A[Scan QR Code / Visit Link] --> B[View Public Profile]
    B --> C[Check 'verified' Badge]
    C --> D[View Real-time Availability]
    D --> E[Select Room]
    E --> F[Send Inquiry]
    F --> G[Owner Receives Lead]
\\\

### Flow Optimization Principles
*   **No Dead Ends:** Every screen has a primary action. Even empty states have a "Refresh" or "Create New" button.
*   **Progressive Disclosure:** We don't ask for a description until *after* the category is selected. We don't ask for payment details until *after* the room is confirmed available.


## Component Strategy

### Design System Components (Shadcn/UI)
*   **Forms:** Input, Select, DatePicker, Checkbox (Used for Reporting).
*   **Feedback:** Toast, Alert, Progress (Used for Trust Loop).
*   **Overlay:** Sheet, Dialog (Used for Mobile details).

### Custom Components
We need 3 "Signature Components" that don"t exist in standard libraries:

#### 1. `<LivingInventoryIcon />`
*   **Purpose:** Shows the state of an asset visually.
*   **States:**
    *   `good` (Teal, sparkling icon)
    *   `damaged` (Amber, cracked icon)
    *   `broken` (Rose, shattered icon)
*   **Usage:** Used in the "My Room" inventory grid.

#### 2. `<GrievanceTracker />`
*   **Purpose:** The "Pizza Tracker" vertical stepper.
*   **States:** `sent`, `viewed`, `scheduled`, `resolved`.
*   **Visuals:** Connected dots with timestamp subtext ("Viewed 10 mins ago").

#### 3. `<RentPowerBar />`
*   **Purpose:** Visualizing "Days Remaining" in the rent cycle.
*   **Visuals:** A progress bar that fills up as the due date approaches, changing color from Green -> Amber -> Red.

### Component Implementation Strategy
*   **Composition:** We will build `<StatusCard>` by composing `<Card>` (Shadcn) with `<LucideIcon>` and text tokens.
*   **Animation:** We will wrap functional components in `<motion.div>` (Framer Motion) for entrance effects.

### Implementation Roadmap
*   **Phase 1:** Core Inputs + `<StatusCard>` (For the Dashboard).
*   **Phase 2:** `<GrievanceTracker>` (For the Trust Loop).
*   **Phase 3:** `<LivingInventoryIcon>` (For the "Advanced" asset management).


## UX Consistency Patterns

### Button Hierarchy
*   **Primary:** Full-width Teal gradient for "The Main Thing" (e.g., Send Grievance).
*   **Secondary:** Ghost (text-only) or Outline for "Cancel" or "Go Back."
*   **Destructive:** Red outline (never solid red, unless confirming a critical delete) to prevent accidental stress.

### Feedback Patterns
*   **Optimistic Updates:** UI updates *immediately* on click. If the network fails, we show a "Retry" toast, but we never block the user with a spinner.
*   **Success Toast:** Bottom-center notification (Mobile) or Top-right (Desktop) that auto-dismisses after 3s.

### Form Patterns
*   **Label-less Inputs:** Use descriptive placeholders and icons to save vertical screen space on mobile (e.g., "[Icon] Enter your room number" rather than Label: "Room Number").
*   **Auto-Advance:** When entering a 6-digit OTP, the cursor automatically jumps to the next box (or submits when done).

### Navigation Patterns
*   **Mobile:** Bottom Tab Bar for top-level views. Back button (top left) for nested views.
*   **Desktop:** Sidebar navigation. Same hierarchy, just pivoted 90 degrees.


## Responsive Design & Accessibility

### Responsive Strategy
*   **Mobile (Default):** Single column. Bottom tabs. Full-screen modals.
*   **Tablet:** Two columns (Sidebar List + Detail View).
*   **Desktop:** Three columns (Nav Sidebar + List + Detail Panel).
*   **"Thumb Zone" Design:** All primary actions (FABs, Submit Buttons) must be in the bottom 30% of the screen.

### Breakpoint Strategy
We will use standard Tailwind breakpoints to ensure compatibility with Shadcn/UI:
*   `sm: 640px` (Tablet vertical)
*   `md: 768px` (Tablet horizontal / Laptop)
*   `lg: 1024px` (Desktop)
*   `xl: 1280px` (Wide Desktop)

### Accessibility Strategy (WCAG AA)
*   **Touch Targets:** All interactive elements must be at least 44x44px. This is critical for our "Mobile Tenant" persona.
*   **Color Contrast:** Text-on-Teal must pass AA standards.
*   **Screen Readers:** All icon-only buttons (like the "Leaky Tap" icon) must have explicit `aria-label` tags.

### Testing Strategy
*   **The "Sunlight Test":** We will test the "Tenant App" outdoors in direct sunlight to ensure contrast ratios are high enough for real-world usage.
*   **The "Old Phone" Test:** We will simulate network throttling (3G) to ensure our "Optimistic UI" holds up.

