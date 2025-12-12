# 🏠 Boarding House Management System

A comprehensive, modern property management solution for boarding house owners, tenants, and guests. Built with transparency and trust at its core, this application revolutionizes boarding house management through real-time updates, mobile-first design, and intuitive user experience.

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start-local-development)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Development Workflow](#-development-workflow)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Documentation](#-documentation)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Overview

The Boarding House Management System is a **SaaS B2B platform** designed to provide complete transparency and efficient management for boarding house operations. The application serves three distinct user roles:

- **Owners**: Comprehensive property management, tenant oversight, financial tracking
- **Tenants**: Issue reporting, payment management, real-time status updates
- **Guests**: Public property verification and inquiry system

### Key Differentiators

- **Transparency-First Design**: Real-time "pizza tracker" style updates for all grievances and maintenance
- **Mobile-First Experience**: Fully responsive PWA-ready design
- **Living Inventory System**: Track room conditions and occupancy in real-time
- **Trust Loop**: Dedicated feedback channels with transparent status tracking

## 🚀 Quick Start (Local Development)

### Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for database)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/Kirachon/boarding-house-mvp.git
cd boarding-house-mvp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Database (Supabase Local)

Make sure Docker Desktop is running, then:

```bash
npm run db:start
```

This will:
- Start PostgreSQL, Auth, Realtime, and REST API in Docker
- Output your local API credentials
- Start Supabase Studio at `http://localhost:54323`

**Copy the credentials** from the terminal output!

### 4. Configure Environment

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<paste-anon-key-from-terminal>
SUPABASE_SERVICE_ROLE_KEY=<paste-service-role-key-from-terminal>
```

See [Configuration](#-configuration) for more details.

### 5. Apply Database Migrations

```bash
npm run db:push
```

### 6. Start the Application

```bash
npm run dev
```

Visit: **http://localhost:3000**

### 7. Create Test Accounts

1. Go to `http://localhost:3000/login`
2. Click "Sign Up" to create an **Owner** account
3. After logging in as owner, use the Tenant Invite feature to create tenant accounts
4. Visit `/verify/[property-id]` for the public guest portal

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

## ✨ Features

### For Owners

#### Property & Room Management
- 🏠 **Room Management**: Create, update, and delete rooms with pricing and capacity
- 🏢 **Property Management**: Manage multiple properties with verification badges
- 📊 **Living Inventory Dashboard**: Track room conditions and item status in real-time
- 📈 **Occupancy Tracking**: Monitor room occupancy with sparkline visualizations

#### Tenant Management
- 👤 **Tenant Onboarding**: Invite tenants via email with automatic account creation
- 🔄 **Room Assignment**: Assign and reassign tenants to rooms
- 📋 **Handover Checklists**: Move-in/move-out checklists for accountability
- 📜 **Tenant History**: View past and current tenant assignments

#### Financial Management
- 💰 **Invoice Generation**: Create and manage invoices for tenants
- 💳 **Payment Tracking**: Track payment status with proof verification
- 📊 **Financial Dashboard**: P/L summary with revenue and expense tracking
- 💵 **Expense Management**: Record and categorize operational expenses
- 📉 **Meter Readings**: Track electricity and water consumption

#### Maintenance & Operations
- 📥 **Grievance Inbox**: Centralized inbox for all tenant issues
- 🔧 **Work Order Management**: Create and track maintenance work orders
- 👷 **Vendor Management**: Maintain vendor database with contact info
- 📸 **Photo Attachments**: Visual documentation of issues and repairs

#### Communication & Engagement
- 📢 **Announcements**: Broadcast messages to all tenants
- 💬 **Real-time Chat**: Direct messaging with tenants
- 🔔 **Notifications**: Automated alerts for important events
- 📅 **Calendar Widget**: Track important dates and lease expirations

#### Documents & Compliance
- 📄 **Document Management**: Store and manage lease agreements
- 📋 **House Rules**: Publish and maintain property rules
- 🔐 **Secure Storage**: Cloud-based document storage with access control

### For Tenants

#### Dashboard & Overview
- 🏠 **Command Center**: Personalized dashboard with key metrics
- 📊 **Activity Timeline**: Track all interactions and updates
- 🎯 **Quick Actions**: Fast access to common tasks

#### Issue Management
- 📝 **Issue Reporting**: Submit grievances with photos and descriptions
- 📡 **Real-time Status Updates**: "Pizza tracker" style progress tracking
- 🔔 **Notifications**: Get notified when issues are updated
- 📸 **Photo Upload**: Attach images to grievance reports

#### Financial Management
- 📄 **View Bills**: See all invoices and payment history
- 💳 **Payment Proof Upload**: Submit payment verification images
- 📊 **Payment Status**: Track paid, unpaid, and pending invoices
- 📅 **Due Date Reminders**: Never miss a payment deadline

#### Room & Inventory
- 🛏️ **Room Inventory**: View all items in your room
- ✅ **Handover Checklists**: Complete move-in/move-out inspections
- 📋 **Item Condition Tracking**: Report damaged or missing items

#### Communication
- 💬 **Direct Chat**: Message property owner directly
- 📢 **Announcements**: Receive important property updates
- 📄 **House Rules**: Access property rules and guidelines
- 📑 **Lease Documents**: View your lease agreement

#### Profile & Settings
- 👤 **Profile Management**: Update personal information
- 🔐 **Security Settings**: Change password and manage account
- 🔔 **Notification Preferences**: Customize alert settings
- 🎨 **Theme Toggle**: Light/dark mode support

### For Guests (Public)

- 🔍 **Property Verification Portal**: Verify property legitimacy
- 🏷️ **Trust Badges**: See verified property status
- 📊 **Room Availability**: Check current vacancy status
- 📝 **Inquiry Form**: Submit questions to property owner
- 🗺️ **Property Information**: View location and amenities

---

## 🔧 Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Component Library**: Shadcn/UI (Radix UI primitives)
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Theme**: next-themes (light/dark mode)
- **Notifications**: Sonner (toast notifications)

### Backend
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth (JWT-based)
- **Real-time**: Supabase Realtime (WebSocket)
- **Storage**: Supabase Storage (S3-compatible)
- **API**: Next.js Server Actions
- **ORM**: Supabase JS Client

### Infrastructure
- **Hosting**: Vercel (recommended) or Docker
- **Database Hosting**: Supabase Cloud or Self-hosted
- **Container**: Docker + Docker Compose
- **CI/CD**: GitHub Actions (optional)

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint 9
- **Type Checking**: TypeScript
- **Database Migrations**: Supabase CLI
- **Local Development**: Supabase Local (Docker-based)

---

## 🗂️ Project Structure

```
boarding_house/
├── app/                          # Next.js App Router
│   ├── (protected)/              # Protected routes (auth required)
│   │   ├── owner/                # Owner dashboard and features
│   │   │   ├── dashboard/        # Owner overview
│   │   │   ├── rooms/            # Room management
│   │   │   ├── tenants/          # Tenant management
│   │   │   ├── finance/          # Financial management
│   │   │   ├── maintenance/      # Maintenance & work orders
│   │   │   ├── properties/       # Property management
│   │   │   ├── documents/        # Documents & rules
│   │   │   └── settings/         # Owner settings
│   │   └── tenant/               # Tenant dashboard and features
│   │       ├── dashboard/        # Tenant overview
│   │       ├── bills/            # Invoice management
│   │       ├── issues/           # Grievance reporting
│   │       ├── room/             # Room inventory
│   │       ├── profile/          # Profile settings
│   │       └── notifications/    # Notification center
│   ├── api/                      # API routes (if any)
│   ├── login/                    # Login page
│   ├── verify/[id]/              # Public property verification
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
│
├── components/                   # React components
│   ├── features/                 # Feature-specific components
│   │   ├── owner/                # Owner components
│   │   ├── tenant/               # Tenant components
│   │   ├── guest/                # Guest components
│   │   └── auth/                 # Authentication components
│   ├── shared/                   # Shared components
│   │   ├── dashboard-shell.tsx   # Dashboard layout wrapper
│   │   ├── dashboard-sidebar.tsx # Sidebar navigation
│   │   └── metric-card.tsx       # Metric display card
│   ├── ui/                       # Shadcn/UI components
│   └── providers/                # Context providers
│
├── actions/                      # Server Actions (API layer)
│   ├── auth.ts                   # Authentication actions
│   ├── room.ts                   # Room management
│   ├── tenant.ts                 # Tenant management
│   ├── invoice.ts                # Invoice management
│   ├── grievance.ts              # Grievance management
│   ├── property.ts               # Property management
│   ├── maintenance.ts            # Maintenance & work orders
│   ├── announcement.ts           # Announcements
│   ├── expense.ts                # Expense tracking
│   ├── messages.ts               # Chat messaging
│   ├── profile.ts                # Profile management
│   └── security.ts               # Security settings
│
├── lib/                          # Utility libraries
│   ├── supabase/                 # Supabase clients
│   │   ├── client.ts             # Client-side client
│   │   ├── server.ts             # Server-side client
│   │   └── middleware.ts         # Auth middleware
│   ├── data/                     # Data access layer
│   │   ├── owner.ts              # Owner data queries
│   │   └── tenant.ts             # Tenant data queries
│   ├── helpers/                  # Helper functions
│   │   └── navigation.ts         # Navigation utilities
│   └── utils.ts                  # General utilities
│
├── supabase/                     # Supabase configuration
│   ├── config.toml               # Supabase config
│   └── migrations/               # SQL migration files
│       ├── 20251209120104_init_auth_schema.sql
│       ├── 20251209133753_create_grievances.sql
│       ├── 20251209142940_create_inventory.sql
│       └── ... (20+ migrations)
│
├── types/                        # TypeScript type definitions
│   └── supabase.ts               # Generated Supabase types
│
├── docs/                         # Documentation
│   ├── API.md                    # API documentation
│   ├── DATABASE.md               # Database schema
│   ├── DEVELOPMENT.md            # Development guide
│   ├── FEATURES.md               # Feature documentation
│   ├── DOCKER_SETUP.md           # Docker setup guide
│   ├── VERCEL_DEPLOY.md          # Deployment guide
│   ├── architecture.md           # Architecture decisions
│   ├── prd.md                    # Product requirements
│   └── sprint-artifacts/         # Sprint documentation
│
├── public/                       # Static assets
├── .env.local                    # Local environment variables
├── .env.example                  # Environment template
├── docker-compose.yml            # Docker configuration
├── Dockerfile                    # Docker image definition
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

---

## ⚙️ Configuration

### Environment Variables

The application requires the following environment variables:

#### Required Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

#### Local Development (Option 1: Supabase CLI)

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from-supabase-start-output>
SUPABASE_SERVICE_ROLE_KEY=<from-supabase-start-output>
```

#### Local Development (Option 2: Docker Demo Keys)

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
```

#### Production (Supabase Cloud)

Get these from your [Supabase Dashboard](https://app.supabase.com):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-production-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-production-service-role-key>
```

### Configuration Files

- **`next.config.ts`**: Next.js configuration (image domains, etc.)
- **`tailwind.config.ts`**: Tailwind CSS customization
- **`components.json`**: Shadcn/UI configuration
- **`supabase/config.toml`**: Supabase local development config

---

## 💻 Development Workflow

### Available Scripts

```bash
# Development
npm run dev              # Start development server (http://localhost:3000)
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database (Supabase CLI)
npm run db:start         # Start Supabase locally
npm run db:stop          # Stop Supabase
npm run db:reset         # Reset database and reapply migrations
npm run db:push          # Apply pending migrations

# Docker
npm run docker:up        # Start full stack in Docker
npm run docker:down      # Stop all Docker services
```

### Development Best Practices

1. **Always run migrations** after pulling changes: `npm run db:push`
2. **Use Server Actions** for all data mutations (no direct API routes)
3. **Follow the feature-sliced structure** when adding new components
4. **Use TypeScript strictly** - no `any` types without justification
5. **Validate all inputs** with Zod schemas
6. **Test RLS policies** before deploying to production
7. **Use the Data Access Layer** (`lib/data/`) for complex queries
8. **Follow Shadcn/UI patterns** for consistent UI components

### Adding New Features

1. **Create migration** in `supabase/migrations/`
2. **Update types** by regenerating `types/supabase.ts`
3. **Create Server Action** in `actions/`
4. **Build UI components** in `components/features/`
5. **Create page** in appropriate `app/` directory
6. **Test RLS policies** with different user roles
7. **Update documentation**

### Code Style

- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Not required (but consistent)
- **Naming**: camelCase for variables, PascalCase for components
- **File naming**: kebab-case for files, PascalCase for components

---

## 📚 Documentation

### Core Documentation

- **[API Documentation](docs/API.md)** - Server Actions and endpoints
- **[Database Schema](docs/DATABASE.md)** - Tables, relationships, and RLS policies
- **[Development Guide](docs/DEVELOPMENT.md)** - Detailed development workflow
- **[Feature Documentation](docs/FEATURES.md)** - Feature usage and implementation

### Setup & Deployment

- **[Docker Setup Guide](docs/DOCKER_SETUP.md)** - Local development with Docker
- **[Vercel Deployment](docs/VERCEL_DEPLOY.md)** - Deploy to Vercel

### Architecture & Planning

- **[Architecture](docs/architecture.md)** - Architecture decisions and patterns
- **[Product Requirements](docs/prd.md)** - Product vision and requirements
- **[Epics & User Stories](docs/epics.md)** - Feature epics and user stories
- **[Sprint Artifacts](docs/sprint-artifacts/)** - Sprint-by-sprint implementation notes

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git push origin master
   ```

2. **Import to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**:
   Add the following in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

4. **Deploy**:
   Vercel will automatically build and deploy

See [VERCEL_DEPLOY.md](docs/VERCEL_DEPLOY.md) for detailed instructions.

### Deploy with Docker

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop
docker-compose down
```

---

## 🛠️ Troubleshooting

### Common Issues

#### "Docker not running"
**Solution**: Start Docker Desktop before running `npm run db:start`

#### "Connection refused" errors
**Solution**: Check that Supabase is running:
```bash
docker ps
```
You should see containers for postgres, auth, rest, realtime, etc.

#### Migrations failing
**Solution**: Reset the database:
```bash
npm run db:reset
```

#### "Invalid JWT" or authentication errors
**Solution**:
1. Verify environment variables are correct
2. Check that `NEXT_PUBLIC_SUPABASE_URL` matches your Supabase instance
3. Ensure you're using the correct anon key

#### Build errors after pulling changes
**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

#### RLS policy errors
**Solution**: Check that:
1. User is authenticated
2. User has the correct role in `user_metadata`
3. RLS policies match the user's role

### Getting Help

- **Issues**: [GitHub Issues](https://github.com/Kirachon/boarding-house-mvp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Kirachon/boarding-house-mvp/discussions)
- **Documentation**: Check the `docs/` folder

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes** following the code style guidelines
4. **Test thoroughly** with different user roles
5. **Commit with clear messages**: `git commit -m "feat: add new feature"`
6. **Push to your fork**: `git push origin feature/your-feature-name`
7. **Create a Pull Request**

### Commit Message Convention

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🙏 Acknowledgments

- **Next.js** - The React Framework
- **Supabase** - Open source Firebase alternative
- **Shadcn/UI** - Beautiful component library
- **Vercel** - Deployment platform
- **Tailwind CSS** - Utility-first CSS framework

---

**Built with ❤️ for transparent and efficient boarding house management**
