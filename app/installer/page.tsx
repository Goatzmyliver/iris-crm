"use client"

import { InstallerHeader } from "@/components/installer-header"
import { InstallerCalendar } from "@/components/installer-calendar"
import { useAuth } from "@/lib/auth-provider"

export default function InstallerPortalPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <InstallerHeader />
      <main className="flex-1 overflow-auto p-2 sm:p-4 md:p-6">
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">My Jobs</h2>
          </div>
          <InstallerCalendarWrapper />
        </div>
      </main>
    </div>
  )
}

// Client component to access auth context
function InstallerCalendarWrapper() {
  const { user } = useAuth()

  if (!user) return null

  return <InstallerCalendar installerId={user.id} />
}
