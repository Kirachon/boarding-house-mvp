# Database Schema Documentation

This document describes the complete database schema for the Boarding House Management System.

## Table of Contents

- [Overview](#overview)
- [Entity Relationship Diagram](#entity-relationship-diagram)
- [Tables](#tables)
- [Enums](#enums)
- [Row Level Security (RLS)](#row-level-security-rls)
- [Storage Buckets](#storage-buckets)
- [Functions & Triggers](#functions--triggers)
- [Indexes](#indexes)
- [Migrations](#migrations)

## Overview

The database is built on **PostgreSQL** via **Supabase** and uses:
- **Row Level Security (RLS)** for data isolation
- **Foreign Key Constraints** for referential integrity
- **Triggers** for automatic profile creation
- **Enums** for type safety
- **Storage Buckets** for file uploads

### Database Provider
- **Production**: Supabase Cloud (PostgreSQL 15+)
- **Development**: Supabase Local (Docker-based PostgreSQL)

### Connection Details
- **URL**: Configured via `NEXT_PUBLIC_SUPABASE_URL`
- **Authentication**: JWT-based via Supabase Auth
- **API**: Supabase JS Client + Server Actions

---

## Entity Relationship Diagram

```
┌─────────────┐
│ auth.users  │ (Supabase Auth)
└──────┬──────┘
       │
       │ 1:1
       ▼
┌─────────────┐         ┌──────────────┐
│  profiles   │◄────────┤  properties  │
└──────┬──────┘  owner  └──────┬───────┘
       │                        │
       │ 1:N                    │ 1:N
       ▼                        ▼
┌─────────────┐         ┌──────────────┐
│ grievances  │         │    rooms     │
└─────────────┘         └──────┬───────┘
       │                       │
       │ 1:1                   │ 1:N
       ▼                       ▼
┌─────────────┐         ┌──────────────────────────┐
│ work_orders │         │ tenant_room_assignments  │
└─────────────┘         └──────────────────────────┘
       │                       │
       │ N:1                   │ 1:N
       ▼                       ▼
┌─────────────┐         ┌──────────────────────────┐
│   vendors   │         │ room_handover_checklists │
└─────────────┘         └──────────────────────────┘

┌─────────────┐         ┌──────────────┐
│  invoices   │         │  documents   │
└─────────────┘         └──────────────┘
       │                       │
       │ N:1                   │ N:1
       └───────────┬───────────┘
                   ▼
            ┌─────────────┐
            │ auth.users  │
            │  (tenant)   │
            └─────────────┘

┌─────────────┐         ┌──────────────┐
│  messages   │         │chat_channels │
└──────┬──────┘         └──────┬───────┘
       │                       │
       │ N:1                   │ 1:N
       └───────────┬───────────┘
                   ▼
            ┌──────────────────┐
            │ channel_members  │
            └──────────────────┘
```

---

## Tables

### `profiles`

User profile information (extends `auth.users`).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, FK → auth.users(id) | User ID |
| `role` | user_role | NOT NULL, DEFAULT 'guest' | User role |
| `full_name` | TEXT | | User's full name |
| `phone` | TEXT | | Phone number |
| `avatar_url` | TEXT | | Avatar image URL |
| `preferences` | JSONB | DEFAULT '{}' | User preferences |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |

**Indexes**:
- Primary key on `id`

**RLS Policies**:
- Users can view their own profile
- Users can update their own profile

---

### `properties`

Boarding house properties owned by users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Property ID |
| `owner_id` | UUID | FK → auth.users(id) | Owner user ID |
| `name` | TEXT | NOT NULL | Property name |
| `address` | TEXT | NOT NULL | Property address |
| `description` | TEXT | | Property description |
| `is_verified` | BOOLEAN | DEFAULT FALSE | Verification status |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |

**Indexes**:
- Primary key on `id`
- Index on `owner_id`

**RLS Policies**:
- Public read access (for verification portal)
- Owners can manage their own properties

---

### `rooms`

Individual rooms within properties.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Room ID |
| `property_id` | UUID | FK → properties(id) | Associated property |
| `name` | TEXT | NOT NULL | Room name/number |
| `price` | NUMERIC(10,2) | NOT NULL, DEFAULT 0.00 | Monthly rent |
| `capacity` | INT | NOT NULL, DEFAULT 1 | Max occupancy |
| `occupancy` | room_occupancy | NOT NULL, DEFAULT 'vacant' | Current status |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |

**Indexes**:
- Primary key on `id`
- Index on `property_id`

**RLS Policies**:
- Owners can manage rooms
- Tenants can view rooms (limited)

---

### `tenant_room_assignments`

Tracks tenant-to-room assignments over time.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Assignment ID |
| `tenant_id` | UUID | FK → auth.users(id) | Tenant user ID |
| `room_id` | UUID | FK → rooms(id) | Assigned room |
| `start_date` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Move-in date |
| `end_date` | TIMESTAMPTZ | | Move-out date |
| `is_active` | BOOLEAN | DEFAULT TRUE | Active status |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |

**Indexes**:
- Primary key on `id`
- Index on `tenant_id`
- Index on `room_id`
- Index on `is_active`

**RLS Policies**:
- Owners can view all assignments
- Tenants can view their own assignments

---

### `grievances`

Tenant-reported issues and complaints.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Grievance ID |
| `tenant_id` | UUID | FK → auth.users(id) | Reporting tenant |
| `category` | grievance_category | NOT NULL | Issue category |
| `description` | TEXT | NOT NULL | Issue description |
| `photo_url` | TEXT | | Attachment URL |
| `status` | grievance_status | NOT NULL, DEFAULT 'open' | Current status |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update |

**Indexes**:
- Primary key on `id`
- Index on `tenant_id`
- Index on `status`

**RLS Policies**:
- Tenants can view and create their own grievances
- Owners can view all grievances and update status

---

### `work_orders`

Maintenance work orders created from grievances.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Work order ID |
| `grievance_id` | UUID | FK → grievances(id) | Associated grievance |
| `vendor_id` | UUID | FK → vendors(id) | Assigned vendor |
| `status` | work_order_status | NOT NULL, DEFAULT 'open' | Current status |
| `scheduled_date` | TIMESTAMPTZ | | Scheduled date |
| `completed_date` | TIMESTAMPTZ | | Completion date |
| `estimated_cost` | NUMERIC(10,2) | | Estimated cost |
| `actual_cost` | NUMERIC(10,2) | | Actual cost |
| `notes` | TEXT | | Work notes |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |

**Indexes**:
- Primary key on `id`
- Index on `grievance_id`
- Index on `vendor_id`
- Index on `status`

**RLS Policies**:
- Owners can manage work orders
- Tenants can view work orders related to their grievances

---

### `vendors`

Maintenance vendor contact information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Vendor ID |
| `name` | TEXT | NOT NULL | Vendor name |
| `phone` | TEXT | | Contact phone |
| `email` | TEXT | | Contact email |
| `services` | TEXT | | Services provided |
| `notes` | TEXT | | Additional notes |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |

**Indexes**:
- Primary key on `id`

**RLS Policies**:
- Owners can manage vendors

---

### `invoices`

Billing invoices for tenants.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Invoice ID |
| `tenant_id` | UUID | FK → auth.users(id) | Billed tenant |
| `amount` | NUMERIC(10,2) | NOT NULL | Invoice amount |
| `due_date` | TIMESTAMPTZ | NOT NULL | Payment due date |
| `description` | TEXT | NOT NULL | Invoice description |
| `status` | invoice_status | NOT NULL, DEFAULT 'unpaid' | Payment status |
| `proof_image_url` | TEXT | | Payment proof URL |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |

**Indexes**:
- Primary key on `id`
- Index on `tenant_id`
- Index on `status`
- Index on `due_date`

**RLS Policies**:
- Owners can create and manage invoices
- Tenants can view their own invoices and upload payment proof

---

### `expenses`

Operational expenses tracked by owners.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Expense ID |
| `category` | TEXT | NOT NULL | Expense category |
| `amount` | NUMERIC(10,2) | NOT NULL | Expense amount |
| `description` | TEXT | | Expense description |
| `expense_date` | TIMESTAMPTZ | DEFAULT NOW() | Expense date |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |

**Indexes**:
- Primary key on `id`
- Index on `expense_date`

**RLS Policies**:
- Owners can manage expenses

---

### `announcements`

Property-wide announcements.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Announcement ID |
| `title` | TEXT | NOT NULL | Announcement title |
| `content` | TEXT | NOT NULL | Announcement content |
| `is_active` | BOOLEAN | DEFAULT TRUE | Active status |
| `created_by` | UUID | FK → auth.users(id) | Creator user ID |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |

**Indexes**:
- Primary key on `id`
- Index on `is_active`

**RLS Policies**:
- Owners can manage announcements
- Tenants can view active announcements

---

### `documents`

Lease agreements and other documents.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Document ID |
| `tenant_id` | UUID | FK → auth.users(id) | Associated tenant |
| `title` | TEXT | NOT NULL | Document title |
| `type` | TEXT | NOT NULL, CHECK IN ('lease', 'other') | Document type |
| `file_url` | TEXT | NOT NULL | File storage URL |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |

**Indexes**:
- Primary key on `id`
- Index on `tenant_id`

**RLS Policies**:
- Tenants can view their own documents
- Owners can view all documents

---

### `messages`

Chat messages between users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Message ID |
| `channel_id` | UUID | FK → chat_channels(id) | Chat channel |
| `sender_id` | UUID | FK → auth.users(id) | Message sender |
| `content` | TEXT | NOT NULL | Message content |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |

**Indexes**:
- Primary key on `id`
- Index on `channel_id`
- Index on `sender_id`
- Index on `created_at DESC`

**RLS Policies**:
- Users can view messages in their channels
- Users can send messages

---

### `chat_channels`

Chat channels for messaging.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Channel ID |
| `type` | channel_type | NOT NULL | Channel type |
| `name` | TEXT | | Channel name |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |

**Indexes**:
- Primary key on `id`

**RLS Policies**:
- Users can view channels they are members of

---

### `channel_members`

Channel membership tracking.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Membership ID |
| `channel_id` | UUID | FK → chat_channels(id) | Channel |
| `user_id` | UUID | FK → auth.users(id) | Member user |
| `joined_at` | TIMESTAMPTZ | DEFAULT NOW() | Join timestamp |

**Indexes**:
- Primary key on `id`
- Unique constraint on `(channel_id, user_id)`
- Index on `user_id`

**RLS Policies**:
- Users can view their own memberships
- Users can view other members in their channels

---

### `notifications`

User notifications.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Notification ID |
| `user_id` | UUID | FK → auth.users(id) | Recipient user |
| `title` | TEXT | NOT NULL | Notification title |
| `message` | TEXT | NOT NULL | Notification message |
| `type` | TEXT | | Notification type |
| `is_read` | BOOLEAN | DEFAULT FALSE | Read status |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |

**Indexes**:
- Primary key on `id`
- Index on `user_id`
- Index on `is_read`

**RLS Policies**:
- Users can view and update their own notifications

---

### `meter_readings`

Utility meter readings for rooms.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Reading ID |
| `room_id` | UUID | FK → rooms(id) | Room |
| `reading_date` | TIMESTAMPTZ | NOT NULL | Reading date |
| `electricity_reading` | NUMERIC(10,2) | | Electricity reading |
| `water_reading` | NUMERIC(10,2) | | Water reading |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |

**Indexes**:
- Primary key on `id`
- Index on `room_id`
- Index on `reading_date`

**RLS Policies**:
- Owners can manage meter readings

---

### `room_handover_checklists`

Move-in/move-out checklists.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Checklist ID |
| `assignment_id` | UUID | FK → tenant_room_assignments(id) | Assignment |
| `type` | TEXT | NOT NULL, CHECK IN ('move_in', 'move_out') | Checklist type |
| `is_completed` | BOOLEAN | DEFAULT FALSE | Completion status |
| `completed_at` | TIMESTAMPTZ | | Completion timestamp |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |

**Indexes**:
- Primary key on `id`
- Index on `assignment_id`

**RLS Policies**:
- Owners can view all checklists
- Tenants can view and complete their own checklists

---

### `inquiries`

Guest inquiries from verification portal.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Inquiry ID |
| `property_id` | UUID | FK → properties(id) | Property |
| `name` | TEXT | NOT NULL | Inquirer name |
| `email` | TEXT | NOT NULL | Inquirer email |
| `phone` | TEXT | | Contact phone |
| `message` | TEXT | NOT NULL | Inquiry message |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |

**Indexes**:
- Primary key on `id`
- Index on `property_id`

**RLS Policies**:
- Public can insert inquiries
- Owners can view inquiries for their properties

---

## Enums

### `user_role`

User role types.

```sql
CREATE TYPE public.user_role AS ENUM ('owner', 'tenant', 'guest', 'admin');
```

**Values**:
- `owner`: Property owner
- `tenant`: Tenant/boarder
- `guest`: Public visitor
- `admin`: System administrator

---

### `grievance_category`

Grievance issue categories.

```sql
CREATE TYPE public.grievance_category AS ENUM ('wifi', 'cleaning', 'maintenance', 'other');
```

**Values**:
- `wifi`: Internet connectivity issues
- `cleaning`: Cleanliness concerns
- `maintenance`: Repair/maintenance needs
- `other`: Other issues

---

### `grievance_status`

Grievance processing status.

```sql
CREATE TYPE public.grievance_status AS ENUM ('open', 'in_progress', 'resolved', 'rejected');
```

**Values**:
- `open`: Newly reported
- `in_progress`: Being addressed
- `resolved`: Completed
- `rejected`: Not actionable

---

### `room_occupancy`

Room occupancy status.

```sql
CREATE TYPE public.room_occupancy AS ENUM ('vacant', 'occupied', 'maintenance');
```

**Values**:
- `vacant`: Available for rent
- `occupied`: Currently rented
- `maintenance`: Under maintenance

---

### `invoice_status`

Invoice payment status.

```sql
CREATE TYPE public.invoice_status AS ENUM ('paid', 'unpaid', 'cancelled', 'pending_verification');
```

**Values**:
- `paid`: Payment confirmed
- `unpaid`: Payment pending
- `cancelled`: Invoice cancelled
- `pending_verification`: Payment proof submitted, awaiting verification

---

### `work_order_status`

Work order processing status.

```sql
CREATE TYPE public.work_order_status AS ENUM ('open', 'in_progress', 'waiting_vendor', 'completed', 'cancelled');
```

**Values**:
- `open`: Created, not started
- `in_progress`: Work in progress
- `waiting_vendor`: Waiting for vendor
- `completed`: Work completed
- `cancelled`: Work order cancelled

---

### `item_condition`

Inventory item condition.

```sql
CREATE TYPE public.item_condition AS ENUM ('good', 'fair', 'poor', 'broken');
```

**Values**:
- `good`: Excellent condition
- `fair`: Minor wear
- `poor`: Significant wear
- `broken`: Non-functional

---

### `channel_type`

Chat channel types.

```sql
CREATE TYPE public.channel_type AS ENUM ('direct', 'group');
```

**Values**:
- `direct`: One-on-one chat
- `group`: Group chat

---

## Row Level Security (RLS)

All tables have RLS enabled. Policies are based on:
- **User authentication**: `auth.uid()`
- **User role**: `(auth.jwt() ->> 'user_metadata')::jsonb ->> 'role'`
- **Ownership**: Foreign key relationships

### Common Policy Patterns

#### Owner Full Access
```sql
CREATE POLICY "Owner manage [table]"
ON public.[table]
USING (
  (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'owner'
)
WITH CHECK (
  (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'owner'
);
```

#### Tenant Own Data
```sql
CREATE POLICY "Tenant view own [table]"
ON public.[table]
FOR SELECT
USING (auth.uid() = tenant_id);
```

#### Public Read
```sql
CREATE POLICY "Public read [table]"
ON public.[table]
FOR SELECT
USING (true);
```

---

## Storage Buckets

### `avatars`

User profile avatars.

**Access**:
- Public read
- Authenticated users can upload/update

**Path Structure**: `{user_id}/avatar.{ext}`

---

### `grievance-attachments`

Photos attached to grievances.

**Access**:
- Public read
- Authenticated users can upload

**Path Structure**: `{grievance_id}/{filename}`

---

### `payment-proofs`

Payment proof images from tenants.

**Access**:
- Authenticated read
- Tenants can upload

**Path Structure**: `{invoice_id}/{filename}`

---

### `documents`

Lease agreements and other documents.

**Access**:
- Authenticated read
- Authenticated users can upload

**Path Structure**: `{tenant_id}/{filename}`

---

## Functions & Triggers

### `handle_new_user()`

Automatically creates a profile when a new user signs up.

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    COALESCE((new.raw_user_meta_data->>'role')::public.user_role, 'guest')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

### `get_my_channel_ids()`

Returns channel IDs for the current user (used in RLS policies).

```sql
CREATE OR REPLACE FUNCTION public.get_my_channel_ids()
RETURNS SETOF UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT channel_id
  FROM public.channel_members
  WHERE user_id = auth.uid();
$$;
```

---

### `create_chat_channel()`

Creates a chat channel and adds members atomically.

```sql
CREATE OR REPLACE FUNCTION public.create_chat_channel(
  p_type text,
  p_name text,
  p_other_user_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_channel_id uuid;
  v_current_user_id uuid;
BEGIN
  v_current_user_id := auth.uid();

  INSERT INTO public.chat_channels (type, name)
  VALUES (p_type::channel_type, p_name)
  RETURNING id INTO v_channel_id;

  INSERT INTO public.channel_members (channel_id, user_id)
  VALUES (v_channel_id, v_current_user_id);

  IF p_other_user_id IS NOT NULL THEN
    INSERT INTO public.channel_members (channel_id, user_id)
    VALUES (v_channel_id, p_other_user_id);
  END IF;

  RETURN v_channel_id;
END;
$$;
```

---

## Indexes

Key indexes for performance:

- **Foreign Keys**: All foreign key columns are indexed
- **Status Fields**: `status`, `is_active`, `is_read` columns
- **Timestamps**: `created_at`, `due_date`, `reading_date`
- **User Lookups**: `tenant_id`, `owner_id`, `user_id`

---

## Migrations

Migrations are located in `supabase/migrations/` and applied in order:

1. `20251209120104_init_auth_schema.sql` - Initial auth and profiles
2. `20251209123645_strict_rls.sql` - Strict RLS policies
3. `20251209133753_create_grievances.sql` - Grievance system
4. `20251209142940_create_inventory.sql` - Room inventory
5. `20251209144641_create_properties.sql` - Properties table
6. `20251209145111_add_verification.sql` - Property verification
7. `20251209153629_update_rooms.sql` - Room enhancements
8. `20251209154129_create_tenant_assignments.sql` - Tenant assignments
9. `20251209154758_create_invoices.sql` - Invoice system
10. `20251209193000_dashboard_enhancements.sql` - Dashboard features
11. `20251210003000_documents_and_handover.sql` - Documents & checklists
12. `20251210004000_notifications_insert_policy.sql` - Notifications
13. `20251210121500_documents_bucket.sql` - Document storage
14. `20251210180000_grievance_attachments_bucket.sql` - Grievance storage
15. `20251210200000_profile_enhancements.sql` - Profile features
16. `20251210210000_chat_messages.sql` - Chat system
17. `20251211124000_fix_rls_recursion.sql` - RLS fixes
18. `20251211130000_create_chat_rpc.sql` - Chat RPC function
19. Additional migrations for expenses, vendors, work orders, etc.

### Applying Migrations

```bash
# Local development
npm run db:push

# Reset and reapply all
npm run db:reset
```

---

## Best Practices

1. **Always use RLS**: Never disable RLS on tables with user data
2. **Test policies**: Verify RLS policies with different user roles
3. **Use transactions**: For multi-table operations
4. **Index foreign keys**: All FK columns should be indexed
5. **Validate enums**: Use CHECK constraints for enum-like fields
6. **Cascade deletes**: Use `ON DELETE CASCADE` where appropriate
7. **Timestamp everything**: Include `created_at` on all tables

---

**Last Updated**: 2025-12-12
