"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClientComponentClient()
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        router.push("/login")
      } else {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div>
      {/* Your dashboard layout components */}
      {children}
    </div>
  )
}

