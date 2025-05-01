export type Customer = {
  id: string
  created_at: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  notes?: string
  status: "active" | "inactive" | "lead"
  user_id: string
}

export type Job = {
  id: string
  created_at: string
  title: string
  description: string
  customer_id: string
  status: "pending" | "scheduled" | "in-progress" | "completed" | "cancelled"
  scheduled_date?: string
  completion_date?: string
  assigned_to?: string
  total_amount: number
  notes?: string
  user_id: string
}

export type Quote = {
  id: string
  created_at: string
  customer_id: string
  title: string
  description: string
  items: QuoteItem[]
  total_amount: number
  status: "draft" | "sent" | "accepted" | "rejected" | "expired"
  valid_until?: string
  notes?: string
  user_id: string
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
  created_at: string
  name: string
  description: string
  quantity: number
  unit_price: number
  category: string
  sku?: string
  user_id: string
}

export type UserProfile = {
  id: string
  created_at: string
  full_name: string
  avatar_url?: string
  role: "admin" | "manager" | "installer" | "user"
  email: string
}

export type CustomerFormValues = Omit<Customer, "id" | "created_at" | "user_id">
