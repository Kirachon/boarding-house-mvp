# 🏠 Boarding House Management System

A complete property management solution for boarding house owners, tenants, and guests.

## 🚀 Quick Start (Local Development)

### Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for database)

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Database (Supabase Local)

Make sure Docker Desktop is running, then:

```bash
npm run db:start
```

This will:
- Start PostgreSQL, Auth, Realtime, and REST API in Docker
- Output your local API credentials
- Start Supabase Studio at `http://localhost:54323`

**Copy the credentials** from the terminal output!

### 3. Configure Environment

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<paste-anon-key-from-terminal>
SUPABASE_SERVICE_ROLE_KEY=<paste-service-role-key-from-terminal>
```

### 4. Apply Database Migrations

```bash
npm run db:push
```

### 5. Start the Application

```bash
npm run dev
```

Visit: **http://localhost:3000**

### 6. Create Test Accounts

1. Go to `http://localhost:3000/signup`
2. Create an **Owner** account (select "Owner" role)
3. Create a **Tenant** account (or use the Tenant Invite feature)

---

## 🐳 Docker Commands

| Command | Description |
|---------|-------------|
| `npm run db:start` | Start Supabase (database + auth + API) |
| `npm run db:stop` | Stop Supabase services |
| `npm run db:reset` | Reset database and reapply migrations |
| `npm run db:push` | Apply pending migrations |
| `npm run docker:up` | Start full stack in Docker |
| `npm run docker:down` | Stop all Docker services |

---

## 📁 Project Structure

```
boarding_house/
├── app/                    # Next.js App Router pages
│   ├── (protected)/        # Auth-required routes
│   │   ├── owner/          # Owner dashboard, rooms, tenants, finance
│   │   └── tenant/         # Tenant dashboard
│   ├── verify/[id]/        # Public property verification page
│   └── login, signup       # Auth pages
├── components/             # React components
│   ├── ui/                 # Shadcn/UI components
│   └── features/           # Feature-specific components
├── actions/                # Server Actions
├── lib/                    # Utilities & Supabase clients
├── supabase/               # Database configuration
│   └── migrations/         # SQL migration files
└── types/                  # TypeScript types
```

---

## ✅ Features

### For Owners
- 🏠 Room Management (CRUD)
- 👤 Tenant Onboarding & Assignment
- 📥 Grievance Inbox with real-time updates
- 📊 Living Inventory Dashboard
- 💰 Invoice Generation & Payment Tracking
- 📈 Financial Summary (P/L)

### For Tenants
- 📝 Issue Reporting
- 📡 Real-time Status Updates
- 📄 View Bills & Payment Status

### For Guests (Public)
- 🔍 Property Verification Portal
- 🏷️ Trust Badges & Room Availability

---

## 🔧 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** PostgreSQL (Supabase)
- **Auth:** Supabase Auth
- **Realtime:** Supabase Realtime
- **UI:** Shadcn/UI + Tailwind CSS
- **Forms:** React Hook Form + Zod

---

## 📚 Documentation

- [Docker Setup Guide](docs/DOCKER_SETUP.md)
- [Epics & User Stories](docs/epics.md)
- [Sprint Artifacts](docs/sprint-artifacts/)

---

## 🛠️ Troubleshooting

### "Docker not running"
Start Docker Desktop before running `npm run db:start`.

### "Connection refused" errors
Check that Supabase is running: `docker ps`

### Migrations failing?
Try resetting: `npm run db:reset`

---

## 📄 License

MIT
