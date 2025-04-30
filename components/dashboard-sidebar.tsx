"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  Package,
  CreditCard,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface SidebarItem {
  title: string
  href: string
  icon: React.ReactNode
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const sidebarItems: SidebarItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Customers",
      href: "/dashboard/customers",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Jobs",
      href: "/dashboard/jobs",
      icon: <Briefcase className="h-5 w-5" />,
    },
    {
      title: "Quotes",
      href: "/dashboard/quotes",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Inventory",
      href: "/dashboard/inventory",
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: "Invoicing",
      href: "/dashboard/invoicing",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      title: "Calendar",
      href: "/dashboard/calendar",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: "Reports",
      href: "/dashboard/reports",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <div className="hidden border-r bg-background md:block md:w-64">
      <div className="flex h-full flex-col">
        <div className="border-b px-6 py-4">
          <Link href="/dashboard" className="flex items-center">
            <span className="text-xl font-bold">Iris CRM</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 py-2">
          <nav className="grid gap-1 px-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                    ? "bg-accent text-accent-foreground"
                    : "transparent",
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </nav>
        </ScrollArea>
        <div className="border-t p-4">
          <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  )
}
