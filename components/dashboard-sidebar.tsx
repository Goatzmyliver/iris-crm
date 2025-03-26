"use client"

import { MainNav } from "@/components/main-nav"

export function DashboardSidebar({ userRole }: { userRole: string }) {
  return (
    <div className="hidden border-r bg-muted/40 md:block md:w-64 lg:w-72">
      <div className="flex h-full max-h-screen flex-col gap-2 p-4">
        <MainNav userRole={userRole} />
      </div>
    </div>
  )
}

