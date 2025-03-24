import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { MobileNav } from "@/components/mobile-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <MobileNav />
      <div className="flex flex-1">
        <Sidebar className="hidden md:block" />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

