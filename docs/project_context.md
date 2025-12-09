---
project_name: 'boarding_house'
user_name: 'Preda'
date: '2025-12-08'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'quality_rules', 'workflow_rules', 'anti_patterns']
status: 'complete'
rule_count: 25
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

*   **Framework:** Next.js 14+ (App Router REQUIRED).
*   **Language:** TypeScript 5+ (Strict Mode).
*   **Styling:** Tailwind CSS 3+ with Shadcn/UI.
*   **Backend:** Supabase (Auth, Database, Realtime, Storage).
*   **State Management:** React Query (Server), nuqs (Client URL), Zustand (Global Client).
*   **Package Manager:** `npm` (EXCLUISVE). Do not use `yarn`, `pnpm`, or `bun`.

## Critical Implementation Rules

### Language-Specific Rules

*   **Strict Mode:** All TypeScript code must be strict. No `any`.
*   **Async/Await:** Prefer `async/await` over `.then()` chains.
*   **Exports:** Use named exports for components (`export function Button`), default exports ONLY for Pages (`export default function Page`).

### Framework-Specific Rules

*   **App Router Mandate:** ALL routes must be in `app/`. The `pages/` directory is FORBIDDEN.
*   **Server Components:** Default to Server Components. Use `'use client'` only when hook/interaction is needed.
*   **Server Actions:** All mutations must use Next.js Server Actions in `actions/`. Do not build API routes `/api/` unless for webhooks.
*   **Image Optimization:** proper use of `<Image>` component with defined specific dimensions.

### Testing Rules

*   **Unit Tests:** Vitest + React Testing Library.
*   **Zero-Test First Sprint (YOLO Mode):** For the initial "Experience MVP", we will skip unit tests to maximize velocity, as requested. Tests will be added in Phase 2.

### Code Quality & Style Rules

*   **Naming:**
    *   Files: `kebab-case.ts` (utilities), `PascalCase.tsx` (components).
    *   Variables: `camelCase`.
    *   Database: `snake_case` (tables/columns). This is CRITICAL for Supabase/Postgres.
*   **Formatting:** Prettier default settings.
*   **Linting:** ESLint with Next.js Core Web Vitals preset.

### Development Workflow Rules

*   **Branching:** `feature/[ticket-id]-[short-desc]` (e.g., `feature/story-1-1-init`).
*   **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`).
*   **Prerequisites:** Always run `npm run lint` before committing.

### Critical Don't-Miss Rules

*   **RLS Policy:** NEVER create a table without enabling Row Level Security.
*   **Tenant Isolation:** EVERY query must implicitly or explicitly filter by `tenant_id` or `user_id`.
*   **Mobile-First:** Always design for `sm:` (mobile) first, then `md:`/`lg:`.
*   **Optimistic UI:** All Server Actions must provide immediate client feedback (toast or state update) before the server responds.

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Update this file if new patterns emerge

**For Humans:**

- Keep this file lean and focused on agent needs
- Update when technology stack changes
- Review quarterly for outdated rules
- Remove rules that become obvious over time

Last Updated: 2025-12-08

