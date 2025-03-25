"use client"

import { useEffect } from "react"
import { createClientComponentClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()

      if (data.session) {
        window.location.href = "/dashboard"
      } else {
        window.location.href = "/login"
      }
    }

    checkAuth()
  }, [supabase])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-pulse text-lg">Loading...</div>
    </div>
  )
}

