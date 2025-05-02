"use server"

import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function createCustomer(formData: FormData) {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const address = formData.get("address") as string
  const city = formData.get("city") as string
  const state = formData.get("state") as string
  const zip = formData.get("zip") as string
  const notes = formData.get("notes") as string

  const { error } = await supabase.from("customers").insert({
    name,
    email,
    phone,
    address,
    city,
    state,
    zip,
    notes,
    user_id: user.id,
  })

  if (error) {
    return { error: error.message }
  }

  redirect("/dashboard/customers")
}
