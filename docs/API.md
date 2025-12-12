# API Documentation

This document describes all available Server Actions (API endpoints) in the Boarding House Management System.

## Table of Contents

- [Authentication](#authentication)
- [Room Management](#room-management)
- [Tenant Management](#tenant-management)
- [Property Management](#property-management)
- [Invoice Management](#invoice-management)
- [Grievance Management](#grievance-management)
- [Maintenance & Work Orders](#maintenance--work-orders)
- [Announcements](#announcements)
- [Expenses](#expenses)
- [Messages (Chat)](#messages-chat)
- [Profile Management](#profile-management)
- [Security](#security)
- [Notifications](#notifications)
- [Documents](#documents)
- [Meter Readings](#meter-readings)
- [Inquiries](#inquiries)

## Overview

All API interactions in this application use **Next.js Server Actions** instead of traditional REST endpoints. Server Actions are called directly from React components and provide type-safe, server-side data mutations.

### Authorization

All Server Actions check user authentication and role-based permissions:
- **Owner**: Full access to property management features
- **Tenant**: Access to their own data and tenant-specific features
- **Guest**: Public access only (property verification)

### Error Handling

All Server Actions return objects with either:
- `{ success: true }` - Operation succeeded
- `{ error: string }` - Operation failed with error message

### Data Validation

All inputs are validated using **Zod schemas** before processing.

---

## Authentication

**File**: `actions/auth.ts`

### `login(formData: FormData)`

Authenticate a user and redirect to their dashboard.

**Parameters**:
- `email` (string): User email
- `password` (string): User password (min 6 characters)

**Returns**: `{ error?: string }`

**Redirects**: To role-specific dashboard on success

**Example**:
```typescript
const formData = new FormData()
formData.append('email', 'user@example.com')
formData.append('password', 'password123')
const result = await login(formData)
```

### `signup(formData: FormData)`

Register a new user account.

**Parameters**:
- `email` (string): User email
- `password` (string): User password (min 6 characters)
- `full_name` (string): User's full name
- `role` (string): User role ('owner' | 'tenant' | 'guest')

**Returns**: `{ error?: string }`

**Redirects**: To role-specific dashboard on success

### `logout()`

Sign out the current user.

**Returns**: void

**Redirects**: To `/login`

---

## Room Management

**File**: `actions/room.ts`

### `createRoom(formData: FormData)`

Create a new room (Owner only).

**Parameters**:
- `name` (string): Room name/number
- `price` (number): Monthly rent price
- `capacity` (number): Maximum occupancy
- `property_id` (string, optional): Associated property ID

**Returns**: `{ success?: boolean, error?: string }`

**Authorization**: Owner only

**Revalidates**: `/owner/rooms`

### `updateRoom(id: string, formData: FormData)`

Update an existing room (Owner only).

**Parameters**:
- `id` (string): Room ID
- `name` (string, optional): New room name
- `price` (number, optional): New price
- `capacity` (number, optional): New capacity

**Returns**: `{ success?: boolean, error?: string }`

**Authorization**: Owner only

**Revalidates**: `/owner/rooms`

### `deleteRoom(id: string)`

Delete a room (Owner only).

**Parameters**:
- `id` (string): Room ID

**Returns**: `{ success?: boolean, error?: string }`

**Authorization**: Owner only

**Revalidates**: `/owner/rooms`

---

## Tenant Management

**File**: `actions/tenant.ts`

### `inviteTenant(formData: FormData)`

Invite a new tenant and create their account (Owner only).

**Parameters**:
- `email` (string): Tenant email
- `full_name` (string): Tenant full name
- `room_id` (string): Room to assign

**Returns**: `{ success?: boolean, error?: string, tempPassword?: string }`

**Authorization**: Owner only

**Side Effects**:
- Creates user account with temporary password
- Creates tenant profile
- Assigns tenant to room
- Updates room occupancy to 'occupied'

**Revalidates**: `/owner/tenants`, `/owner/rooms`

### `removeTenant(assignmentId: string, roomId: string)`

Remove a tenant from a room (Owner only).

**Parameters**:
- `assignmentId` (string): Assignment ID to end
- `roomId` (string): Room ID to vacate

**Returns**: `{ success?: boolean, error?: string }`

**Authorization**: Owner only

**Side Effects**:
- Ends tenant assignment
- Updates room occupancy to 'vacant'

**Revalidates**: `/owner/tenants`, `/owner/rooms`

---

## Property Management

**File**: `actions/property.ts`

### `createProperty(formData: FormData)`

Create a new property (Owner only).

**Parameters**:
- `name` (string): Property name
- `address` (string): Property address
- `description` (string, optional): Property description
- `is_verified` (boolean): Verification status

**Returns**: `{ success?: boolean, error?: string }`

**Authorization**: Owner only

**Revalidates**: `/owner/properties`

### `updateProperty(id: string, formData: FormData)`

Update property details (Owner only).

**Parameters**:
- `id` (string): Property ID
- `name` (string, optional): New property name
- `address` (string, optional): New address
- `description` (string, optional): New description
- `is_verified` (boolean, optional): New verification status

**Returns**: `{ success?: boolean, error?: string }`

**Authorization**: Owner only

**Revalidates**: `/owner/properties`

### `deleteProperty(id: string)`

Delete a property (Owner only).

**Parameters**:
- `id` (string): Property ID

**Returns**: `{ success?: boolean, error?: string }`

**Authorization**: Owner only

**Revalidates**: `/owner/properties`

---

## Invoice Management

**File**: `actions/invoice.ts`

### `createInvoice(formData: FormData)`

Create a new invoice for a tenant (Owner only).

**Parameters**:
- `tenant_id` (string): Tenant user ID
- `amount` (number): Invoice amount (must be > 0)
- `due_date` (string): Due date (ISO format)
- `description` (string): Invoice description

**Returns**: `{ success?: boolean, error?: string }`

**Authorization**: Owner only

**Revalidates**: `/owner/finance`

### `updateInvoiceStatus(invoiceId: string, status: string)`

Update invoice payment status (Owner only).

**Parameters**:
- `invoiceId` (string): Invoice ID
- `status` ('paid' | 'unpaid' | 'cancelled' | 'pending_verification'): New status

**Returns**: `{ success?: boolean, error?: string }`

**Authorization**: Owner only

**Revalidates**: `/owner/finance`

### `uploadPaymentProof(invoiceId: string, file: File)`

Upload payment proof image (Tenant only).

**Parameters**:
- `invoiceId` (string): Invoice ID
- `file` (File): Payment proof image

**Returns**: `{ success?: boolean, error?: string }`

**Authorization**: Tenant only (must own the invoice)

**Side Effects**:
- Uploads image to `payment-proofs` storage bucket
- Updates invoice status to 'pending_verification'
- Stores image URL in invoice record

**Revalidates**: `/tenant/dashboard`

### `verifyPayment(invoiceId: string, approved: boolean)`

Verify or reject tenant payment proof (Owner only).

**Parameters**:
- `invoiceId` (string): Invoice ID
- `approved` (boolean): Whether to approve the payment

**Returns**: `{ success?: boolean, error?: string }`

**Authorization**: Owner only

**Side Effects**:
- Updates invoice status to 'paid' (if approved) or 'unpaid' (if rejected)
- Creates notification for tenant

**Revalidates**: `/owner/finance`

---

## Grievance Management

**File**: `actions/grievance.ts`

### `createGrievance(formData: FormData)`

Submit a new grievance/issue (Tenant only).

**Parameters**:
- `category` ('wifi' | 'cleaning' | 'maintenance' | 'other'): Issue category
- `description` (string): Issue description
- `photo` (File, optional): Photo attachment

**Returns**: `{ success?: boolean, error?: string }`

**Authorization**: Tenant only

**Side Effects**:
- Uploads photo to `grievance-attachments` bucket (if provided)
- Creates grievance with status 'open'
- Assigns current user as tenant_id

**Revalidates**: `/tenant/issues`, `/owner/dashboard`

### `updateGrievanceStatus(id: string, status: string)`

Update grievance status (Owner only).

**Parameters**:
- `id` (string): Grievance ID
- `status` ('open' | 'in_progress' | 'resolved' | 'rejected'): New status

**Returns**: `{ success?: boolean, error?: string }`

**Authorization**: Owner only

**Revalidates**: `/owner/dashboard`, `/tenant/issues`

---

## Maintenance & Work Orders

**File**: `actions/maintenance.ts`

### `createVendor(formData: FormData)`

Add a new vendor to the database (Owner only).

**Parameters**:
- `name` (string): Vendor name
- `phone` (string, optional): Contact phone
- `email` (string, optional): Contact email
- `services` (string, optional): Services provided
- `notes` (string, optional): Additional notes

**Returns**: `{ success?: boolean, error?: string }`

**Authorization**: Owner only

**Revalidates**: `/owner/maintenance`

### `createWorkOrder(formData: FormData)`

Create a work order from a grievance (Owner only).

**Parameters**:
- `grievance_id` (string): Associated grievance ID
- `vendor_id` (string, optional): Assigned vendor ID
- `scheduled_date` (string, optional): Scheduled date
- `estimated_cost` (number, optional): Estimated cost
- `notes` (string, optional): Work order notes

**Returns**: `{ success?: boolean, error?: string }`

**Authorization**: Owner only

**Revalidates**: `/owner/maintenance`

### `updateWorkOrderStatus(id: string, status: string)`

Update work order status (Owner only).

**Parameters**:
- `id` (string): Work order ID
- `status` ('open' | 'in_progress' | 'waiting_vendor' | 'completed' | 'cancelled'): New status

**Returns**: `{ success?: boolean, error?: string }`

**Authorization**: Owner only

**Revalidates**: `/owner/maintenance`

---

## Announcements

**File**: `actions/announcement.ts`

### `createAnnouncement(formData: FormData)`

Create a new announcement (Owner only).

**Parameters**:
- `title` (string): Announcement title
- `content` (string): Announcement content

**Returns**: `{ success?: boolean, error?: string }`

**Authorization**: Owner only

**Side Effects**:
- Creates announcement with `is_active: true`
- Sets `created_by` to current user

**Revalidates**: `/owner/dashboard`, `/tenant/dashboard`

---

## Expenses

**File**: `actions/expense.ts`

### `createExpense(formData: FormData)`

Record a new expense (Owner only).

**Parameters**:
- `category` (string): Expense category
- `amount` (number): Expense amount
- `description` (string): Expense description
- `expense_date` (string, optional): Date of expense (defaults to now)

**Returns**: `{ success?: boolean, error?: string }`

**Authorization**: Owner only

**Revalidates**: `/owner/dashboard`, `/owner/finance`

### `deleteExpense(id: string)`

Delete an expense record (Owner only).

**Parameters**:
- `id` (string): Expense ID

**Returns**: `{ success?: boolean, error?: string }`

**Authorization**: Owner only

**Revalidates**: `/owner/dashboard`, `/owner/finance`

---

## Messages (Chat)

**File**: `actions/messages.ts`

### `sendMessage(formData: FormData)`

Send a chat message (Authenticated users).

**Parameters**:
- `channel_id` (string): Chat channel ID
- `content` (string): Message content

**Returns**: `{ success?: boolean, error?: string }`

**Authorization**: Authenticated users (must be channel member)

**Side Effects**:
- Creates message with sender_id set to current user
- Real-time update via Supabase Realtime

### `createDirectChannel(otherUserId: string)`

Create a direct message channel with another user.

**Parameters**:
- `otherUserId` (string): Other user's ID

**Returns**: `{ success?: boolean, error?: string, channelId?: string }`

**Authorization**: Authenticated users

**Side Effects**:
- Creates new channel if doesn't exist
- Adds both users as channel members

---

## Profile Management

**File**: `actions/profile.ts`

### `updateProfile(formData: FormData)`

Update user profile (Authenticated users).

**Parameters**:
- `full_name` (string): User's full name (min 2 characters)
- `phone` (string, optional): Phone number
- `avatar_url` (string, optional): Avatar image URL
- `preferences` (string, optional): JSON preferences

**Returns**: `{ success?: boolean, error?: string }`

**Authorization**: Authenticated users (own profile only)

**Revalidates**: `/owner/settings`, `/tenant/profile`

### `uploadAvatar(file: File)`

Upload user avatar image.

**Parameters**:
- `file` (File): Avatar image file

**Returns**: `{ success?: boolean, error?: string, url?: string }`

**Authorization**: Authenticated users

**Side Effects**:
- Uploads to `avatars` storage bucket
- Returns public URL

---

## Security

**File**: `actions/security.ts`

### `changePassword(formData: FormData)`

Change user password (Authenticated users).

**Parameters**:
- `password` (string): New password (min 6 characters)
- `confirmPassword` (string): Password confirmation

**Returns**: `{ success?: boolean, error?: string }`

**Authorization**: Authenticated users

**Validation**: Passwords must match

---

## Notifications

**File**: `actions/notifications.ts` (if exists)

### `markNotificationAsRead(id: string)`

Mark a notification as read.

**Parameters**:
- `id` (string): Notification ID

**Returns**: `{ success?: boolean, error?: string }`

**Authorization**: Authenticated users (own notifications only)

---

## Documents

**File**: `actions/owner-documents.ts`

### `uploadDocument(formData: FormData)`

Upload a document (lease, rules, etc.).

**Parameters**:
- `tenant_id` (string, optional): Associated tenant ID
- `title` (string): Document title
- `type` ('lease' | 'other'): Document type
- `file` (File): Document file

**Returns**: `{ success?: boolean, error?: string }`

**Authorization**: Owner only

**Side Effects**:
- Uploads to `documents` storage bucket
- Creates document record

---

## Meter Readings

**File**: `actions/meter-readings.ts`

### `createMeterReading(formData: FormData)`

Record utility meter readings (Owner only).

**Parameters**:
- `room_id` (string): Room ID
- `reading_date` (string): Reading date
- `electricity_reading` (number, optional): Electricity meter reading
- `water_reading` (number, optional): Water meter reading

**Returns**: `{ success?: boolean, error?: string }`

**Authorization**: Owner only

**Revalidates**: `/owner/finance`

---

## Inquiries

**File**: `actions/inquiry.ts`

### `submitInquiry(formData: FormData)`

Submit a guest inquiry (Public).

**Parameters**:
- `property_id` (string): Property ID
- `name` (string): Inquirer name
- `email` (string): Inquirer email
- `phone` (string, optional): Contact phone
- `message` (string): Inquiry message

**Returns**: `{ success?: boolean, error?: string }`

**Authorization**: Public (no auth required)

**Side Effects**:
- Creates inquiry record
- Can trigger email notification to owner

---

## Data Access Layer

For complex queries, use the Data Access Layer instead of direct Supabase calls:

**File**: `lib/data/owner.ts`
- `getOwnerDashboardData()` - Fetch all owner dashboard data
- `getOwnerFinanceMetrics()` - Get financial metrics
- `getOwnerOccupancyMetrics()` - Get occupancy statistics

**File**: `lib/data/tenant.ts`
- `getTenantDashboardData()` - Fetch all tenant dashboard data
- `getTenantGrievances(userId)` - Get tenant's grievances
- `getTenantInvoices(userId)` - Get tenant's invoices

---

## Real-time Subscriptions

The application uses Supabase Realtime for live updates:

### Grievances
```typescript
const channel = supabase
  .channel('grievances')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'grievances'
  }, (payload) => {
    // Handle real-time update
  })
  .subscribe()
```

### Messages
```typescript
const channel = supabase
  .channel(`channel:${channelId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `channel_id=eq.${channelId}`
  }, (payload) => {
    // Handle new message
  })
  .subscribe()
```

---

## Error Codes

Common error messages returned by Server Actions:

- `"Unauthorized"` - User not authenticated or lacks permission
- `"Invalid input"` - Validation failed
- `"Not found"` - Resource doesn't exist
- `"Failed to [action]"` - Database operation failed

---

## Rate Limiting

Currently, there is no rate limiting implemented. For production, consider:
- Implementing rate limiting middleware
- Using Vercel's built-in rate limiting
- Adding Supabase Edge Functions with rate limits

---

## Testing Server Actions

Example test pattern:

```typescript
import { createRoom } from '@/actions/room'

// Mock FormData
const formData = new FormData()
formData.append('name', 'Room 101')
formData.append('price', '5000')
formData.append('capacity', '2')

// Call action
const result = await createRoom(formData)

// Assert
expect(result.success).toBe(true)
```

---

**Last Updated**: 2025-12-12

