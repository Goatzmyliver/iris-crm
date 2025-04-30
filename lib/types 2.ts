export type Customer = {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  notes?: string
  status: "active" | "inactive" | "lead"
  created_at: string
}

export type Job = {
  id: string
  title: string
  description: string
  customer_id: string
  status: "pending" | "scheduled" | "in-progress" | "completed" | "cancelled"
  scheduled_date?: string
  completion_date?: string
  assigned_to?: string
  total_amount: number
  notes?: string
  created_at: string
}

export type Quote = {
  id: string
  customer_id: string
  title: string
  description: string
  items: QuoteItem[]
  total_amount: number
  status: "draft" | "sent" | "accepted" | "rejected" | "expired"
  valid_until?: string
  notes?: string
  created_at: string
}

export type QuoteItem = {
  id: string
  name: string
  description?: string
  quantity: number
  unit_price: number
  total: number
}

export type InventoryItem = {
  id: string
  name: string
  description: string
  quantity: number
  unit_price: number
  category: string
  sku?: string
  created_at: string
}

export type User = {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  role: "admin" | "manager" | "installer" | "user"
}
