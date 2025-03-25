"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Loader2 } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)

  // Create a Supabase client directly
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  )

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        if (!data.session) {
          // If no session is found, redirect to login
          window.location.href = "/login"
          return
        }

        setLoading(false)
      } catch (error) {
        console.error("Error checking auth:", error)
        // On error, redirect to login
        window.location.href = "/login"
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">IRIS CRM</h1>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}

