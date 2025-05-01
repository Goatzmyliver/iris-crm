import { createServerSupabaseClient } from "./supabase/server"
import { redirect } from "next/navigation"

export async function getSession() {
  const supabase = createServerSupabaseClient()

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

export async function getUserProfile() {
  const session = await getSession()

  if (!session) {
    return null
  }

  const supabase = createServerSupabaseClient()

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  return profile
}

export async function requireAuth() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return session
}
