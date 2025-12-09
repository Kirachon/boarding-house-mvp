# Story 1.3: Login & Sign Up UI

Status: Done

## Story

As a User (Owner or Tenant),
I want to log in using my email and password,
so that I can access my private dashboard.

## Acceptance Criteria

1. **Login Page:** A dedicated route `/login` exists with an email/password form.
2. **Server Actions:** Authentication uses Next.js Server Actions (no client-side auth logic).
3. **Redirection:** Successful login redirects to `/dashboard` (which currently just shows a placeholder).
4. **Error Handling:** Invalid credentials display a Shadcn `toast` or form error message.
5. **Session Management:** Auth state persists via cookies (handled by `@supabase/ssr`).
6. **Sign Up:** A simple "Sign Up" toggle/link allowing new user registration (default role will be 'guest' via trigger).

## Tasks / Subtasks

- [x] **Task 1: Create Auth Server Actions**
  - [x] Create `actions/auth.ts`.
  - [x] Implement `login(formData)` using `supabase.auth.signInWithPassword`.
  - [x] Implement `signup(formData)` using `supabase.auth.signUp`.
  - [x] Implement `logout()` using `supabase.auth.signOut`.

- [x] **Task 2: Build Login/Register Form Component**
  - [x] Create `components/features/auth/login-form.tsx`.
  - [x] Use Shadcn UI `<Form>`, `<Input>`, `<Button>`, and `<Card>`.
  - [x] Implement "Toggle Mode" (Login vs Sign Up) state.
  - [x] Connect form submission to Server Actions using `useTransition` or `useFormState`.

- [x] **Task 3: Create Login Page**
  - [x] Create `app/login/page.tsx` (Server Component).
  - [x] Render the `LoginForm` client component.

- [x] **Task 4: Create Dashboard Placeholder**
  - [x] Create `app/dashboard/page.tsx`.
  - [x] Add a temporary "Welcome [Email]" message and "Logout" button to test auth flow.
  - [x] Ensure this page is protected (redirect to `/login` if no session).

## Dev Notes

### Technical Requirements
- **Server Actions:** ALL auth mutations must happen on the server.
- **Client Side:** Use `useTransition` for loading states.
- **Feedback:** Use `sonner` or `toast` for error messages (e.g., "Invalid login credentials").

### Architecture Guidance
- **Auth Flow:**
  1. User submits form -> Server Action.
  2. Server Action calls Supabase -> Sets Cookies.
  3. Server Action redirects -> `redirect('/dashboard')`.
- **Middleware:** We need `middleware.ts` to refresh the session, but strict protection logic is in Story 1.4. For now, basic session check in `dashboard/page.tsx` is sufficient.

## References

- [Epics] `docs/epics.md`
- [Supabase] Server-Side Auth in Next.js

## Dev Agent Record

### Implementation Notes
- Created `actions/auth.ts` containing Server Actions for login, signup, and logout
- Implemented `LoginForm` component using Shadcn UI, React Hook Form, and Zod
- Created `/login` page with `LoginForm` and toaster integration
- Created protected `/dashboard` page that checks session and redirects if not authenticated
- Implemented `middleware.ts` and `lib/supabase/middleware.ts` for proper session cookie handling
- Linting passed successfully

### File List
- `actions/auth.ts` (created)
- `components/features/auth/login-form.tsx` (created)
- `app/login/page.tsx` (created)
- `app/dashboard/page.tsx` (created)
- `middleware.ts` (created)
- `lib/supabase/middleware.ts` (created)

### Completion Notes
✅ Story 1.3 Complete - Auth UI and Logic Implemented
- Login and Signup flows functional
- Server Actions enforce server-side auth logic
- Middleware handles session refreshing
- Dashboard is protected against unauthenticated access
- Ready for Story 1.4: Role-Based Access Control

