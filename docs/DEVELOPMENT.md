# Development Guide

This guide provides detailed information for developers working on the Boarding House Management System.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Project Architecture](#project-architecture)
- [Coding Standards](#coding-standards)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Debugging](#debugging)
- [Common Tasks](#common-tasks)
- [Performance Optimization](#performance-optimization)
- [Security Considerations](#security-considerations)

## Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js 18+**: [Download](https://nodejs.org/)
- **Docker Desktop**: [Download](https://www.docker.com/products/docker-desktop/)
- **Git**: [Download](https://git-scm.com/)
- **VS Code** (recommended): [Download](https://code.visualstudio.com/)

### Recommended VS Code Extensions

- **ESLint**: For linting
- **Prettier**: For code formatting
- **Tailwind CSS IntelliSense**: For Tailwind autocomplete
- **TypeScript and JavaScript Language Features**: Built-in
- **Supabase**: For Supabase integration

### Initial Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Kirachon/boarding-house-mvp.git
   cd boarding-house-mvp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start Supabase locally**:
   ```bash
   npm run db:start
   ```

4. **Configure environment**:
   Copy `.env.example` to `.env.local` and fill in the values from the Supabase start output.

5. **Apply migrations**:
   ```bash
   npm run db:push
   ```

6. **Start development server**:
   ```bash
   npm run dev
   ```

7. **Open browser**:
   Navigate to `http://localhost:3000`

---

## Development Environment

### Environment Variables

Create a `.env.local` file with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

### Database Access

- **Supabase Studio**: `http://localhost:54323`
  - Visual database editor
  - View tables, run queries, manage RLS policies

- **PostgreSQL Direct**:
  ```bash
  # Connection string from `supabase status`
  psql postgresql://postgres:postgres@localhost:54322/postgres
  ```

### Hot Reload

The development server supports hot module replacement (HMR):
- **Frontend changes**: Instant reload
- **Server Actions**: Requires page refresh
- **Database changes**: Requires migration and restart

---

## Project Architecture

### Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Backend**: Next.js Server Actions, Supabase
- **Database**: PostgreSQL (Supabase)
- **Styling**: Tailwind CSS 4, Shadcn/UI
- **Validation**: Zod
- **Forms**: React Hook Form

### Directory Structure

```
boarding_house/
├── app/              # Next.js App Router (pages)
├── components/       # React components
├── actions/          # Server Actions (API layer)
├── lib/              # Utilities and helpers
├── types/            # TypeScript types
├── supabase/         # Database migrations
└── docs/             # Documentation
```

### Key Patterns

#### Server Actions

All data mutations use Server Actions:

```typescript
// actions/example.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const Schema = z.object({
  field: z.string().min(1)
})

export async function exampleAction(formData: FormData) {
  const supabase = await createClient()
  
  // 1. Authenticate
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }
  
  // 2. Validate
  const validated = Schema.safeParse({
    field: formData.get('field')
  })
  if (!validated.success) return { error: 'Invalid input' }
  
  // 3. Execute
  const { error } = await supabase
    .from('table')
    .insert(validated.data)
  
  if (error) return { error: error.message }
  
  // 4. Revalidate
  revalidatePath('/path')
  return { success: true }
}
```

#### Component Structure

```typescript
// components/features/example/example-component.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { exampleAction } from '@/actions/example'
import { toast } from 'sonner'

export function ExampleComponent() {
  const [loading, setLoading] = useState(false)
  
  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const result = await exampleAction(formData)
    setLoading(false)
    
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Success!')
    }
  }
  
  return (
    <form action={handleSubmit}>
      {/* Form fields */}
      <Button type="submit" disabled={loading}>
        Submit
      </Button>
    </form>
  )
}
```

---

## Coding Standards

### TypeScript

- **Strict mode**: Enabled in `tsconfig.json`
- **No `any`**: Use proper types or `unknown`
- **Explicit return types**: For functions
- **Interface over type**: For object shapes

### Naming Conventions

- **Files**: `kebab-case.tsx`
- **Components**: `PascalCase`
- **Functions**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Types/Interfaces**: `PascalCase`

### Code Style

- **Indentation**: 2 spaces
- **Quotes**: Single quotes
- **Semicolons**: Optional (but consistent)
- **Line length**: Max 100 characters
- **Trailing commas**: Yes

### Component Guidelines

1. **Use client components sparingly**: Default to server components
2. **Extract reusable logic**: Into custom hooks
3. **Keep components small**: < 200 lines
4. **Use composition**: Over prop drilling
5. **Memoize expensive operations**: Use `useMemo`, `useCallback`

---

## Development Workflow

### Feature Development

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Create database migration** (if needed):
   ```bash
   # Migrations are timestamped SQL files
   # Create in supabase/migrations/
   touch supabase/migrations/$(date +%Y%m%d%H%M%S)_your_migration.sql
   ```

3. **Update TypeScript types** (if schema changed):
   ```bash
   # Regenerate types from database
   npx supabase gen types typescript --local > types/supabase.ts
   ```

4. **Create Server Action**:
   - Add to appropriate file in `actions/`
   - Include Zod validation
   - Add proper authorization checks
   - Return `{ success?: boolean, error?: string }`

5. **Build UI components**:
   - Create in `components/features/[role]/`
   - Use Shadcn/UI components from `components/ui/`
   - Follow existing patterns

6. **Create page**:
   - Add to `app/(protected)/[role]/`
   - Use Server Components where possible
   - Fetch data in the page component

7. **Test thoroughly**:
   - Test with different user roles
   - Verify RLS policies work correctly
   - Check responsive design

8. **Commit changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

9. **Push and create PR**:
   ```bash
   git push origin feature/your-feature-name
   ```

### Database Migrations

#### Creating Migrations

```sql
-- supabase/migrations/20251212000000_example.sql

-- Create table
CREATE TABLE public.example (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.example ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Owner manage example"
ON public.example
USING (
  (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'owner'
);
```

#### Applying Migrations

```bash
# Apply all pending migrations
npm run db:push

# Reset database (WARNING: deletes all data)
npm run db:reset
```

#### Migration Best Practices

1. **One migration per feature**: Keep migrations focused
2. **Always enable RLS**: On tables with user data
3. **Add indexes**: For foreign keys and frequently queried columns
4. **Use transactions**: Wrap related changes in BEGIN/COMMIT
5. **Test rollback**: Ensure migrations can be reversed if needed

### Git Workflow

#### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions

#### Commit Messages

Follow conventional commits:

```
feat: add new feature
fix: resolve bug in component
docs: update API documentation
style: format code
refactor: restructure component
test: add unit tests
chore: update dependencies
```

#### Pull Request Process

1. **Create PR** with descriptive title
2. **Fill out PR template** (if exists)
3. **Request review** from team members
4. **Address feedback** and make changes
5. **Ensure CI passes** (if configured)
6. **Squash and merge** when approved

---

## Testing

### Manual Testing

#### Test User Roles

Create test accounts for each role:

```sql
-- In Supabase Studio SQL Editor

-- Create owner account
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, raw_user_meta_data)
VALUES (
  'owner@test.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  '{"role": "owner", "full_name": "Test Owner"}'::jsonb
);

-- Create tenant account
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, raw_user_meta_data)
VALUES (
  'tenant@test.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  '{"role": "tenant", "full_name": "Test Tenant"}'::jsonb
);
```

#### Testing Checklist

- [ ] Test with owner account
- [ ] Test with tenant account
- [ ] Test with guest (no auth)
- [ ] Test on mobile viewport
- [ ] Test on tablet viewport
- [ ] Test on desktop viewport
- [ ] Test dark mode
- [ ] Test light mode
- [ ] Test form validation
- [ ] Test error states
- [ ] Test loading states
- [ ] Test RLS policies

### RLS Policy Testing

Test policies in Supabase Studio:

```sql
-- Set session to specific user
SELECT auth.uid(); -- Should return user ID

-- Test query as that user
SELECT * FROM rooms; -- Should respect RLS
```

### Performance Testing

- **Lighthouse**: Run in Chrome DevTools
- **Network tab**: Check request sizes
- **React DevTools**: Profile component renders

---

## Debugging

### Common Issues

#### "Unauthorized" errors

**Cause**: User not authenticated or wrong role

**Solution**:
1. Check `auth.uid()` returns a value
2. Verify `user_metadata.role` is set correctly
3. Check RLS policies match user role

#### Database connection errors

**Cause**: Supabase not running or wrong URL

**Solution**:
```bash
# Check Supabase status
docker ps

# Restart Supabase
npm run db:stop
npm run db:start
```

#### Type errors after schema changes

**Cause**: TypeScript types out of sync with database

**Solution**:
```bash
# Regenerate types
npx supabase gen types typescript --local > types/supabase.ts
```

#### RLS policy errors

**Cause**: Policy doesn't allow operation

**Solution**:
1. Check policy in Supabase Studio
2. Verify user has correct role
3. Test policy with SQL:
   ```sql
   SET request.jwt.claims = '{"sub": "user-id", "user_metadata": {"role": "owner"}}';
   SELECT * FROM table;
   ```

### Debugging Tools

#### Server Actions

Add logging:

```typescript
export async function myAction(formData: FormData) {
  console.log('Action called with:', Object.fromEntries(formData))

  const result = await supabase.from('table').insert(data)
  console.log('Result:', result)

  return { success: true }
}
```

#### Client Components

Use React DevTools:
- Inspect component props
- View component state
- Profile renders

#### Database Queries

Use Supabase Studio:
- SQL Editor for manual queries
- Table Editor for data inspection
- Logs for query history

---

## Common Tasks

### Adding a New Page

1. **Create page file**:
   ```typescript
   // app/(protected)/owner/new-page/page.tsx
   import { createClient } from '@/lib/supabase/server'
   import { redirect } from 'next/navigation'

   export default async function NewPage() {
     const supabase = await createClient()
     const { data: { user } } = await supabase.auth.getUser()

     if (!user) redirect('/login')

     return (
       <div>
         <h1>New Page</h1>
       </div>
     )
   }
   ```

2. **Add to navigation**:
   ```typescript
   // app/(protected)/owner/layout.tsx
   const ownerNavItems = [
     // ...existing items
     { label: 'New Page', href: '/owner/new-page', icon: <Icon /> }
   ]
   ```

### Adding a New Server Action

1. **Create action file** (or add to existing):
   ```typescript
   // actions/new-action.ts
   'use server'

   import { createClient } from '@/lib/supabase/server'
   import { revalidatePath } from 'next/cache'
   import { z } from 'zod'

   const Schema = z.object({
     field: z.string().min(1)
   })

   export async function newAction(formData: FormData) {
     const supabase = await createClient()
     const { data: { user } } = await supabase.auth.getUser()

     if (!user) return { error: 'Unauthorized' }

     const validated = Schema.safeParse({
       field: formData.get('field')
     })

     if (!validated.success) return { error: 'Invalid input' }

     const { error } = await supabase
       .from('table')
       .insert(validated.data)

     if (error) return { error: error.message }

     revalidatePath('/path')
     return { success: true }
   }
   ```

2. **Use in component**:
   ```typescript
   import { newAction } from '@/actions/new-action'

   async function handleSubmit(formData: FormData) {
     const result = await newAction(formData)
     if (result.error) {
       toast.error(result.error)
     } else {
       toast.success('Success!')
     }
   }
   ```

### Adding a New Shadcn Component

```bash
# Install component
npx shadcn@latest add [component-name]

# Example: Add dialog
npx shadcn@latest add dialog
```

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update all dependencies
npm update

# Update specific package
npm install [package]@latest

# Update Next.js
npm install next@latest react@latest react-dom@latest
```

---

## Performance Optimization

### Server Components

- **Default to Server Components**: Only use `'use client'` when necessary
- **Fetch data in parallel**: Use `Promise.all()`
- **Stream data**: Use `loading.tsx` for suspense boundaries

### Client Components

- **Memoize expensive calculations**: Use `useMemo`
- **Memoize callbacks**: Use `useCallback`
- **Lazy load components**: Use `dynamic()` from Next.js
- **Optimize images**: Use Next.js `<Image>` component

### Database Queries

- **Use indexes**: On frequently queried columns
- **Limit results**: Use `.limit()` and pagination
- **Select specific columns**: Don't use `SELECT *`
- **Use joins**: Instead of multiple queries

### Caching

- **Revalidate paths**: Use `revalidatePath()` after mutations
- **Cache static data**: Use Next.js caching
- **Use Supabase cache**: For frequently accessed data

---

## Security Considerations

### Authentication

- **Always check `auth.uid()`**: In Server Actions
- **Verify user role**: Check `user_metadata.role`
- **Use RLS policies**: Never bypass with service role key in client

### Data Validation

- **Validate all inputs**: Use Zod schemas
- **Sanitize user input**: Prevent XSS attacks
- **Use parameterized queries**: Supabase client handles this

### Environment Variables

- **Never expose service role key**: Only use in Server Actions
- **Use `NEXT_PUBLIC_` prefix**: Only for public variables
- **Don't commit `.env.local`**: Add to `.gitignore`

### RLS Policies

- **Enable RLS on all tables**: With user data
- **Test policies thoroughly**: With different roles
- **Use `SECURITY DEFINER`**: For trusted functions only

### File Uploads

- **Validate file types**: Check MIME types
- **Limit file sizes**: Prevent abuse
- **Use storage policies**: Restrict access appropriately

---

## Useful Commands

```bash
# Development
npm run dev                 # Start dev server
npm run build              # Build for production
npm run start              # Start production server
npm run lint               # Run ESLint

# Database
npm run db:start           # Start Supabase
npm run db:stop            # Stop Supabase
npm run db:reset           # Reset database
npm run db:push            # Apply migrations

# Docker
npm run docker:up          # Start full stack
npm run docker:down        # Stop all services

# Supabase CLI
npx supabase status        # Check status
npx supabase db diff       # Generate migration from changes
npx supabase gen types typescript --local > types/supabase.ts  # Generate types
```

---

## Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Shadcn/UI**: https://ui.shadcn.com
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React Hook Form**: https://react-hook-form.com
- **Zod**: https://zod.dev

---

**Last Updated**: 2025-12-12
