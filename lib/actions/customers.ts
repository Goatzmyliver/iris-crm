"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { Customer } from "@/lib/types"

export async function getCustomers() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching customers:", error)
    return []
  }

  return data as Customer[]
}

export async function getCustomer(id: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("customers").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching customer:", error)
    return null
  }

  return data as Customer
}

export async function createCustomer(formData: FormData) {
  const supabase = createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const customer = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    address: formData.get("address") as string,
    city: formData.get("city") as string,
    state: formData.get("state") as string,
    zip: formData.get("zip") as string,
    notes: formData.get("notes") as string,
    status: (formData.get("status") as string) || "active",
    user_id: user.id,
  }

  const { error } = await supabase.from("customers").insert(customer)

  if (error) {
    console.error("Error creating customer:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/customers")
  redirect("/dashboard/customers")
}

export async function updateCustomer(id: string, formData: FormData) {
  const supabase = createServerSupabaseClient()

  const customer = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    address: formData.get("address") as string,
    city: formData.get("city") as string,
    state: formData.get("state") as string,
    zip: formData.get("zip") as string,
    notes: formData.get("notes") as string,
    status: formData.get("status") as string,
  }

  const { error } = await supabase.from("customers").update(customer).eq("id", id)

  if (error) {
    console.error("Error updating customer:", error)
    return { success: false, error: error.message }
  }

  revalidatePath(`/dashboard/customers/${id}`)
  revalidatePath("/dashboard/customers")
  redirect("/dashboard/customers")
}

export async function deleteCustomer(id: string) {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("customers").delete().eq("id", id)

  if (error) {
    console.error("Error deleting customer:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard/customers")
  redirect("/dashboard/customers")
}
