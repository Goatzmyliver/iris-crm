"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

type User = {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role?: string
}

type AuthContextType = {
  user: User | null
  profile: any | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any; user: any | null }>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch user profile from the database
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (error) {
        console.error("Error fetching profile:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error in fetchProfile:", error)
      return null
    }
  }

  // Initialize the auth state
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true)

      try {
        // For debugging: automatically set a mock user without requiring login
        const mockUser = {
          id: "debug-user-id",
          email: "debug@example.com",
          full_name: "Debug User",
          role: "admin",
        }

        setUser(mockUser)
        setProfile({
          id: mockUser.id,
          full_name: mockUser.full_name,
          email: mockUser.email,
          role: mockUser.role,
        })
      } catch (error) {
        console.error("Error initializing auth:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id)

        setUser({
          id: session.user.id,
          email: session.user.email || "",
          full_name: profile?.full_name,
          avatar_url: profile?.avatar_url,
          role: profile?.role,
        })

        setProfile(profile)
      } else {
        setUser(null)
        setProfile(null)
      }

      router.refresh()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error }
      }

      // Fetch user profile after successful sign in
      if (data.user) {
        const profile = await fetchProfile(data.user.id)

        setUser({
          id: data.user.id,
          email: data.user.email || "",
          full_name: profile?.full_name,
          avatar_url: profile?.avatar_url,
          role: profile?.role,
        })

        setProfile(profile)
      }

      return { error: null }
    } catch (error) {
      console.error("Error in signIn:", error)
      return { error }
    }
  }

  // Sign up function
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      // Create the user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        return { error, user: null }
      }

      // Create a profile for the user
      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          full_name: fullName,
          email: email,
          role: "admin", // Default role
        })

        if (profileError) {
          return { error: profileError, user: null }
        }
      }

      return { error: null, user: data.user }
    } catch (error) {
      console.error("Error in signUp:", error)
      return { error, user: null }
    }
  }

  // Sign out function
  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    router.push("/login")
  }

  // Refresh session
  const refreshSession = async () => {
    setIsLoading(true)
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        const profile = await fetchProfile(session.user.id)

        setUser({
          id: session.user.id,
          email: session.user.email || "",
          full_name: profile?.full_name,
          avatar_url: profile?.avatar_url,
          role: profile?.role,
        })

        setProfile(profile)
      } else {
        setUser(null)
        setProfile(null)
      }
    } catch (error) {
      console.error("Error refreshing session:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        signIn,
        signUp,
        signOut,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
