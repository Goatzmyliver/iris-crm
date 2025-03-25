"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Loader2 } from "lucide-react"

export default function HomePage() {
  const [loading, setLoading] = useState(true)

  // Create a Supabase client directly
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  )

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession()

        if (data.session) {
          window.location.href = "/dashboard"
        } else {
          window.location.href = "/login"
        }
      } catch (error) {
        console.error("Error checking auth:", error)
        window.location.href = "/login"
      }
    }

    checkAuth()
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
    </div>
  )
}

