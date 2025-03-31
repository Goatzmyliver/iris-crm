"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugPage() {
  const supabase = createClientComponentClient()
  const [session, setSession] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSession() {
      setLoading(true)

      // Get current session
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setSession(session)

      // If we have a session, get the user profile
      if (session?.user) {
        const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

        setProfile(data)
      }

      setLoading(false)
    }

    loadSession()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  const goToDashboard = () => {
    window.location.href = "/dashboard"
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Session Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading session information...</p>
          ) : session ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Session Active</h3>
                <p className="text-sm text-muted-foreground">You are currently logged in</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">User Information:</h3>
                <pre className="bg-muted p-4 rounded-md overflow-auto">
                  {JSON.stringify(
                    {
                      id: session.user.id,
                      email: session.user.email,
                      created_at: session.user.created_at,
                    },
                    null,
                    2,
                  )}
                </pre>
              </div>

              {profile && (
                <div className="space-y-2">
                  <h3 className="font-medium">Profile Information:</h3>
                  <pre className="bg-muted p-4 rounded-md overflow-auto">{JSON.stringify(profile, null, 2)}</pre>
                </div>
              )}

              <div className="flex gap-4">
                <Button onClick={goToDashboard}>Go to Dashboard</Button>
                <Button variant="outline" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">No Active Session</h3>
                <p className="text-sm text-muted-foreground">You are not currently logged in</p>
              </div>

              <Button onClick={() => (window.location.href = "/login")}>Go to Login</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

