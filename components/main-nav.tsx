"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, Calendar, ClipboardList, Home, Package, Settings, Users } from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  roles: string[]
}

export function MainNav({ userRole }: { userRole: string }) {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
      roles: ["admin", "sales", "installer"],
    },
    {
      title: "Customers",
      href: "/customers",
      icon: <Users className="h-5 w-5" />,
      roles: ["admin", "sales"],
    },
    {
      title: "Quotes",
      href: "/quotes",
      icon: <ClipboardList className="h-5 w-5" />,
      roles: ["admin", "sales"],
    },
    {
      title: "Jobs",
      href: "/jobs",
      icon: <Calendar className="h-5 w-5" />,
      roles: ["admin", "sales", "installer"],
    },
    {
      title: "Inventory",
      href: "/inventory",
      icon: <Package className="h-5 w-5" />,
      roles: ["admin", "sales"],
    },
    {
      title: "Reports",
      href: "/reports",
      icon: <BarChart3 className="h-5 w-5" />,
      roles: ["admin"],
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
      roles: ["admin"],
    },
  ]

  const filteredNavItems = navItems.filter((item) => item.roles.includes(userRole))

  return (
    <nav className="flex flex-col space-y-1">
      {filteredNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            pathname === item.href || pathname.startsWith(`${item.href}/`)
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground",
          )}
        >
          {item.icon}
          <span className="ml-3">{item.title}</span>
        </Link>
      ))}
    </nav>
  )
}

