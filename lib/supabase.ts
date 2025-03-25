import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for interacting with your database
export const createClientComponentClient = () => {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "")
}

export const createServerComponentClient = () => {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "")
}

