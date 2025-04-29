import { QuoteForm } from "@/components/quotes/quote-form"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export const metadata = {
  title: "Create Quote - Iris CRM",
  description: "Create a new quote",
}

export default async function NewQuotePage() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch customers for the dropdown
  const { data: customers } = await supabase
    .from("customers")
    .select("id, full_name, email, phone, address")
    .order("full_name", { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Create Quote</h2>
        <p className="text-muted-foreground">Create a new quote for your customer</p>
      </div>

      <QuoteForm customers={customers || []} />
    </div>
  )
}
