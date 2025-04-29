"use client"

// Adapted from shadcn/ui toast component
import { useState, useEffect, useCallback } from "react"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
}

type Toast = ToastProps & {
  id: string
  open: boolean
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(({ title, description, variant = "default", duration = 5000 }: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: Toast = {
      id,
      title,
      description,
      variant,
      duration,
      open: true,
    }

    setToasts((prevToasts) => [...prevToasts, newToast])

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prevToasts) => prevToasts.map((t) => (t.id === id ? { ...t, open: false } : t)))
      }, duration)
    }

    return id
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.map((t) => (t.id === id ? { ...t, open: false } : t)))
  }, [])

  useEffect(() => {
    const closedToasts = toasts.filter((t) => !t.open)
    if (closedToasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prevToasts) => prevToasts.filter((t) => t.open))
      }, 300) // Animation duration
      return () => clearTimeout(timer)
    }
  }, [toasts])

  return { toast, dismiss, toasts }
}
