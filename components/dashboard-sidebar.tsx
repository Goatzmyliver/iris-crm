"use client"

import { MainNav } from "@/components/main-nav"

export function DashboardSidebar({ userRole }: { userRole: string }) {
  return (
    <aside className="w-64 border-r bg-background">
      <div className="p-4">
        <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Navigation</h2>
        <MainNav userRole={userRole} />
      </div>
    </aside>
  )
}

