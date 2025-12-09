# Story 1.2: Authentication & Role Schema

Status: Done

## Story

As a System Admin,
I want to define the database schema for users and roles,
so that the system knows who is an Owner, Tenant, or Guest.

## Acceptance Criteria

1. **Role Enum:** A database ENUM `user_role` exists with values: `owner`, `tenant`, `guest`, `admin`.
2. **Profiles Table:** A `public.profiles` table exists referencing `auth.users`.
3. **Columns:** `id` (UUID, PK, FK to auth.users), `role` (user_role, default 'guest'), `full_name` (text), `created_at`.
4. **Auto-Profile Trigger:** A Postgres trigger `on_auth_user_created` automatically inserts a row into `public.profiles` when a new user signs up in `auth.users`.
5. **Type Safety:** TypeScript interfaces/types are generated or defined for the DB schema.

## Tasks / Subtasks

- [x] **Task 1: Create Database Migration**
  - [x] Create a new Supabase migration file (e.g., `supa_migrations/YYYYMMDD_init_auth.sql`).
  - [x] Define ENUM `user_role`.
  - [x] Create table `public.profiles` with RLS enabled (initially allow all for setup, strict RLS in 1.4).
  - [x] Add foreign key constraint to `auth.users` with cascading delete.

- [x] **Task 2: Implement Auto-Creation Trigger**
  - [x] Write PL/pgSQL function `public.handle_new_user()`.
  - [x] Create trigger `on_auth_user_created` after insert on `auth.users`.
  - [x] **Validation:** Verify SQL syntax is valid PGL/pgSQL.

- [x] **Task 3: Apply & seed**
  - [x] Apply migration locally (if local DB running) or provide SQL for manual run.
  - [x] (Mock) TypeScript types generation script or manual type definition in `types/database.ts` or `types/supabase.ts`.

## Dev Notes

### Technical Requirements
- **Supabase Auth:** Uses the default `auth` schema.
- **Public Schema:** We extend auth with `public.profiles`.
- **RLS:** Must be enabled on `profiles` (even if policy is "Allow All" temporarily, DO NOT leave RLS disabled).

### Architecture Guidance
- **Database Types:** We should store our Database definitions in `types/supabase.ts`.
- **Trigger Security:** `SECURITY DEFINER` is required for the trigger function to insert into `public.profiles` on behalf of the auth system.

## References

- [Epics] `docs/epics.md`
- [Supabase Docs] Managing User Data

## Dev Agent Record

### Implementation Notes
- Created migration `20251209120104_init_auth_schema.sql` which includes:
  - `user_role` enum
  - `public.profiles` table with RLS enabled (temp allow-all policy)
  - `handle_new_user` trigger function with `SECURITY DEFINER`
  - `on_auth_user_created` trigger for auto-profile creation
- Created `types/supabase.ts` with accurate TypeScript definitions for the new schema

### File List
- `supabase/migrations/20251209120104_init_auth_schema.sql` (created)
- `types/supabase.ts` (created)

### Completion Notes
✅ Story 1.2 Complete - Authentication Schema Defined
- Database schema structure ready for Supabase application
- Type definitions created for type-safe development
- RLS enabled (as required by security rules)
- Ready for Story 1.3: Login & Sign Up UI

