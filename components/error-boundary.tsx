"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Caught in error boundary:", event.error)
      setError(event.error)
      setHasError(true)
      event.preventDefault()
    }

    window.addEventListener("error", handleError)
    return () => window.removeEventListener("error", handleError)
  }, [])

  if (hasError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg border p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-red-600">Something went wrong</h2>
          <div className="mb-4 rounded bg-gray-100 p-3 text-sm">
            <p className="font-mono">{error?.message || "An unknown error occurred"}</p>
          </div>
          <Button
            onClick={() => {
              setHasError(false)
              setError(null)
              window.location.href = "/dashboard"
            }}
          >
            Try again
          </Button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

