"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, FileText, FileCheck, BarChart3, Settings, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    name: "Leads",
    href: "/leads",
    icon: FileText,
  },
  {
    name: "Deals",
    href: "/deals",
    icon: FileCheck,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="absolute left-4 top-3 z-50 md:hidden">
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] p-0">
          <div className="flex h-16 items-center border-b px-4">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <span className="text-xl">Iris CRM</span>
            </Link>
            <Button variant="ghost" size="icon" className="absolute right-4 top-3" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <nav className="grid gap-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href || pathname?.startsWith(`${item.href}/`)
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <aside className="hidden w-[240px] flex-col border-r md:flex">
        <div className="flex h-16 items-center border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <span className="text-xl">Iris CRM</span>
          </Link>
        </div>
        <nav className="grid gap-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href || pathname?.startsWith(`${item.href}/`)
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  )
}

