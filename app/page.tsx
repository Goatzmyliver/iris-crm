import { redirect } from "next/navigation"
import { createServerComponentClient } from "@/lib/supabase"

export default async function HomePage() {
  const supabase = createServerComponentClient()
  const { data } = await supabase.auth.getSession()

  // If user is logged in, redirect to dashboard
  if (data.session) {
    redirect("/dashboard")
  }

  // Otherwise redirect to login
  redirect("/login")
}

