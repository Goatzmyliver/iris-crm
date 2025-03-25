import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// Create a single supabase client for interacting with your database
export const createClientComponentClient = () => {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "", {
    auth: {
      persistSession: true,
      storageKey: "iris-crm-auth",
    },
  })
}

export const createServerComponentClient = () => {
  const cookieStore = cookies()

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "", {
    auth: {
      persistSession: true,
      storageKey: "iris-crm-auth",
      // Use cookies for server components
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    },
  })
}

