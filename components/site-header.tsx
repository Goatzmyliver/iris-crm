"use client"

import Link from "next/link"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { createClientComponentClient } from "@/lib/supabase"
import { useEffect, useState } from "react"

export function SiteHeader() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function getUser() {
      try {
        const { data } = await supabase.auth.getUser()
        if (data?.user) {
          setUser({
            email: data.user.email || "",
            name: data.user.user_metadata?.name || "",
          })
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [supabase])

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <span className="font-bold text-xl">IRIS CRM</span>
        </Link>
        <div className="flex items-center space-x-4">
          <ModeToggle />
          {!loading && user && <UserNav user={user} />}
        </div>
      </div>
    </header>
  )
}

