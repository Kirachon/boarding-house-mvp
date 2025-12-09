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
    public: {
        Tables: {
            announcements: {
                Row: {
                    id: string
                    title: string
                    content: string
                    is_active: boolean
                    created_at: string
                    created_by: string | null
                }
                Insert: {
                    id?: string
                    title: string
                    content: string
                    is_active?: boolean
                    created_at?: string
                    created_by?: string | null
                }
                Update: {
                    id?: string
                    title?: string
                    content?: string
                    is_active?: boolean
                    created_at?: string
                    created_by?: string | null
                }
                Relationships: []
            }
            expenses: {
                Row: {
                    id: string
                    category: string
                    amount: number
                    description: string | null
                    expense_date: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    category: string
                    amount: number
                    description?: string | null
                    expense_date?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    category?: string
                    amount?: number
                    description?: string | null
                    expense_date?: string
                    created_at?: string
                }
                Relationships: []
            }
            grievances: {
                Row: {
                    category: Database["public"]["Enums"]["grievance_category"]
                    created_at: string
                    description: string
                    id: string
                    photo_url: string | null
                    status: Database["public"]["Enums"]["grievance_status"]
                    tenant_id: string
                    updated_at: string
                }
                Insert: {
                    category: Database["public"]["Enums"]["grievance_category"]
                    created_at?: string
                    description: string
                    id?: string
                    photo_url?: string | null
                    status?: Database["public"]["Enums"]["grievance_status"]
                    tenant_id: string
                    updated_at?: string
                }
                Update: {
                    category?: Database["public"]["Enums"]["grievance_category"]
                    created_at?: string
                    description?: string
                    id?: string
                    photo_url?: string | null
                    status?: Database["public"]["Enums"]["grievance_status"]
                    tenant_id?: string
                    updated_at?: string
                }
                Relationships: []
            }
            inventory_items: {
                Row: {
                    condition: Database["public"]["Enums"]["item_condition"]
                    id: string
                    last_checked: string
                    name: string
                    room_id: string | null
                }
                Insert: {
                    condition?: Database["public"]["Enums"]["item_condition"]
                    id?: string
                    last_checked?: string
                    name: string
                    room_id?: string | null
                }
                Update: {
                    condition?: Database["public"]["Enums"]["item_condition"]
                    id?: string
                    last_checked?: string
                    name: string
                    room_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "inventory_items_room_id_fkey"
                        columns: ["room_id"]
                        isOneToOne: false
                        referencedRelation: "rooms"
                        referencedColumns: ["id"]
                    },
                ]
            }
            invoices: {
                Row: {
                    amount: number
                    created_at: string
                    description: string
                    due_date: string
                    id: string
                    status: Database["public"]["Enums"]["invoice_status"]
                    tenant_id: string
                    updated_at: string
                    proof_image_url: string | null
                }
                Insert: {
                    amount: number
                    created_at?: string
                    description?: string
                    due_date: string
                    id?: string
                    status?: Database["public"]["Enums"]["invoice_status"]
                    tenant_id: string
                    updated_at?: string
                    proof_image_url?: string | null
                }
                Update: {
                    amount?: number
                    created_at?: string
                    description?: string
                    due_date?: string
                    id?: string
                    status?: Database["public"]["Enums"]["invoice_status"]
                    tenant_id?: string
                    updated_at?: string
                    proof_image_url?: string | null
                }
                Relationships: []
            }
            profiles: {
                Row: {
                    created_at: string
                    full_name: string | null
                    id: string
                    role: Database["public"]["Enums"]["user_role"]
                }
                Insert: {
                    created_at?: string
                    full_name?: string | null
                    id: string
                    role?: Database["public"]["Enums"]["user_role"]
                }
                Update: {
                    created_at?: string
                    full_name?: string | null
                    id?: string
                    role?: Database["public"]["Enums"]["user_role"]
                }
                Relationships: []
            }
            properties: {
                Row: {
                    address: string
                    amenities: string[] | null
                    created_at: string
                    description: string | null
                    id: string
                    is_verified: boolean
                    name: string
                    owner_id: string
                }
                Insert: {
                    address: string
                    amenities?: string[] | null
                    created_at?: string
                    description?: string | null
                    id?: string
                    is_verified?: boolean
                    name: string
                    owner_id: string
                }
                Update: {
                    address?: string
                    amenities?: string[] | null
                    created_at?: string
                    description?: string | null
                    id?: string
                    is_verified?: boolean
                    name?: string
                    owner_id?: string
                }
                Relationships: []
            }
            rooms: {
                Row: {
                    capacity: number
                    created_at: string
                    id: string
                    name: string
                    occupancy: Database["public"]["Enums"]["room_occupancy"]
                    price: number
                    property_id: string | null
                }
                Insert: {
                    capacity?: number
                    created_at?: string
                    id?: string
                    name: string
                    occupancy?: Database["public"]["Enums"]["room_occupancy"]
                    price?: number
                    property_id?: string | null
                }
                Update: {
                    capacity?: number
                    created_at?: string
                    id?: string
                    name?: string
                    occupancy?: Database["public"]["Enums"]["room_occupancy"]
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
            tenant_room_assignments: {
                Row: {
                    created_at: string
                    end_date: string | null
                    lease_start: string | null
                    lease_end: string | null
                    id: string
                    is_active: boolean
                    room_id: string
                    start_date: string
                    tenant_id: string
                }
                Insert: {
                    created_at?: string
                    end_date?: string | null
                    lease_start?: string | null
                    lease_end?: string | null
                    id?: string
                    is_active?: boolean
                    room_id: string
                    start_date?: string
                    tenant_id: string
                }
                Update: {
                    created_at?: string
                    end_date?: string | null
                    lease_start?: string | null
                    lease_end?: string | null
                    id?: string
                    is_active?: boolean
                    room_id?: string
                    start_date?: string
                    tenant_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "tenant_room_assignments_room_id_fkey"
                        columns: ["room_id"]
                        isOneToOne: false
                        referencedRelation: "rooms"
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
            grievance_category: "wifi" | "cleaning" | "maintenance" | "other"
            grievance_status: "open" | "in_progress" | "resolved" | "rejected"
            invoice_status: "unpaid" | "paid" | "overdue" | "cancelled" | "pending_verification"
            item_condition: "good" | "fair" | "poor" | "broken"
            room_occupancy: "vacant" | "occupied" | "maintenance"
            user_role: "owner" | "tenant" | "guest" | "admin"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database
    }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
