export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: number
          created_at: string
          name: string
          email: string | null
          phone: string
          address: string | null
          notes: string | null
          assigned_user_id: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          name: string
          email?: string | null
          phone: string
          address?: string | null
          notes?: string | null
          assigned_user_id?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          name?: string
          email?: string | null
          phone?: string
          address?: string | null
          notes?: string | null
          assigned_user_id?: string | null
        }
      }
      quotes: {
        Row: {
          id: string
          created_at: string
          customer_id: number
          status: string
          total: number
          notes: string | null
          assigned_user_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          customer_id: number
          status?: string
          total: number
          notes?: string | null
          assigned_user_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          customer_id?: number
          status?: string
          total?: number
          notes?: string | null
          assigned_user_id?: string | null
        }
      }
      quote_items: {
        Row: {
          id: number
          quote_id: string
          description: string
          quantity: number
          cost_price: number
          markup: number
          total: number
        }
        Insert: {
          id?: number
          quote_id: string
          description: string
          quantity: number
          cost_price: number
          markup: number
          total: number
        }
        Update: {
          id?: number
          quote_id?: string
          description?: string
          quantity?: number
          cost_price?: number
          markup?: number
          total?: number
        }
      }
      jobs: {
        Row: {
          id: string
          created_at: string
          quote_id: string | null
          customer_id: number
          status: string
          scheduled_date: string | null
          completed_date: string | null
          notes: string | null
          assigned_user_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          quote_id?: string | null
          customer_id: number
          status?: string
          scheduled_date?: string | null
          completed_date?: string | null
          notes?: string | null
          assigned_user_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          quote_id?: string | null
          customer_id?: number
          status?: string
          scheduled_date?: string | null
          completed_date?: string | null
          notes?: string | null
          assigned_user_id?: string | null
        }
      }
      inventory_items: {
        Row: {
          id: number
          created_at: string
          name: string
          description: string | null
          category: string
          cost_price: number
          sell_price: number
          stock_level: number
          supplier_id: number | null
        }
        Insert: {
          id?: number
          created_at?: string
          name: string
          description?: string | null
          category: string
          cost_price: number
          sell_price: number
          stock_level: number
          supplier_id?: number | null
        }
        Update: {
          id?: number
          created_at?: string
          name?: string
          description?: string | null
          category?: string
          cost_price?: number
          sell_price?: number
          stock_level?: number
          supplier_id?: number | null
        }
      }
      suppliers: {
        Row: {
          id: number
          created_at: string
          name: string
          contact_name: string | null
          email: string | null
          phone: string
          address: string | null
          notes: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          name: string
          contact_name?: string | null
          email?: string | null
          phone: string
          address?: string | null
          notes?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          name?: string
          contact_name?: string | null
          email?: string | null
          phone?: string
          address?: string | null
          notes?: string | null
        }
      }
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          name: string
          role: string
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          name: string
          role: string
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          name?: string
          role?: string
        }
      }
    }
  }
}

