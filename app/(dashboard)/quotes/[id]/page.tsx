import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { QuoteDetails } from "@/components/quote-details"

export const metadata: Metadata = {
  title: "Quote Details | Iris CRM",
  description: "View and manage quote details",
}

interface QuotePageProps {
  params: {
    id: string
  }
}

export default async function QuotePage({ params }: QuotePageProps) {
  const supabase = createServerComponentClient({ cookies })

  // Fetch quote details with customer information
  const { data: quote } = await supabase
    .from("quotes")
    .select(`
      *,
      customers (
        id,
        name,
        email,
        phone,
        address,
        city,
        region,
        postal_code,
        country
      )
    `)
    .eq("id", params.id)
    .single()

  if (!quote) {
    notFound()
  }

  // Fetch related invoices
  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("quote_id", quote.id)
    .order("created_at", { ascending: false })

  return (
    <DashboardShell>
      <DashboardHeader heading={quote.name} description={`Quote for ${quote.customers?.name || "Unknown Customer"}`} />
      <QuoteDetails quote={quote} invoices={invoices || []} />
    </DashboardShell>
  )
}

