import type React from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { ProtectedRoute } from "@/components/protected-route"

export const metadata = {
  title: "Dashboard - Iris CRM",
  description: "Job scheduling and management system",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <DashboardClientLayout>{children}</DashboardClientLayout>
    </ProtectedRoute>
  )
}

// Client component to access auth context
function DashboardClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto p-4 md:p-6 w-full">{children}</main>
      </div>
    </div>
  )
}
