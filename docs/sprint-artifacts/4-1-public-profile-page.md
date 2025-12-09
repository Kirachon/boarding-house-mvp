# Story 4.1: Public Profile Page (Trust Beacon)

Status: Done

## Story

As a Guest,
I want to view a boarding house's details via a public link,
So that I can verify it exists and is legitimate.

## Acceptance Criteria

1. **Schema:** Create `properties` table (id, owner_id, name, address, description, amenities).
2. **Public Access:** `/verify/[id]` page is accessible without login (middleware exclusion).
3. **UI:** Page displays Property Name, verified badge (static for now), address (obfuscated or full?), and list of amenities.
4. **Safety:** No tenant names or specific room details (other than count/types) are shown.

## Tasks / Subtasks

## Tasks / Subtasks

- [x] **Task 1: Database Migration**
  - [x] Create `properties` table.
  - [x] Add RLS: Public read access (`true` for SELECT), Owner write access.
  - [x] Seed a sample property linked to the existing Owner.

- [x] **Task 2: Route Configuration**
  - [x] Update `middleware.ts` to allow `/verify/*` as a public route.

- [x] **Task 3: Public Page Implementation**
  - [x] Create `app/verify/[id]/page.tsx`.
  - [x] Fetch property details (Server Component).
  - [x] UI: "Trust Beacon" design cards.

## Dev Notes

### Architecture Guidance
- **URL Structure:** `/verify/<uuid>`.
- **Public Data:** Be very careful what `select` queries return. Explicitly select fields.

## References

- [Epics] `docs/epics.md`

## Dev Agent Record

### Implementation Notes
- Created `properties` table via migration `20251209144641_create_properties.sql`.
- Added public read policy (`true`) and owner write policy to `properties`.
- Seeded a sample property "Sunset Hive Boarding House" and linked existing rooms to it.
- Updated `middleware.ts` to exclude `/verify` routes from authentication.
- Implemented `app/verify/[id]/page.tsx` as a public-facing Trust Beacon page using Shadcn cards and proper fetching logic.
- Managed `params` as a Promise in Next.js 15+ style (though file header says 16.0.7, pattern is same).

### File List
- `supabase/migrations/20251209144641_create_properties.sql` (created)
- `types/supabase.ts` (modified)
- `lib/supabase/middleware.ts` (modified)
- `app/verify/[id]/page.tsx` (created)

### Completion Notes
✅ Story 4.1 Complete - Public Verification Page
- Guests can visit `/verify/[uuid]` to see the property details.
- No login required.
- Securely displays only public info.
- Ready for Story 4.2: Verification Badges.

