export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    // Allows to automatically instantiate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    __InternalSupabase: {
        PostgrestVersion: "13.0.5"
    }
    public: {
        Tables: {
            announcements: {
                Row: {
                    content: string
                    created_at: string | null
                    created_by: string | null
                    id: string
                    is_active: boolean | null
                    title: string
                }
                Insert: {
                    content: string
                    created_at?: string | null
                    created_by?: string | null
                    id?: string
                    is_active?: boolean | null
                    title: string
                }
                Update: {
                    content?: string
                    created_at?: string | null
                    created_by?: string | null
                    id?: string
                    is_active?: boolean | null
                    title?: string
                }
                Relationships: []
            }
            channel_members: {
                Row: {
                    channel_id: string
                    joined_at: string | null
                    last_read_at: string | null
                    role: Database["public"]["Enums"]["channel_role"]
                    user_id: string
                }
                Insert: {
                    channel_id: string
                    joined_at?: string | null
                    last_read_at?: string | null
                    role?: Database["public"]["Enums"]["channel_role"]
                    user_id: string
                }
                Update: {
                    channel_id?: string
                    joined_at?: string | null
                    last_read_at?: string | null
                    role?: Database["public"]["Enums"]["channel_role"]
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "channel_members_channel_id_fkey"
                        columns: ["channel_id"]
                        isOneToOne: false
                        referencedRelation: "chat_channels"
                        referencedColumns: ["id"]
                    },
                ]
            }
            chat_channels: {
                Row: {
                    context_id: string | null
                    created_at: string | null
                    created_by: string | null
                    id: string
                    last_message_at: string | null
                    name: string | null
                    type: Database["public"]["Enums"]["channel_type"]
                }
                Insert: {
                    context_id?: string | null
                    created_at?: string | null
                    created_by?: string | null
                    id?: string
                    last_message_at?: string | null
                    name?: string | null
                    type: Database["public"]["Enums"]["channel_type"]
                }
                Update: {
                    context_id?: string | null
                    created_at?: string | null
                    created_by?: string | null
                    id?: string
                    last_message_at?: string | null
                    name?: string | null
                    type?: Database["public"]["Enums"]["channel_type"]
                }
                Relationships: []
            }
            documents: {
                Row: {
                    created_at: string | null
                    description: string | null
                    file_name: string
                    file_path: string
                    file_size: number
                    file_type: string
                    id: string
                    title: string
                    uploaded_by: string | null
                }
                Insert: {
                    created_at?: string | null
                    description?: string | null
                    file_name: string
                    file_path: string
                    file_size: number
                    file_type: string
                    id?: string
                    title: string
                    uploaded_by?: string | null
                }
                Update: {
                    created_at?: string | null
                    description?: string | null
                    file_name?: string
                    file_path?: string
                    file_size?: number
                    file_type?: string
                    id?: string
                    title?: string
                    uploaded_by?: string | null
                }
                Relationships: []
            }
            expenses: {
                Row: {
                    amount: number
                    category: string
                    created_at: string | null
                    date: string
                    description: string
                    id: string
                    logged_by: string | null
                    receipt_url: string | null
                }
                Insert: {
                    amount: number
                    category: string
                    created_at?: string | null
                    date: string
                    description: string
                    id?: string
                    logged_by?: string | null
                    receipt_url?: string | null
                }
                Update: {
                    amount?: number
                    category?: string
                    created_at?: string | null
                    date?: string
                    description?: string
                    id?: string
                    logged_by?: string | null
                    receipt_url?: string | null
                }
                Relationships: []
            }
            grievances: {
                Row: {
                    attachments: string[] | null
                    category: Database["public"]["Enums"]["grievance_category"] | null
                    created_at: string | null
                    description: string
                    id: string
                    status: Database["public"]["Enums"]["grievance_status"] | null
                    tenant_id: string | null
                    title: string
                    updated_at: string | null
                }
                Insert: {
                    attachments?: string[] | null
                    category?: Database["public"]["Enums"]["grievance_category"] | null
                    created_at?: string | null
                    description: string
                    id?: string
                    status?: Database["public"]["Enums"]["grievance_status"] | null
                    tenant_id?: string | null
                    title: string
                    updated_at?: string | null
                }
                Update: {
                    attachments?: string[] | null
                    category?: Database["public"]["Enums"]["grievance_category"] | null
                    created_at?: string | null
                    description?: string
                    id?: string
                    status?: Database["public"]["Enums"]["grievance_status"] | null
                    tenant_id?: string | null
                    title?: string
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "grievances_tenant_id_fkey"
                        columns: ["tenant_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            invoices: {
                Row: {
                    amount: number
                    created_at: string | null
                    description: string | null
                    due_date: string
                    id: string
                    invoice_number: string | null
                    paid_at: string | null
                    proof_image_url: string | null
                    status: Database["public"]["Enums"]["invoice_status"] | null
                    tenant_id: string | null
                    updated_at: string | null
                }
                Insert: {
                    amount: number
                    created_at?: string | null
                    description?: string | null
                    due_date: string
                    id?: string
                    invoice_number?: string | null
                    paid_at?: string | null
                    proof_image_url?: string | null
                    status?: Database["public"]["Enums"]["invoice_status"] | null
                    tenant_id?: string | null
                    updated_at?: string | null
                }
                Update: {
                    amount?: number
                    created_at?: string | null
                    description?: string | null
                    due_date?: string
                    id?: string
                    invoice_number?: string | null
                    paid_at?: string | null
                    proof_image_url?: string | null
                    status?: Database["public"]["Enums"]["invoice_status"] | null
                    tenant_id?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "invoices_tenant_id_fkey"
                        columns: ["tenant_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            message_attachments: {
                Row: {
                    created_at: string | null
                    file_path: string
                    file_size: number
                    file_type: string
                    id: string
                    message_id: string
                    public_url: string
                }
                Insert: {
                    created_at?: string | null
                    file_path: string
                    file_size: number
                    file_type: string
                    id?: string
                    message_id: string
                    public_url: string
                }
                Update: {
                    created_at?: string | null
                    file_path?: string
                    file_size?: number
                    file_type?: string
                    id?: string
                    message_id?: string
                    public_url?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "message_attachments_message_id_fkey"
                        columns: ["message_id"]
                        isOneToOne: false
                        referencedRelation: "messages"
                        referencedColumns: ["id"]
                    },
                ]
            }
            messages: {
                Row: {
                    channel_id: string | null
                    content: string
                    created_at: string | null
                    id: string
                    receiver_id: string | null
                    sender_id: string | null
                }
                Insert: {
                    channel_id?: string | null
                    content: string
                    created_at?: string | null
                    id?: string
                    receiver_id?: string | null
                    sender_id?: string | null
                }
                Update: {
                    channel_id?: string | null
                    content?: string
                    created_at?: string | null
                    id?: string
                    receiver_id?: string | null
                    sender_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "messages_channel_id_fkey"
                        columns: ["channel_id"]
                        isOneToOne: false
                        referencedRelation: "chat_channels"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "messages_receiver_id_fkey"
                        columns: ["receiver_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "messages_sender_id_fkey"
                        columns: ["sender_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            notifications: {
                Row: {
                    created_at: string | null
                    id: string
                    is_read: boolean | null
                    link_url: string | null
                    message: string
                    title: string
                    type: string
                    user_id: string | null
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    is_read?: boolean | null
                    link_url?: string | null
                    message: string
                    title: string
                    type: string
                    user_id?: string | null
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    is_read?: boolean | null
                    link_url?: string | null
                    message?: string
                    title?: string
                    type?: string
                    user_id?: string | null
                }
                Relationships: []
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    created_at: string
                    email: string
                    full_name: string | null
                    id: string
                    phone_number: string | null
                    role: Database["public"]["Enums"]["user_role"] | null
                    updated_at: string
                }
                Insert: {
                    avatar_url?: string | null
                    created_at?: string
                    email: string
                    full_name?: string | null
                    id: string
                    phone_number?: string | null
                    role?: Database["public"]["Enums"]["user_role"] | null
                    updated_at?: string
                }
                Update: {
                    avatar_url?: string | null
                    created_at?: string
                    email?: string
                    full_name?: string | null
                    id?: string
                    phone_number?: string | null
                    role?: Database["public"]["Enums"]["user_role"] | null
                    updated_at?: string
                }
                Relationships: []
            }
            room_handover_checklists: {
                Row: {
                    assignment_id: string | null
                    completed_at: string | null
                    id: string
                    is_completed: boolean | null
                    notes: string | null
                    type: string
                }
                Insert: {
                    assignment_id?: string | null
                    completed_at?: string | null
                    id?: string
                    is_completed?: boolean | null
                    notes?: string | null
                    type: string
                }
                Update: {
                    assignment_id?: string | null
                    completed_at?: string | null
                    id?: string
                    is_completed?: boolean | null
                    notes?: string | null
                    type?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "room_handover_checklists_assignment_id_fkey"
                        columns: ["assignment_id"]
                        isOneToOne: false
                        referencedRelation: "tenant_assignments"
                        referencedColumns: ["id"]
                    },
                ]
            }
            rooms: {
                Row: {
                    capacity: number | null
                    created_at: string | null
                    id: string
                    name: string
                    occupancy_status: Database["public"]["Enums"]["room_occupancy"] | null
                    price_per_month: number
                    updated_at: string | null
                }
                Insert: {
                    capacity?: number | null
                    created_at?: string | null
                    id?: string
                    name: string
                    occupancy_status?: Database["public"]["Enums"]["room_occupancy"] | null
                    price_per_month: number
                    updated_at?: string | null
                }
                Update: {
                    capacity?: number | null
                    created_at?: string | null
                    id?: string
                    name?: string
                    occupancy_status?: Database["public"]["Enums"]["room_occupancy"] | null
                    price_per_month?: number
                    updated_at?: string | null
                }
                Relationships: []
            }
            tenant_assignments: {
                Row: {
                    assign_date: string | null
                    created_at: string | null
                    end_date: string | null
                    id: string
                    is_active: boolean | null
                    room_id: string | null
                    tenant_id: string | null
                }
                Insert: {
                    assign_date?: string | null
                    created_at?: string | null
                    end_date?: string | null
                    id?: string
                    is_active?: boolean | null
                    room_id?: string | null
                    tenant_id?: string | null
                }
                Update: {
                    assign_date?: string | null
                    created_at?: string | null
                    end_date?: string | null
                    id?: string
                    is_active?: boolean | null
                    room_id?: string | null
                    tenant_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "tenant_assignments_room_id_fkey"
                        columns: ["room_id"]
                        isOneToOne: false
                        referencedRelation: "rooms"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "tenant_assignments_tenant_id_fkey"
                        columns: ["tenant_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            vendors: {
                Row: {
                    category: string
                    contact_email: string | null
                    contact_name: string | null
                    contact_phone: string
                    created_at: string | null
                    id: string
                    name: string
                    status: string | null
                }
                Insert: {
                    category: string
                    contact_email?: string | null
                    contact_name?: string | null
                    contact_phone: string
                    created_at?: string | null
                    id?: string
                    name: string
                    status?: string | null
                }
                Update: {
                    category?: string
                    contact_email?: string | null
                    contact_name?: string | null
                    contact_phone?: string
                    created_at?: string | null
                    id?: string
                    name?: string
                    status?: string | null
                }
                Relationships: []
            }
            work_orders: {
                Row: {
                    assigned_at: string | null
                    completed_at: string | null
                    created_at: string | null
                    description: string
                    id: string
                    location: string | null
                    priority: Database["public"]["Enums"]["work_order_priority"] | null
                    reported_by: string | null
                    status: Database["public"]["Enums"]["work_order_status"] | null
                    title: string
                    updated_at: string | null
                    vendor_id: string | null
                }
                Insert: {
                    assigned_at?: string | null
                    completed_at?: string | null
                    created_at?: string | null
                    description: string
                    id?: string
                    location?: string | null
                    priority?: Database["public"]["Enums"]["work_order_priority"] | null
                    reported_by?: string | null
                    status?: Database["public"]["Enums"]["work_order_status"] | null
                    title: string
                    updated_at?: string | null
                    vendor_id?: string | null
                }
                Update: {
                    assigned_at?: string | null
                    completed_at?: string | null
                    created_at?: string | null
                    description?: string
                    id?: string
                    location?: string | null
                    priority?: Database["public"]["Enums"]["work_order_priority"] | null
                    reported_by?: string | null
                    status?: Database["public"]["Enums"]["work_order_status"] | null
                    title?: string
                    updated_at?: string | null
                    vendor_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "work_orders_reported_by_fkey"
                        columns: ["reported_by"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "work_orders_vendor_id_fkey"
                        columns: ["vendor_id"]
                        isOneToOne: false
                        referencedRelation: "vendors"
                        referencedColumns: ["id"]
                    },
                ]
            }
            properties: {
                Row: {
                    id: string
                    owner_id: string
                    name: string
                    address: string
                    city: string
                    description: string | null
                    amenities: string[] | null
                    is_verified: boolean
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    owner_id: string
                    name: string
                    address: string
                    city: string
                    description?: string | null
                    amenities?: string[] | null
                    is_verified?: boolean
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    owner_id?: string
                    name?: string
                    address?: string
                    city?: string
                    description?: string | null
                    amenities?: string[] | null
                    is_verified?: boolean
                    created_at?: string | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            inventory_items: {
                Row: {
                    id: string
                    room_id: string | null
                    name: string
                    condition: Database["public"]["Enums"]["item_condition"]
                    last_checked: string
                }
                Insert: {
                    id?: string
                    room_id?: string | null
                    name: string
                    condition?: Database["public"]["Enums"]["item_condition"]
                    last_checked?: string
                }
                Update: {
                    id?: string
                    room_id?: string | null
                    name?: string
                    condition?: Database["public"]["Enums"]["item_condition"]
                    last_checked?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "inventory_items_room_id_fkey"
                        columns: ["room_id"]
                        isOneToOne: false
                        referencedRelation: "rooms"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            channel_role: "owner" | "admin" | "member"
            channel_type:
            | "direct"
            | "group"
            | "announcement"
            | "work_order"
            | "grievance"
            grievance_category: "wifi" | "cleaning" | "maintenance" | "other"
            grievance_status: "open" | "in_progress" | "resolved" | "rejected"
            invoice_status:
            | "unpaid"
            | "paid"
            | "overdue"
            | "cancelled"
            | "pending_verification"
            item_condition: "good" | "fair" | "poor" | "broken"
            room_occupancy: "vacant" | "occupied" | "maintenance"
            user_role: "owner" | "tenant" | "guest" | "admin"
            work_order_priority: "low" | "medium" | "high"
            work_order_status:
            | "open"
            | "in_progress"
            | "waiting_vendor"
            | "completed"
            | "cancelled"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

