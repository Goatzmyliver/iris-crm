export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          phone: string
          address: string
          city: string
          state: string
          zip: string
          notes: string | null
          status: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          phone: string
          address: string
          city: string
          state: string
          zip: string
          notes?: string | null
          status?: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          phone?: string
          address?: string
          city?: string
          state?: string
          zip?: string
          notes?: string | null
          status?: string
          user_id?: string
        }
      }
      jobs: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          customer_id: string
          status: string
          scheduled_date: string | null
          completion_date: string | null
          assigned_to: string | null
          total_amount: number
          notes: string | null
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          customer_id: string
          status?: string
          scheduled_date?: string | null
          completion_date?: string | null
          assigned_to?: string | null
          total_amount?: number
          notes?: string | null
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          customer_id?: string
          status?: string
          scheduled_date?: string | null
          completion_date?: string | null
          assigned_to?: string | null
          total_amount?: number
          notes?: string | null
          user_id?: string
        }
      }
      quotes: {
        Row: {
          id: string
          created_at: string
          customer_id: string
          title: string
          description: string
          items: Json
          total_amount: number
          status: string
          valid_until: string | null
          notes: string | null
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          customer_id: string
          title: string
          description: string
          items: Json
          total_amount: number
          status?: string
          valid_until?: string | null
          notes?: string | null
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          customer_id?: string
          title?: string
          description?: string
          items?: Json
          total_amount?: number
          status?: string
          valid_until?: string | null
          notes?: string | null
          user_id?: string
        }
      }
      inventory: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string
          quantity: number
          unit_price: number
          category: string
          sku: string | null
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description: string
          quantity: number
          unit_price: number
          category: string
          sku?: string | null
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string
          quantity?: number
          unit_price?: number
          category?: string
          sku?: string | null
          user_id?: string
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          full_name: string
          avatar_url: string | null
          role: string
          email: string
        }
        Insert: {
          id: string
          created_at?: string
          full_name: string
          avatar_url?: string | null
          role?: string
          email: string
        }
        Update: {
          id?: string
          created_at?: string
          full_name?: string
          avatar_url?: string | null
          role?: string
          email?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
