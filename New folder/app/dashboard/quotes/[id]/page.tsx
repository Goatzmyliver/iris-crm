import { QuoteForm } from "@/components/quotes/quote-form"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"

export const metadata = {
  title: "Edit Quote - Iris CRM",
  description: "Edit quote details",
}

export default async function EditQuotePage(props: any) {
  const id = props.params.id
  const supabase = createServerComponentClient({ cookies })

  // Fetch the quote
  const { data: quote } = await supabase.from("quotes").select("*, customer:customers(*)").eq("id", id).single()

  if (!quote) {
    notFound()
  }

  // Fetch customers for the dropdown
  const { data: customers } = await supabase.from("customers").select("*").order("full_name", { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Edit Quote</h2>
        <p className="text-muted-foreground">Update details for Quote #{quote.quote_number}</p>
      </div>

      <QuoteForm quote={quote} customers={customers || []} />
    </div>
  )
}
