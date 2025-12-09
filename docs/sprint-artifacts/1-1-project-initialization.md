# Story 1.1: Project Initialization

Status: Done

## Story

As a Developer,
I want to initialize the codebase with the chosen tech stack (Next.js, Supabase, Shadcn),
so that I have a stable environment to build features on.

## Acceptance Criteria

1. **Next.js Initialization:** A new Next.js project exists with TypeScript, Tailwind, and ESLint configured (`npx create-next-app`).
2. **Supabase Setup:** The Supabase client is configured and can connect to a local/cloud instance.
3. **Architecture Compliance:** The directory structure matches the Feature-Sliced design from Architecture.md (e.g., `components/features`, `actions/`).
4. **Strict Mode:** TypeScript `strict` mode is enabled.
5. **Clean Slate:** Remove default Next.js boilerplate (e.g., default page content).

## Tasks / Subtasks

- [x] **Task 1: Initialize Project Foundation**
  - [x] Run `npx create-next-app@latest . --typescript --tailwind --eslint` (Ensure App Router is used).
  - [x] Install dependencies: `@supabase/supabase-js`, `zod`, `lucide-react`.
  - [x] Initialize Shadcn: `npx shadcn@latest init`.
  - [x] **Validation:** Verify `package.json` contains required deps and script runs.

- [x] **Task 2: Configure Project Structure**
  - [x] Create directory tree: `components/features`, `components/shared`, `actions`, `lib/supabase`, `types`.
  - [x] Delete `app/page.module.css` if strictly using Tailwind.
  - [x] Ensure `app/` is the only route directory (No `pages/`).

- [x] **Task 3: Setup Supabase Client**
  - [x] Create `lib/supabase/client.ts` (Browser Client).
  - [x] Create `lib/supabase/server.ts` (Server Client).
  - [x] Add env vars to `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

## Dev Notes

### Technical Requirements
- **Framework:** Next.js 14+ (App Router).
- **Language:** TypeScript 5+ (Strict Mode).
- **Styling:** Tailwind CSS 3+ with Shadcn/UI.
- **Package Manager:** `npm` (EXCLUISVE).

### Architecture Guidance
- **Folder Structure:**
  ```
  boarding_house/
  ├── app/
  ├── components/
  │   ├── ui/
  │   ├── shared/
  │   └── features/
  ├── lib/
  │   └── supabase/
  ├── actions/
  └── types/
  ```
- **Project Context:** Refer to `docs/project_context.md` for strict rules.

## References

- [Rules] `docs/project_context.md`
- [Architecture] `docs/architecture.md`

## Dev Agent Record

### Implementation Notes
- Initialized Next.js 16.0.7 with App Router, TypeScript, Tailwind, and ESLint
- Installed all required dependencies: @supabase/supabase-js, @supabase/ssr, zod, lucide-react
- Initialized Shadcn UI with default configuration
- Created complete directory structure matching architecture specification
- Configured Supabase clients for both browser and server-side usage
- Cleaned up default boilerplate, replaced with minimal landing page
- All linting checks pass

### File List
- `app/page.tsx` (modified - cleaned boilerplate)
- `lib/supabase/client.ts` (created)
- `lib/supabase/server.ts` (created)
- `components/features/` (created)
- `components/shared/` (created)
- `components/ui/` (created)
- `actions/` (created)
- `types/` (created)
- `.env.local` (created)
- `package.json` (modified - added dependencies)

### Completion Notes
✅ Story 1.1 Complete - Foundation successfully initialized
- All acceptance criteria satisfied
- Project structure matches architecture specification
- Linting passes with zero errors
- Ready for Story 1.2: Authentication & Role Schema

