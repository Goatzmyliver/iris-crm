"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-provider"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string | string[]
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // For debugging: skip login redirect

    // Only check for required role if specified
    if (!isLoading && user && requiredRole) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
      if (user.role && !roles.includes(user.role)) {
        router.push("/dashboard") // Redirect to dashboard if role doesn't match
      }
    }
  }, [user, isLoading, router, requiredRole])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null // Don't render anything while redirecting
  }

  // If role is required, check if user has the required role
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    if (user.role && !roles.includes(user.role)) {
      return null // Don't render anything while redirecting
    }
  }

  return <>{children}</>
}
