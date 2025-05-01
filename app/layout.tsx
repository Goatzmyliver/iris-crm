import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"

import { AuthProvider } from "@/lib/auth-provider"
import { NotificationService } from "@/components/notifications/notification-service"
import { ThemeProvider } from "@/components/theme-provider"

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Iris CRM",
  description: "Complete customer relationship management for service businesses",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <NotificationService>
              {children}
              <Toaster position="top-right" />
            </NotificationService>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
