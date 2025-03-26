import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { InstallerHeader } from "@/components/installer-header"
import { InstallerCalendar } from "@/components/installer-calendar"

export default async function InstallerPortalPage() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: userProfile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  // If user is not an installer, redirect to dashboard
  if (userProfile?.role !== "installer") {
    redirect("/dashboard")
  }

  const user = {
    id: session.user.id,
    email: session.user.email!,
    full_name: userProfile?.full_name,
    avatar_url: userProfile?.avatar_url,
  }

  return (
    <div className="flex min-h-screen flex-col">
      <InstallerHeader user={user} />
      <main className="flex-1 overflow-auto p-2 sm:p-4 md:p-6">
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">My Jobs</h2>
          </div>
          <InstallerCalendar installerId={user.id} />
        </div>
      </main>
    </div>
  )
}

