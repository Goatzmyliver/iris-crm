import { supabase } from "./supabase/client"
import type { Customer, CustomerFormValues } from "@/types/schema"

export async function getCustomers() {
  const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching customers:", error)
    throw new Error("Failed to fetch customers")
  }

  return data as Customer[]
}

export async function getCustomer(id: string) {
  const { data, error } = await supabase.from("customers").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching customer:", error)
    throw new Error("Failed to fetch customer")
  }

  return data as Customer
}

export async function createCustomer(customer: CustomerFormValues) {
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError) {
    console.error("Error getting user:", userError)
    throw new Error("Failed to get user")
  }

  const { data, error } = await supabase
    .from("customers")
    .insert([{ ...customer, user_id: userData.user.id }])
    .select()

  if (error) {
    console.error("Error creating customer:", error)
    throw new Error("Failed to create customer")
  }

  return data[0] as Customer
}

export async function updateCustomer(id: string, customer: Partial<CustomerFormValues>) {
  const { data, error } = await supabase.from("customers").update(customer).eq("id", id).select()

  if (error) {
    console.error("Error updating customer:", error)
    throw new Error("Failed to update customer")
  }

  return data[0] as Customer
}

export async function deleteCustomer(id: string) {
  const { error } = await supabase.from("customers").delete().eq("id", id)

  if (error) {
    console.error("Error deleting customer:", error)
    throw new Error("Failed to delete customer")
  }

  return true
}
