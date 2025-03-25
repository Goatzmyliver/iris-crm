"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  Package,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart,
  MessageSquare,
} from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        // Redirect to login if no user is found
        router.push("/login")
        return
      }

      setUser(user)
      setLoading(false)
    }

    getUser()
  }, [supabase, router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/enquiries", label: "Enquiries", icon: MessageSquare },
    { href: "/customers", label: "Customers", icon: Users },
    { href: "/quotes", label: "Quotes", icon: FileText },
    { href: "/jobs", label: "Scheduling", icon: Calendar },
    { href: "/inventory", label: "Inventory", icon: Package },
    { href: "/reports", label: "Reports", icon: BarChart },
    { href: "/settings", label: "Settings", icon: Settings },
  ]

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null // We'll redirect in the useEffect
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-16 items-center px-4 sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-2"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            {mobileNavOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          <h1 className="text-lg font-semibold">Iris</h1>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline-block mr-2">{user.email}</span>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Sign out</span>
            </Button>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside
          className={`${mobileNavOpen ? "block" : "hidden"} md:block border-r bg-background w-64 fixed md:sticky top-16 h-[calc(100vh-4rem)] z-30 overflow-y-auto`}
        >
          <nav className="flex flex-col gap-2 p-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
            <Button variant="ghost" className="justify-start mt-auto md:hidden" onClick={handleSignOut}>
              <LogOut className="mr-2 h-5 w-5" />
              Sign out
            </Button>
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

