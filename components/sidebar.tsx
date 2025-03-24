"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart, Users, FileText, Calendar, Settings, HelpCircle, MessageSquare, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function Sidebar() {
  const pathname = usePathname()

  const routes = [
    {
      title: "Dashboard",
      icon: BarChart,
      href: "/dashboard",
      variant: "default",
    },
    {
      title: "Enquiries",
      icon: MessageSquare,
      href: "/enquiries",
      variant: "ghost",
    },
    {
      title: "Customers",
      icon: Users,
      href: "/customers",
      variant: "ghost",
    },
    {
      title: "Quotes",
      icon: FileText,
      href: "/quotes",
      variant: "ghost",
    },
    {
      title: "Bookkeeper",
      icon: BookOpen,
      href: "/bookkeeper",
      variant: "ghost",
    },
    {
      title: "Calendar",
      icon: Calendar,
      href: "/calendar",
      variant: "ghost",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/settings",
      variant: "ghost",
    },
    {
      title: "Help",
      icon: HelpCircle,
      href: "/help",
      variant: "ghost",
    },
  ]

  return (
    <div className="flex h-full w-60 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <span className="text-primary">Iris CRM</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={pathname === route.href ? "default" : "ghost"}
              className={cn("justify-start", pathname === route.href && "bg-primary text-primary-foreground")}
              asChild
            >
              <Link href={route.href}>
                <route.icon className="mr-2 h-4 w-4" />
                {route.title}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <div className="flex items-center gap-2 rounded-lg bg-muted p-4">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Need help?</p>
            <p className="text-xs text-muted-foreground">Check our documentation</p>
          </div>
        </div>
      </div>
    </div>
  )
}

