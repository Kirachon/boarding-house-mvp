# Feature Documentation

This document provides detailed information about each feature in the Boarding House Management System.

## Table of Contents

- [Authentication & Authorization](#authentication--authorization)
- [Owner Features](#owner-features)
- [Tenant Features](#tenant-features)
- [Guest Features](#guest-features)
- [Shared Features](#shared-features)

---

## Authentication & Authorization

### User Roles

The system supports four user roles:

1. **Owner**: Property owner with full management access
2. **Tenant**: Boarder/renter with limited access to their own data
3. **Guest**: Public visitor with read-only access to verification portal
4. **Admin**: System administrator (future use)

### Sign Up

**Location**: `/login` (Sign Up tab)

**Features**:
- Email and password registration
- Role selection (Owner or Tenant)
- Full name input
- Automatic profile creation
- Redirect to role-specific dashboard

**Implementation**:
- Server Action: `signup()` in `actions/auth.ts`
- Validation: Zod schema (email, password min 6 chars)
- Database trigger creates profile automatically

### Login

**Location**: `/login`

**Features**:
- Email and password authentication
- Role-based dashboard redirect
- Session management via Supabase Auth
- Remember me functionality

**Implementation**:
- Server Action: `login()` in `actions/auth.ts`
- JWT-based authentication
- Secure cookie storage

### Logout

**Features**:
- Clear session
- Redirect to login page
- Revoke access tokens

**Implementation**:
- Server Action: `logout()` in `actions/auth.ts`

---

## Owner Features

### Dashboard

**Location**: `/owner/dashboard`

**Features**:
- **Metrics Overview**: Total rooms, occupancy rate, revenue, expenses
- **Grievance Inbox**: Real-time list of tenant issues
- **Room Health Grid**: Visual status of all rooms
- **Finance Overview**: Revenue vs expenses chart
- **Quick Actions**: Shortcuts to common tasks
- **Announcements Widget**: Recent announcements
- **Lease Expiry Alerts**: Upcoming lease expirations
- **Activity Timeline**: Recent system activity
- **Calendar Widget**: Important dates
- **Occupancy Sparkline**: Occupancy trend visualization

**Implementation**:
- Data fetching: `getOwnerDashboardData()` in `lib/data/owner.ts`
- Real-time updates: Supabase Realtime subscriptions
- Components: Various in `components/features/owner/`

### Room Management

**Location**: `/owner/rooms`

**Features**:
- **Create Room**: Add new rooms with name, price, capacity
- **Edit Room**: Update room details
- **Delete Room**: Remove rooms (if vacant)
- **View Occupancy**: See current occupancy status
- **Room List**: Sortable, filterable table of all rooms

**Implementation**:
- Server Actions: `createRoom()`, `updateRoom()`, `deleteRoom()` in `actions/room.ts`
- Component: `RoomDataTable` in `components/features/owner/`
- Dialog: `RoomDialog` for create/edit

**Usage**:
1. Click "Add Room" button
2. Fill in room details (name, price, capacity)
3. Submit to create
4. Edit by clicking on room row
5. Delete via action menu (only if vacant)

### Tenant Management

**Location**: `/owner/tenants`

**Features**:
- **Invite Tenant**: Create tenant account and assign to room
- **View Active Tenants**: List of current tenants
- **View History**: Past tenant assignments
- **Remove Tenant**: End tenant assignment and vacate room
- **Handover Checklists**: Track move-in/move-out checklists

**Implementation**:
- Server Actions: `inviteTenant()`, `removeTenant()` in `actions/tenant.ts`
- Component: `TenantList` in `components/features/owner/`
- Dialog: `TenantDialog` for invitations

**Usage**:
1. Click "Invite Tenant"
2. Enter email, full name, select room
3. System creates account with temporary password
4. Tenant receives credentials (displayed once)
5. Tenant is automatically assigned to room

### Financial Management

**Location**: `/owner/finance`

**Features**:
- **Invoice Creation**: Generate invoices for tenants
- **Payment Tracking**: Monitor payment status
- **Payment Verification**: Approve/reject payment proofs
- **Expense Tracking**: Record operational expenses
- **P/L Summary**: Profit and loss overview
- **Meter Readings**: Track utility consumption
- **Financial Charts**: Visual revenue and expense trends

**Implementation**:
- Server Actions: `createInvoice()`, `updateInvoiceStatus()`, `verifyPayment()` in `actions/invoice.ts`
- Server Actions: `createExpense()`, `deleteExpense()` in `actions/expense.ts`
- Components: `FinanceOverview`, `InvoiceList`, `ExpenseList`

**Usage - Create Invoice**:
1. Navigate to Finance page
2. Click "Create Invoice"
3. Select tenant, enter amount, due date, description
4. Submit to create
5. Tenant sees invoice in their dashboard

**Usage - Verify Payment**:
1. Tenant uploads payment proof
2. Invoice status changes to "Pending Verification"
3. Owner reviews proof image
4. Owner approves or rejects
5. Status updates to "Paid" or "Unpaid"

### Maintenance & Work Orders

**Location**: `/owner/maintenance`

**Features**:
- **Grievance Board**: View all tenant issues
- **Work Order Creation**: Convert grievances to work orders
- **Vendor Management**: Maintain vendor database
- **Status Tracking**: Update work order status
- **Cost Tracking**: Record estimated and actual costs
- **Scheduling**: Set scheduled dates for work

**Implementation**:
- Server Actions: `createWorkOrder()`, `updateWorkOrderStatus()` in `actions/maintenance.ts`
- Server Actions: `createVendor()` in `actions/maintenance.ts`
- Component: `MaintenanceBoard` in `components/features/owner/`

**Usage**:
1. View grievances in maintenance board
2. Click "Create Work Order" on a grievance
3. Assign vendor, set schedule, estimate cost
4. Update status as work progresses
5. Record actual cost when completed

### Property Management

**Location**: `/owner/properties`

**Features**:
- **Create Property**: Add new properties
- **Edit Property**: Update property details
- **Delete Property**: Remove properties
- **Verification Badge**: Mark properties as verified
- **Public URL**: Generate verification portal link

**Implementation**:
- Server Actions: `createProperty()`, `updateProperty()`, `deleteProperty()` in `actions/property.ts`
- Component: `PropertyList` in `components/features/owner/`

**Usage**:
1. Click "Add Property"
2. Enter name, address, description
3. Toggle verification status
4. Submit to create
5. Share verification URL with potential tenants

### Documents & Rules

**Location**: `/owner/documents`

**Features**:
- **Upload Documents**: Store lease agreements
- **House Rules**: Create and publish property rules
- **Document Management**: View and delete documents

**Implementation**:
- Server Actions: `uploadDocument()` in `actions/owner-documents.ts`
- Storage: Supabase Storage `documents` bucket

### Announcements

**Features**:
- **Create Announcements**: Broadcast messages to all tenants
- **View Announcements**: See all announcements
- **Active/Inactive**: Toggle announcement visibility

**Implementation**:
- Server Action: `createAnnouncement()` in `actions/announcement.ts`
- Component: `AnnouncementWidget` in `components/features/owner/`

**Usage**:
1. Click "New Announcement"
2. Enter title and content
3. Submit to publish
4. All tenants see announcement in their dashboard

---

## Tenant Features

### Dashboard

**Location**: `/tenant/dashboard`

**Features**:
- **Hero Section**: Welcome message, next bill date, open issues count
- **Bento Grid Layout**: Modular dashboard with key information
- **Quick Actions**: Fast access to common tasks
- **Bills Overview**: Upcoming and overdue invoices
- **Issues Tracker**: Active grievances and work orders
- **Room Inventory**: Items in tenant's room
- **Announcements**: Property announcements
- **House Rules**: Access to property rules
- **Lease Documents**: View lease agreement
- **Activity Timeline**: Recent activity

**Implementation**:
- Data fetching: `getTenantDashboardData()` in `lib/data/tenant.ts`
- Component: `TenantDashboardHero` and various widgets
- Real-time updates: Supabase Realtime

### Issue Reporting (Grievances)

**Location**: `/tenant/issues`

**Features**:
- **Submit Issue**: Report problems with category selection
- **Photo Upload**: Attach images to issues
- **Real-time Status**: "Pizza tracker" style progress updates
- **Issue History**: View all past and current issues
- **Category Filtering**: Filter by wifi, cleaning, maintenance, other

**Implementation**:
- Server Action: `createGrievance()` in `actions/grievance.ts`
- Component: `GrievanceForm` in `components/features/tenant/`
- Storage: `grievance-attachments` bucket

**Usage**:
1. Click "Report Issue"
2. Select category (wifi, cleaning, maintenance, other)
3. Enter description
4. Optionally attach photo
5. Submit
6. Track status in real-time (open → in_progress → resolved)

**Status Flow**:
- **Open**: Issue submitted, awaiting owner review
- **In Progress**: Owner is working on it
- **Resolved**: Issue fixed
- **Rejected**: Issue not actionable

### Bills & Payments

**Location**: `/tenant/bills`

**Features**:
- **View Invoices**: See all bills (paid, unpaid, pending)
- **Payment Proof Upload**: Submit payment verification
- **Payment History**: Track payment status
- **Due Date Alerts**: Visual indicators for overdue bills
- **Invoice Details**: View amount, due date, description

**Implementation**:
- Server Action: `uploadPaymentProof()` in `actions/invoice.ts`
- Component: `InvoiceList` in `components/features/tenant/`
- Storage: `payment-proofs` bucket

**Usage**:
1. View invoice in Bills page
2. Make payment via external method
3. Click "Upload Proof"
4. Select payment screenshot/receipt
5. Submit for verification
6. Wait for owner approval
7. Status updates to "Paid" when approved

### Room & Inventory

**Location**: `/tenant/room`

**Features**:
- **View Room Items**: See all items in room
- **Item Condition**: Check condition status
- **Handover Checklists**: Complete move-in/move-out inspections
- **Report Damage**: Link to grievance system for damaged items

**Implementation**:
- Component: `TenantRoomInventory` in `components/features/tenant/`
- Server Action: `completeHandoverChecklist()` in `actions/tenant-checklist.ts`

**Usage - Move-in Checklist**:
1. New tenant logs in
2. Sees pending move-in checklist
3. Reviews room inventory
4. Confirms all items present and condition
5. Completes checklist
6. Checklist saved for future reference

**Usage - Move-out Checklist**:
1. Tenant ending lease
2. Completes move-out checklist
3. Notes any damages or missing items
4. Owner reviews checklist
5. Determines security deposit deductions

### Profile Management

**Location**: `/tenant/profile`

**Features**:
- **Edit Profile**: Update name, phone, avatar
- **Avatar Upload**: Change profile picture
- **Preferences**: Customize settings
- **View Lease Info**: See lease start/end dates
- **Room Assignment**: View current room

**Implementation**:
- Server Action: `updateProfile()` in `actions/profile.ts`
- Server Action: `uploadAvatar()` in `actions/profile.ts`
- Storage: `avatars` bucket

**Usage**:
1. Navigate to Profile
2. Click "Edit Profile"
3. Update information
4. Upload new avatar (optional)
5. Save changes

### Notifications

**Location**: `/tenant/notifications`

**Features**:
- **View Notifications**: See all system notifications
- **Mark as Read**: Clear notification badges
- **Notification Types**: Invoice due, grievance updates, announcements
- **Real-time Updates**: Instant notification delivery

**Implementation**:
- Component: `NotificationList` in `components/features/tenant/`
- Real-time: Supabase Realtime subscriptions

---

## Guest Features

### Property Verification Portal

**Location**: `/verify/[property-id]`

**Features**:
- **Verification Badge**: See if property is verified
- **Property Information**: Name, address, description
- **Room Availability**: Current vacancy count
- **Inquiry Form**: Submit questions to owner
- **Trust Indicators**: Visual trust badges

**Implementation**:
- Page: `app/verify/[id]/page.tsx`
- Server Action: `submitInquiry()` in `actions/inquiry.ts`
- Public access (no authentication required)

**Usage**:
1. Owner shares verification URL
2. Guest visits URL
3. Sees property details and verification status
4. Checks room availability
5. Submits inquiry if interested
6. Owner receives inquiry notification

**Trust Badges**:
- **Verified**: Property has been verified by platform
- **Registered**: Property is registered but not verified
- **Available Rooms**: Shows current vacancy count

---

## Shared Features

### Real-time Chat

**Location**: Chat widget (bottom-right corner)

**Features**:
- **Direct Messaging**: One-on-one chat between owner and tenants
- **Real-time Updates**: Instant message delivery
- **Unread Indicators**: Badge showing unread count
- **Message History**: Persistent chat history
- **User Presence**: See who's online (future)

**Implementation**:
- Server Action: `sendMessage()` in `actions/messages.ts`
- Component: `ChatWidget` in `components/shared/`
- Real-time: Supabase Realtime subscriptions

**Usage**:
1. Click chat icon in bottom-right
2. Select user to chat with (or view existing chats)
3. Type message and send
4. Receive real-time responses
5. Chat history persists across sessions

**Channel Types**:
- **Direct**: One-on-one between owner and tenant
- **Group**: Multiple users (future feature)

### Theme Toggle

**Features**:
- **Light Mode**: Default light theme
- **Dark Mode**: Dark theme for low-light environments
- **System**: Follow system preference
- **Persistent**: Saves preference

**Implementation**:
- Provider: `ThemeProvider` in `components/providers/`
- Library: `next-themes`

**Usage**:
1. Click theme toggle in navigation
2. Select light, dark, or system
3. Theme changes instantly
4. Preference saved to localStorage

### Notifications System

**Features**:
- **Toast Notifications**: Temporary success/error messages
- **Persistent Notifications**: Stored in database
- **Real-time Delivery**: Instant notification push
- **Notification Center**: View all notifications
- **Mark as Read**: Clear notifications

**Implementation**:
- Toast: `sonner` library
- Database: `notifications` table
- Real-time: Supabase Realtime

**Notification Types**:
- **Invoice Due**: Payment reminder
- **Grievance Update**: Status change notification
- **Payment Verified**: Payment approval notification
- **Announcement**: New announcement posted
- **Work Order**: Maintenance update

### Search & Filtering

**Features**:
- **Search**: Find items by keyword
- **Filter**: Filter by status, category, date
- **Sort**: Sort by various columns
- **Pagination**: Navigate large datasets

**Implementation**:
- Client-side filtering for small datasets
- Server-side filtering for large datasets
- URL query parameters for state persistence

---

## Feature Roadmap

### Planned Features

#### Phase 2 (Post-MVP)
- **Advanced Analytics**: Trends and forecasting
- **Automated Notifications**: SMS/Email alerts
- **Asset Depreciation**: Track item lifecycle
- **Recurring Invoices**: Automatic monthly billing
- **Payment Integration**: Online payment processing
- **Multi-language Support**: Internationalization

#### Phase 3 (Future)
- **Smart Building Integration**: IoT meter reading
- **Multi-Property Support**: Manage multiple properties
- **Community Features**: Events and social features
- **Mobile Apps**: Native iOS/Android apps
- **Advanced Reporting**: Custom reports and exports
- **API Access**: Third-party integrations

---

## Feature Access Matrix

| Feature | Owner | Tenant | Guest |
|---------|-------|--------|-------|
| Dashboard | ✅ | ✅ | ❌ |
| Room Management | ✅ | View Only | ❌ |
| Tenant Management | ✅ | ❌ | ❌ |
| Financial Management | ✅ | View Own | ❌ |
| Maintenance | ✅ | View Own | ❌ |
| Property Management | ✅ | ❌ | ❌ |
| Issue Reporting | ❌ | ✅ | ❌ |
| Bills & Payments | View All | View Own | ❌ |
| Room Inventory | View All | View Own | ❌ |
| Profile Management | ✅ | ✅ | ❌ |
| Notifications | ✅ | ✅ | ❌ |
| Chat | ✅ | ✅ | ❌ |
| Verification Portal | ❌ | ❌ | ✅ |
| Inquiry Submission | ❌ | ❌ | ✅ |

---

## Feature Implementation Status

### Completed Features ✅

- [x] Authentication & Authorization
- [x] Owner Dashboard
- [x] Room Management
- [x] Tenant Management
- [x] Financial Management
- [x] Maintenance & Work Orders
- [x] Property Management
- [x] Issue Reporting (Grievances)
- [x] Bills & Payments
- [x] Room Inventory
- [x] Profile Management
- [x] Notifications
- [x] Real-time Chat
- [x] Verification Portal
- [x] Announcements
- [x] Documents & Rules
- [x] Handover Checklists
- [x] Meter Readings
- [x] Theme Toggle

### In Progress 🚧

- [ ] Advanced Analytics
- [ ] Automated Email Notifications
- [ ] Payment Gateway Integration

### Planned 📋

- [ ] Multi-property Support
- [ ] Mobile Apps
- [ ] Community Features
- [ ] Smart Building Integration

---

**Last Updated**: 2025-12-12
