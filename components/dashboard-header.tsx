"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-provider"

export function DashboardHeader() {
  // For testing, we'll create a mock user if none exists
  const { user, signOut } = useAuth()

  // Mock user data for testing
  const displayName = user?.full_name || "Test User"

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Link href="/dashboard" className="font-semibold">
          Iris CRM
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/dashboard/customers" className="text-sm font-medium">
            Customers
          </Link>
          <Link href="/dashboard/jobs" className="text-sm font-medium">
            Jobs
          </Link>
          <Link href="/dashboard/quotes" className="text-sm font-medium">
            Quotes
          </Link>
          <Link href="/installer" className="text-sm font-medium">
            Installer
          </Link>
        </nav>
        <div className="ml-4 flex items-center gap-2">
          <span className="text-sm">{displayName}</span>
          <Button variant="ghost" size="sm" onClick={() => {}}>
            Settings
          </Button>
        </div>
      </div>
    </header>
  )
}
