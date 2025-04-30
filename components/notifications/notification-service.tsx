"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/auth-provider"
import { supabase } from "@/lib/supabase"

export function NotificationService({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!user || initialized) return

    // Set up real-time notifications from Supabase
    const channel = supabase
      .channel("public:notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const notification = payload.new as any

          // Show notification in UI
          toast(notification.title, {
            description: notification.message,
          })

          // If notification requires SMS, send it
          if (notification.send_sms && user.phone) {
            api
              .sendSms(user.phone, notification.message)
              .catch((error) => console.error("Failed to send SMS notification:", error))
          }

          // If notification requires email, send it
          if (notification.send_email && user.email) {
            api
              .sendEmail(user.email, notification.title, notification.message)
              .catch((error) => console.error("Failed to send email notification:", error))
          }
        },
      )
      .subscribe()

    setInitialized(true)

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, initialized])

  return <>{children}</>
}
