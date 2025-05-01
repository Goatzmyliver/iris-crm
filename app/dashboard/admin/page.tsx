"use client"

import type React from "react"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function AdminPage() {
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const makeAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // First get the user ID from the email
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .single()

      if (userError) {
        throw new Error("User not found with that email")
      }

      // Update the user's role to admin
      const { error: updateError } = await supabase.from("profiles").update({ role: "admin" }).eq("id", userData.id)

      if (updateError) throw updateError

      toast({
        title: "Success",
        description: `User ${email} has been made an admin`,
      })

      setEmail("")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user role",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const makeSelfAdmin = async () => {
    setIsLoading(true)

    try {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) throw userError

      // Update the user's role to admin
      const { error: updateError } = await supabase.from("profiles").update({ role: "admin" }).eq("id", user?.id)

      if (updateError) throw updateError

      toast({
        title: "Success",
        description: "You are now an admin",
      })

      // Force a refresh to update the UI
      window.location.reload()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update your role",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Admin Settings</h2>
        <p className="text-muted-foreground">Manage user roles and permissions</p>
      </div>

      <div className="grid gap-6">
        <div className="rounded-lg border p-4">
          <h3 className="text-lg font-medium mb-4">Make Yourself Admin</h3>
          <Button onClick={makeSelfAdmin} disabled={isLoading}>
            {isLoading ? "Processing..." : "Promote to Admin"}
          </Button>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="text-lg font-medium mb-4">Make Another User Admin</h3>
          <form onSubmit={makeAdmin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">User Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                required
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Processing..." : "Make Admin"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
