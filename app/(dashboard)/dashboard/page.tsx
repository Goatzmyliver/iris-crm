"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/supabase-js"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Create a fresh Supabase client for this component
  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  })

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser()

        if (error) {
          throw error
        }

        if (data?.user) {
          setUser(data.user)
        } else {
          // If no user is found, redirect to login
          window.location.href = "/login"
        }
      } catch (error) {
        console.error("Error fetching user:", error)
        // On error, redirect to login
        window.location.href = "/login"
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      window.location.href = "/login"
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button onClick={handleSignOut} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Sign Out
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">User Information</h2>
        <div className="space-y-2">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>ID:</strong> {user.id}
          </p>
          <p>
            <strong>Last Sign In:</strong> {new Date(user.last_sign_in_at).toLocaleString()}
          </p>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">User Metadata</h3>
          <pre className="bg-gray-100 p-3 rounded overflow-auto">{JSON.stringify(user.user_metadata, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}

