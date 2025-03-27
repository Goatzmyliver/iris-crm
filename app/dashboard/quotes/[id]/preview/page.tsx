import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { QuotePreview } from "@/components/quotes/quote-preview"

export const metadata = {
  title: "Quote Preview - Iris CRM",
  description: "Preview quote for customer",
}

export default async function QuotePreviewPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })

  // Fetch the quote with its line items and customer
  const { data: quote } = await supabase
    .from("quotes")
    .select(`
      *,
      quote_items (*),
      customers (*)
    `)
    .eq("id", params.id)
    .single()

  if (!quote) {
    notFound()
  }

  // Fetch company details
  const { data: companySettings } = await supabase.from("company_settings").select("*").single()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Quote Preview</h2>
        <p className="text-muted-foreground">Preview quote #{quote.quote_number} as it will appear to the customer</p>
      </div>

      <QuotePreview quote={quote} companySettings={companySettings || {}} />
    </div>
  )
}

