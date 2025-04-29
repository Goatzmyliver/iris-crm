"use client"

import { MainNav } from "@/components/main-nav"
import { useAuth } from "@/lib/auth-provider"

export function DashboardSidebar() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <aside className="hidden md:block w-64 border-r bg-background overflow-y-auto h-[calc(100vh-4rem)]">
      <div className="p-4">
        <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Navigation</h2>
        <MainNav userRole={user.role || "user"} />
      </div>
    </aside>
  )
}
