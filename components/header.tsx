"use client"

import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { createClientComponentClient } from "@/lib/supabase"
import { useEffect, useState } from "react"

export function Header() {
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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-end border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-4">
        <ModeToggle />
        {!loading && user && <UserNav user={user} />}
      </div>
    </header>
  )
}

