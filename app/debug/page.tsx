"use client"

import { useAuth } from "@/lib/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function DebugPage() {
  const { user, profile, isLoading, signOut, refreshSession } = useAuth()

  const handleRefresh = async () => {
    await refreshSession()
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : user ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Session Active</h3>
                <p className="text-sm text-muted-foreground">You are currently logged in</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">User Information:</h3>
                <pre className="bg-muted p-4 rounded-md overflow-auto">{JSON.stringify(user, null, 2)}</pre>
              </div>

              {profile && (
                <div className="space-y-2">
                  <h3 className="font-medium">Profile Information:</h3>
                  <pre className="bg-muted p-4 rounded-md overflow-auto">{JSON.stringify(profile, null, 2)}</pre>
                </div>
              )}

              <div className="flex gap-4">
                <Button onClick={() => (window.location.href = "/dashboard")}>Go to Dashboard</Button>
                <Button variant="outline" onClick={handleRefresh}>
                  Refresh Session
                </Button>
                <Button variant="destructive" onClick={signOut}>
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
