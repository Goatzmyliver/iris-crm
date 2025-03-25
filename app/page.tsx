import { redirect } from "next/navigation"
import { createServerComponentClient } from "@/lib/supabase"

export default async function HomePage() {
  try {
    const supabase = createServerComponentClient()
    const { data } = await supabase.auth.getSession()

    // If user is logged in, redirect to dashboard
    if (data.session) {
      redirect("/dashboard")
    }
  } catch (error) {
    console.error("Error checking session:", error)
  }

  // Otherwise redirect to login
  redirect("/login")
}

