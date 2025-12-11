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
                    id: string
                    last_message_at: string | null
                    metadata: Json | null
                    name: string | null
                    type: Database["public"]["Enums"]["channel_type"]
                }
                Insert: {
                    context_id?: string | null
                    created_at?: string | null
                    id?: string
                    last_message_at?: string | null
                    metadata?: Json | null
                    name?: string | null
                    type?: Database["public"]["Enums"]["channel_type"]
                }
                Update: {
                    context_id?: string | null
                    created_at?: string | null
                    id?: string
                    last_message_at?: string | null
                    metadata?: Json | null
                    name?: string | null
                    type?: Database["public"]["Enums"]["channel_type"]
                }
                Relationships: []
            }
            grievance_attachments: {
                Row: {
                    created_at: string | null
                    file_name: string
                    file_path: string
                    file_size: number
                    file_type: string
                    grievance_id: string
                    id: string
                }
                Insert: {
                    created_at?: string | null
                    file_name: string
                    file_path: string
                    file_size: number
                    file_type: string
                    grievance_id: string
                    id?: string
                }
                Update: {
                    created_at?: string | null
                    file_name?: string
                    file_path?: string
                    file_size?: number
                    file_type?: string
                    grievance_id?: string
                    id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "grievance_attachments_grievance_id_fkey"
                        columns: ["grievance_id"]
                        isOneToOne: false
                        referencedRelation: "grievances"
                        referencedColumns: ["id"]
                    },
                ]
            }
            grievances: {
                Row: {
                    category: Database["public"]["Enums"]["grievance_category"]
                    created_at: string | null
                    description: string
                    id: string
                    status: Database["public"]["Enums"]["grievance_status"]
                    tenant_id: string
                    updated_at: string | null
                }
                Insert: {
                    category: Database["public"]["Enums"]["grievance_category"]
                    created_at?: string | null
                    description: string
                    id?: string
                    status?: Database["public"]["Enums"]["grievance_status"]
                    tenant_id: string
                    updated_at?: string | null
                }
                Update: {
                    category?: Database["public"]["Enums"]["grievance_category"]
                    created_at?: string | null
                    description?: string
                    id?: string
                    status?: Database["public"]["Enums"]["grievance_status"]
                    tenant_id?: string
                    updated_at?: string | null
                }
                Relationships: []
            }
            inventory_items: {
                Row: {
                    condition: Database["public"]["Enums"]["item_condition"]
                    created_at: string | null
                    id: string
                    name: string
                    quantity: number
                }
                Insert: {
                    condition: Database["public"]["Enums"]["item_condition"]
                    created_at?: string | null
                    id?: string
                    name: string
                    quantity?: number
                }
                Update: {
                    condition?: Database["public"]["Enums"]["item_condition"]
                    created_at?: string | null
                    id?: string
                    name?: string
                    quantity?: number
                }
                Relationships: []
            }
            invoices: {
                Row: {
                    amount: number
                    created_at: string | null
                    due_date: string
                    id: string
                    status: Database["public"]["Enums"]["invoice_status"]
                    tenant_id: string
                }
                Insert: {
                    amount: number
                    created_at?: string | null
                    due_date: string
                    id?: string
                    status?: Database["public"]["Enums"]["invoice_status"]
                    tenant_id: string
                }
                Update: {
                    amount?: number
                    created_at?: string | null
                    due_date?: string
                    id?: string
                    status?: Database["public"]["Enums"]["invoice_status"]
                    tenant_id?: string
                }
                Relationships: []
            }
            message_attachments: {
                Row: {
                    created_at: string | null
                    file_path: string
                    file_size: number
                    file_type: string
                    id: string
                    message_id: string | null
                }
                Insert: {
                    created_at?: string | null
                    file_path: string
                    file_size: number
                    file_type: string
                    id?: string
                    message_id?: string | null
                }
                Update: {
                    created_at?: string | null
                    file_path?: string
                    file_size?: number
                    file_type?: string
                    id?: string
                    message_id?: string | null
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
                    read_at: string | null
                    receiver_id: string | null
                    sender_id: string
                }
                Insert: {
                    channel_id?: string | null
                    content: string
                    created_at?: string | null
                    id?: string
                    read_at?: string | null
                    receiver_id?: string | null
                    sender_id: string
                }
                Update: {
                    channel_id?: string | null
                    content?: string
                    created_at?: string | null
                    id?: string
                    read_at?: string | null
                    receiver_id?: string | null
                    sender_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "messages_channel_id_fkey"
                        columns: ["channel_id"]
                        isOneToOne: false
                        referencedRelation: "chat_channels"
                        referencedColumns: ["id"]
                    },
                ]
            }
            properties: {
                Row: {
                    address: string
                    created_at: string | null
                    id: string
                    name: string
                }
                Insert: {
                    address: string
                    created_at?: string | null
                    id?: string
                    name: string
                }
                Update: {
                    address?: string
                    created_at?: string | null
                    id?: string
                    name?: string
                }
                Relationships: []
            }
            rooms: {
                Row: {
                    created_at: string | null
                    id: string
                    name: string
                    occupancy_status: Database["public"]["Enums"]["room_occupancy"]
                    price: number
                    property_id: string | null
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    name: string
                    occupancy_status?: Database["public"]["Enums"]["room_occupancy"]
                    price: number
                    property_id?: string | null
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    name?: string
                    occupancy_status?: Database["public"]["Enums"]["room_occupancy"]
                    price?: number
                    property_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "rooms_property_id_fkey"
                        columns: ["property_id"]
                        isOneToOne: false
                        referencedRelation: "properties"
                        referencedColumns: ["id"]
                    },
                ]
            }
            service_requests: {
                Row: {
                    created_at: string | null
                    description: string | null
                    id: string
                    status: string | null
                    title: string | null
                    updated_at: string | null
                    user_id: string | null
                }
                Insert: {
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    status?: string | null
                    title?: string | null
                    updated_at?: string | null
                    user_id?: string | null
                }
                Update: {
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    status?: string | null
                    title?: string | null
                    updated_at?: string | null
                    user_id?: string | null
                }
                Relationships: []
            }
            tenant_assignments: {
                Row: {
                    assign_date: string | null
                    id: string
                    room_id: string
                    status: string | null
                    tenant_id: string
                }
                Insert: {
                    assign_date?: string | null
                    id?: string
                    room_id: string
                    status?: string | null
                    tenant_id: string
                }
                Update: {
                    assign_date?: string | null
                    id?: string
                    room_id?: string
                    status?: string | null
                    tenant_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "tenant_assignments_room_id_fkey"
                        columns: ["room_id"]
                        isOneToOne: false
                        referencedRelation: "rooms"
                        referencedColumns: ["id"]
                    },
                ]
            }
            work_orders: {
                Row: {
                    assigned_to: string | null
                    created_at: string | null
                    description: string
                    id: string
                    priority: Database["public"]["Enums"]["work_order_priority"]
                    property_id: string
                    status: Database["public"]["Enums"]["work_order_status"]
                    title: string
                    updated_at: string | null
                }
                Insert: {
                    assigned_to?: string | null
                    created_at?: string | null
                    description: string
                    id?: string
                    priority?: Database["public"]["Enums"]["work_order_priority"]
                    property_id: string
                    status?: Database["public"]["Enums"]["work_order_status"]
                    title: string
                    updated_at?: string | null
                }
                Update: {
                    assigned_to?: string | null
                    created_at?: string | null
                    description?: string
                    id?: string
                    priority?: Database["public"]["Enums"]["work_order_priority"]
                    property_id?: string
                    status?: Database["public"]["Enums"]["work_order_status"]
                    title?: string
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "work_orders_property_id_fkey"
                        columns: ["property_id"]
                        isOneToOne: false
                        referencedRelation: "properties"
                        referencedColumns: ["id"]
                    },
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

type PublicSchema = Database[Extract<keyof Database, "public">]

// Simplified helper types that only work with public schema
export type Tables<T extends keyof PublicSchema["Tables"]> =
    PublicSchema["Tables"][T]["Row"]

export type TablesInsert<T extends keyof PublicSchema["Tables"]> =
    PublicSchema["Tables"][T]["Insert"]

export type TablesUpdate<T extends keyof PublicSchema["Tables"]> =
    PublicSchema["Tables"][T]["Update"]

export type Enums<T extends keyof PublicSchema["Enums"]> =
    PublicSchema["Enums"][T]

export type CompositeTypes<T extends keyof PublicSchema["CompositeTypes"]> =
    PublicSchema["CompositeTypes"][T]

export const Constants = {
    public: {
        Enums: {
            channel_role: ["owner", "admin", "member"],
            channel_type: [
                "direct",
                "group",
                "announcement",
                "work_order",
                "grievance",
            ],
            grievance_category: ["wifi", "cleaning", "maintenance", "other"],
            grievance_status: ["open", "in_progress", "resolved", "rejected"],
            invoice_status: [
                "unpaid",
                "paid",
                "overdue",
                "cancelled",
                "pending_verification",
            ],
            item_condition: ["good", "fair", "poor", "broken"],
            room_occupancy: ["vacant", "occupied", "maintenance"],
            user_role: ["owner", "tenant", "guest", "admin"],
            work_order_priority: ["low", "medium", "high"],
            work_order_status: [
                "open",
                "in_progress",
                "waiting_vendor",
                "completed",
                "cancelled",
            ],
        },
    },
} as const
