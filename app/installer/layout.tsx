import type React from "react"
import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import "../globals.css"

export const metadata = {
  title: "Installer Portal - Iris CRM",
  description: "Job scheduling and management for installers",
}

export default async function InstallerLayout({
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

  // If user is not an installer or admin, redirect to dashboard
  if (userProfile?.role !== "installer" && userProfile?.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

