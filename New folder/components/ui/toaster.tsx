"use client"

import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function Toaster() {
  const { toasts, dismiss } = useToast()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed top-0 right-0 z-50 flex flex-col gap-2 p-4 max-w-md w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-start justify-between p-4 rounded-md shadow-md transition-all transform translate-x-0 opacity-100",
            toast.open ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
            toast.variant === "destructive" ? "bg-destructive text-destructive-foreground" : "bg-background border",
          )}
        >
          <div className="grid gap-1">
            {toast.title && <div className="font-medium">{toast.title}</div>}
            {toast.description && <div className="text-sm opacity-90">{toast.description}</div>}
          </div>
          <button onClick={() => dismiss(toast.id)} className="ml-4 rounded-full p-1 hover:bg-muted">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>
      ))}
    </div>
  )
}
