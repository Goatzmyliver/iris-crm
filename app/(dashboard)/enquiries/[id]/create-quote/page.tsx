import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { CreateQuoteForm } from "@/components/create-quote-form"

export const metadata: Metadata = {
  title: "Create Quote | Iris CRM",
  description: "Create a quote from an enquiry",
}

interface CreateQuotePageProps {
  params: {
    id: string
  }
}

export default async function CreateQuotePage({ params }: CreateQuotePageProps) {
  const supabase = createServerComponentClient({ cookies })

  // Fetch enquiry details
  const { data: enquiry } = await supabase
    .from("enquiries")
    .select("*, converted_to_customer_id")
    .eq("id", params.id)
    .single()

  if (!enquiry) {
    notFound()
  }

  // If enquiry has been converted to a customer, fetch customer details
  let customer = null
  if (enquiry.converted_to_customer_id) {
    const { data } = await supabase.from("customers").select("*").eq("id", enquiry.converted_to_customer_id).single()

    customer = data
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Create Quote" description={`Create a quote for ${enquiry.name}`} />
      <CreateQuoteForm enquiry={enquiry} customer={customer} />
    </DashboardShell>
  )
}

