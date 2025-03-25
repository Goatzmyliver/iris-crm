"use client"

import { useEffect, useState } from "react"
import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { createClientComponentClient } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error || !data.session) {
        window.location.href = "/login"
        return
      }

      setLoading(false)
    }

    checkAuth()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 pt-16 md:pt-6">{children}</main>
      </div>
    </div>
  )
}

