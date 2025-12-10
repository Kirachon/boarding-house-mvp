# Epic 8: Community & Personalization

**Status:** Draft  
**Focus:** Enhancing tenant engagement and owner operations through real-time communication and self-service profile management.

---

## 8.1 Real-time Chat System ("The Concierge")

### Core Features
1.  **Direct Messaging:**
    *   Tenant ↔ Owner 1-on-1 private chat.
    *   Context-aware: Link chat to specific Work Orders or Grievances.
2.  **Broadcast Channels:**
    *   "Building Announcements" (One-way: Owner → All Tenants).
    *   "General Lobby" (Optional: Community chat, opt-in).
3.  **Technical Stack:**
    *   **Database:** `messages` table (sender_id, receiver_id, content, attachments).
    *   **Real-time:** Supabase Realtime (Postgres Changes) for instant delivery.
    *   **UI:** Fixed "Chat Bubble" widget or dedicated `/chat` page.

### Implementation Checklist
- [ ] Create `messages` table with RLS policies.
- [ ] Build `ChatWindow` component with optimistic UI.
- [ ] Implement `sendMessage` server action.
- [ ] Add unread message counters/notifications.

---

## 8.2 User Profile Management ("My Identity")

### Core Features
1.  **Avatar Customization:**
    *   Upload profile pictures (Supabase Storage: `avatars`).
    *   Initials fallback (already in UI, now dynamic).
2.  **Personal Details:**
    *   Update email, phone number, and emergency contacts.
    *   Change password (via Supabase Auth).
3.  **Preferences:**
    *   Notification settings (Email vs. In-app).
    *   Dark/Light mode persistence (save to DB, not just local storage).

### Implementation Checklist
- [ ] Create `avatars` storage bucket.
- [ ] Update `profiles` table for new fields.
- [ ] Build `ProfileSettings` page (`/settings`).
- [ ] Implement `updateProfile` server action.
