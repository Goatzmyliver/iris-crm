import { v4 as uuidv4 } from "uuid"

// Replace any imports from '@supabase/auth-helpers-nextjs' with our custom implementation
// import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

export default async function NewQuotePage() {
  const quoteId = uuidv4()

  // Your existing code using the supabase client
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">New Quote</h1>
      <p>Quote ID: {quoteId}</p>
    </div>
  )
}

