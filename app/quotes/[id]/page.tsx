// Replace any imports from '@supabase/auth-helpers-nextjs' with our custom implementation
// import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

export default async function QuoteDetailPage({ params }: { params: { id: string } }) {
  // Your existing code using the supabase client
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Quote Details</h1>
      <p>Quote ID: {params.id}</p>
    </div>
  )
}

