import Link from "next/link"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { createServerComponentClient } from "@/lib/supabase"

export async function SiteHeader() {
  let user = null

  try {
    const supabase = createServerComponentClient()
    const { data } = await supabase.auth.getSession()

    user = data.session?.user
      ? {
          email: data.session.user.email || "",
          name: data.session.user.user_metadata?.name || "",
        }
      : null
  } catch (error) {
    console.error("Error fetching user session:", error)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <span className="font-bold text-xl">IRIS CRM</span>
        </Link>
        <div className="flex items-center space-x-4">
          <ModeToggle />
          {user && <UserNav user={user} />}
        </div>
      </div>
    </header>
  )
}

