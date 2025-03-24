import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { NewQuoteForm } from "@/components/new-quote-form"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export const metadata: Metadata = {
  title: "New Quote | Iris CRM",
  description: "Create a new quote or proposal",
}

export default async function NewQuotePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createServerComponentClient({ cookies })

  // Get customer ID from query params if available
  const customerId = typeof searchParams.customer === "string" ? Number.parseInt(searchParams.customer) : undefined

  // If customer ID is provided, fetch customer details
  let customer = null
  if (customerId) {
    const { data } = await supabase.from("customers").select("*").eq("id", customerId).single()
    customer = data
  }

  // Fetch all customers for dropdown
  const { data: customers } = await supabase.from("customers").select("id, name").order("name")

  return (
    <DashboardShell>
      <DashboardHeader heading="New Quote" description="Create a new quote or proposal" />
      <div className="grid gap-8">
        <NewQuoteForm selectedCustomer={customer} customers={customers || []} />
      </div>
    </DashboardShell>
  )
}

