import type React from "react"
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Iris CRM</h1>
          <p className="text-muted-foreground">A modern CRM system for small businesses</p>
        </div>
        {children}
      </div>
    </div>
  )
}

