"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Wrench } from "lucide-react"

export function MainNav({ userRole }: { userRole: string }) {
  const pathname = usePathname()

  // Simplified navigation with only working routes
  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Installer Portal",
      href: "/installer",
      icon: <Wrench className="h-5 w-5" />,
    },
  ]

  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
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

