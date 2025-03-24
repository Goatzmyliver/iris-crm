import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { CustomerDetails } from "@/components/customer-details"

export const metadata: Metadata = {
  title: "Customer Details | Iris CRM",
  description: "View and manage customer details",
}

interface CustomerPageProps {
  params: {
    id: string
  }
}

export default async function CustomerPage({ params }: CustomerPageProps) {
  const supabase = createServerComponentClient({ cookies })

  // Fetch customer details
  const { data: customer } = await supabase.from("customers").select("*").eq("id", params.id).single()

  if (!customer) {
    notFound()
  }

  // Fetch related quotes
  const { data: quotes } = await supabase
    .from("quotes")
    .select("*")
    .eq("customer_id", customer.id)
    .order("created_at", { ascending: false })

  // Fetch related invoices
  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("customer_id", customer.id)
    .order("created_at", { ascending: false })

  return (
    <DashboardShell>
      <DashboardHeader heading={customer.name} description={`Customer ID: ${customer.id}`} />
      <CustomerDetails customer={customer} quotes={quotes || []} invoices={invoices || []} />
    </DashboardShell>
  )
}

