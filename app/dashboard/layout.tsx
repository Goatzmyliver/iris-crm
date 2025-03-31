import type React from "react"
import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export const metadata = {
  title: "Dashboard - Iris CRM",
  description: "Job scheduling and management system",
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Fetch user profile including role
  const { data: userProfile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  const user = {
    id: session.user.id,
    email: session.user.email!,
    full_name: userProfile?.full_name,
    avatar_url: userProfile?.avatar_url,
    role: userProfile?.role || "user",
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={user} />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar userRole={user.role} />
        <main className="flex-1 overflow-auto p-4 md:p-6 w-full">{children}</main>
      </div>
    </div>
  )
}

