import { QuoteForm } from "@/components/quotes/quote-form"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"

export const metadata = {
  title: "Edit Quote - Iris CRM",
  description: "Edit an existing quote",
}

export default async function EditQuotePage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })

  // Fetch the quote with its line items
  const { data: quote } = await supabase
    .from("quotes")
    .select(`
      *,
      quote_items (*)
    `)
    .eq("id", params.id)
    .single()

  if (!quote) {
    notFound()
  }

  // Fetch customers for the dropdown
  const { data: customers } = await supabase
    .from("customers")
    .select("id, full_name, email, phone, address")
    .order("full_name", { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Edit Quote</h2>
        <p className="text-muted-foreground">Update quote #{quote.quote_number}</p>
      </div>

      <QuoteForm customers={customers || []} quote={quote} />
    </div>
  )
}

