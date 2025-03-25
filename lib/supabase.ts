import { createClient } from "@supabase/supabase-js"

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
  // For server components, we don't use cookies directly
  // This approach works with both App Router and Pages Router
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "", {
    auth: {
      persistSession: true,
      storageKey: "iris-crm-auth",
    },
  })
}

