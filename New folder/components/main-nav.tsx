"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Wrench, Package, FileText, BarChart3, Users, Settings, Receipt } from "lucide-react"

export function MainNav({ userRole }: { userRole: string }) {
  const pathname = usePathname()

  // Base navigation items that all users can see
  const baseNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
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
      title: "Customers",
      href: "/dashboard/customers",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Invoicing",
      href: "/dashboard/invoicing",
      icon: <Receipt className="h-5 w-5" />,
    },
    {
      title: "Reports",
      href: "/dashboard/reports",
      icon: <BarChart3 className="h-5 w-5" />,
    },
  ]

  // Add installer portal link only for installers and admins
  const navItems =
    userRole === "installer" || userRole === "admin"
      ? [
          ...baseNavItems,
          {
            title: "Installer Portal",
            href: "/installer",
            icon: <Wrench className="h-5 w-5" />,
          },
        ]
      : baseNavItems

  // Add admin settings for admins only
  if (userRole === "admin") {
    navItems.push({
      title: "Admin Settings",
      href: "/dashboard/admin",
      icon: <Settings className="h-5 w-5" />,
    })
  }

  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            (item.href === "/dashboard" && pathname === "/dashboard") ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href))
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
