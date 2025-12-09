export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    role: 'owner' | 'tenant' | 'guest' | 'admin'
                    full_name: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    role?: 'owner' | 'tenant' | 'guest' | 'admin'
                    full_name?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    role?: 'owner' | 'tenant' | 'guest' | 'admin'
                    full_name?: string | null
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey"
                        columns: ["id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            properties: {
                Row: {
                    id: string
                    owner_id: string
                    name: string
                    address: string
                    description: string | null
                    amenities: string[] | null
                    is_verified: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    owner_id: string
                    name: string
                    address: string
                    description?: string | null
                    amenities?: string[] | null
                    is_verified?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    owner_id?: string
                    name?: string
                    address?: string
                    description?: string | null
                    amenities?: string[] | null
                    is_verified?: boolean
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "properties_owner_id_fkey"
                        columns: ["owner_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            grievances: {
                Row: {
                    id: string
                    tenant_id: string
                    category: 'wifi' | 'cleaning' | 'maintenance' | 'other'
                    description: string
                    photo_url: string | null
                    status: 'open' | 'in_progress' | 'resolved' | 'rejected'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    tenant_id: string
                    category: 'wifi' | 'cleaning' | 'maintenance' | 'other'
                    description: string
                    photo_url?: string | null
                    status?: 'open' | 'in_progress' | 'resolved' | 'rejected'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    tenant_id?: string
                    category: 'wifi' | 'cleaning' | 'maintenance' | 'other'
                    description?: string
                    photo_url?: string | null
                    status?: 'open' | 'in_progress' | 'resolved' | 'rejected'
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "grievances_tenant_id_fkey"
                        columns: ["tenant_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            rooms: {
                Row: {
                    id: string
                    property_id: string | null
                    name: string
                    occupancy: 'vacant' | 'occupied' | 'maintenance'
                    price: number
                    capacity: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    property_id?: string | null
                    name: string
                    occupancy?: 'vacant' | 'occupied' | 'maintenance'
                    price?: number
                    capacity?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    property_id?: string | null
                    name?: string
                    occupancy?: 'vacant' | 'occupied' | 'maintenance'
                    price?: number
                    capacity?: number
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "rooms_property_id_fkey"
                        columns: ["property_id"]
                        referencedRelation: "properties"
                        referencedColumns: ["id"]
                    }
                ]
            }
            inventory_items: {
                Row: {
                    id: string
                    room_id: string | null
                    name: string
                    condition: 'good' | 'fair' | 'poor' | 'broken'
                    last_checked: string
                }
                Insert: {
                    id?: string
                    room_id?: string | null
                    name: string
                    condition?: 'good' | 'fair' | 'poor' | 'broken'
                    last_checked?: string
                }
                Update: {
                    id?: string
                    room_id?: string | null
                    name?: string
                    condition?: 'good' | 'fair' | 'poor' | 'broken'
                    last_checked?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "inventory_items_room_id_fkey"
                        columns: ["room_id"]
                        referencedRelation: "rooms"
                        referencedColumns: ["id"]
                    }
                ]
            }
            tenant_room_assignments: {
                Row: {
                    id: string
                    tenant_id: string
                    room_id: string
                    start_date: string
                    end_date: string | null
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    tenant_id: string
                    room_id: string
                    start_date?: string
                    end_date?: string | null
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    tenant_id?: string
                    room_id?: string
                    start_date?: string
                    end_date?: string | null
                    is_active?: boolean
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "tenant_room_assignments_tenant_id_fkey"
                        columns: ["tenant_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "tenant_room_assignments_room_id_fkey"
                        columns: ["room_id"]
                        referencedRelation: "rooms"
                        referencedColumns: ["id"]
                    }
                ]
            }
            invoices: {
                Row: {
                    id: string
                    tenant_id: string
                    amount: number
                    due_date: string
                    status: 'unpaid' | 'paid' | 'overdue' | 'cancelled'
                    description: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    tenant_id: string
                    amount: number
                    due_date: string
                    status?: 'unpaid' | 'paid' | 'overdue' | 'cancelled'
                    description?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    tenant_id?: string
                    amount?: number
                    due_date?: string
                    status?: 'unpaid' | 'paid' | 'overdue' | 'cancelled'
                    description?: string
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "invoices_tenant_id_fkey"
                        columns: ["tenant_id"]
                        referencedRelation: "users"
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
            user_role: 'owner' | 'tenant' | 'guest' | 'admin'
            grievance_category: 'wifi' | 'cleaning' | 'maintenance' | 'other'
            grievance_status: 'open' | 'in_progress' | 'resolved' | 'rejected'
            item_condition: 'good' | 'fair' | 'poor' | 'broken'
            room_occupancy: 'vacant' | 'occupied' | 'maintenance'
            invoice_status: 'unpaid' | 'paid' | 'overdue' | 'cancelled'
        }
    }
}
