"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClientComponentClient } from "@/lib/supabase"
import { toast } from "sonner"

interface UserNavProps {
  user: {
    email: string
    name?: string
  }
}

export function UserNav({ user }: UserNavProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const supabase = createClientComponentClient()

  // Safely get initials, handling potential undefined values
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0] || "")
        .join("")
        .toUpperCase()
    : user.email.substring(0, 2).toUpperCase()

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true)
      await supabase.auth.signOut()
      toast.success("Signed out successfully")
      router.push("/login")
      router.refresh()
    } catch (error) {
      toast.error("Error signing out")
      console.error(error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" alt={user.email} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/settings")}>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={isLoggingOut} onClick={handleSignOut}>
          {isLoggingOut ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

