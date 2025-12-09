# Supabase Local Development with Docker

This guide explains how to run the Boarding House application locally using Docker for the database (Supabase) and optionally for the frontend.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- [Node.js 18+](https://nodejs.org/) (if running frontend locally without Docker)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (optional but recommended)

## Option 1: Using Supabase CLI (Recommended)

### Step 1: Install Supabase CLI

```bash
# Windows (Scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Or using npm
npm install -g supabase
```

### Step 2: Initialize Supabase (if not already done)

```bash
supabase init
```

### Step 3: Start Supabase Locally

```bash
supabase start
```

This will output your local credentials:
- **API URL**: `http://localhost:54321`
- **Anon Key**: (displayed in terminal)
- **Service Role Key**: (displayed in terminal)
- **Studio URL**: `http://localhost:54323` (Database GUI)

### Step 4: Apply Migrations

```bash
supabase db push
```

### Step 5: Update .env.local

Create/update `.env.local` with local credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key-from-terminal>
SUPABASE_SERVICE_ROLE_KEY=<your-service-key-from-terminal>
```

### Step 6: Run Frontend Locally

```bash
npm run dev
```

Visit: `http://localhost:3000`

---

## Option 2: Full Docker Stack (Database + Frontend)

Use the provided `docker-compose.yml` to run everything in Docker.

### Step 1: Start All Services

```bash
docker-compose up -d
```

This starts:
- Supabase (PostgreSQL, Auth, REST API, Realtime)
- Next.js App

### Step 2: Apply Migrations

```bash
docker-compose exec app npx supabase db push
```

### Step 3: Access

- **App**: `http://localhost:3000`
- **Supabase Studio**: `http://localhost:54323`

### Step 4: Stop Services

```bash
docker-compose down
```

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API URL | `http://localhost:54321` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anonymous key | (from supabase start) |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin key for server actions | (from supabase start) |

---

## Troubleshooting

### Docker not starting?
Ensure Docker Desktop is running and has enough resources allocated.

### Migrations failing?
Check that all `.sql` files in `supabase/migrations/` are valid syntax.

### Can't connect to database?
Verify the URL in `.env.local` matches the output from `supabase start`.
