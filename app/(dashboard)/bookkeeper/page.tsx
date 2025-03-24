import type { Metadata } from "next"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { BookkeeperView } from "@/components/bookkeeper-view"

export const metadata: Metadata = {
  title: "Bookkeeper View | Iris CRM",
  description: "View quotes ready for invoicing in MYOB",
}

export default async function BookkeeperPage() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch quotes that are ready for invoicing
  const { data: readyForInvoicingQuotes } = await supabase
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
    .eq("status", "ready_for_invoicing")
    .order("created_at", { ascending: false })

  return (
    <DashboardShell>
      <DashboardHeader heading="Bookkeeper View" description="Manage quotes ready for invoicing in MYOB" />
      <BookkeeperView quotes={readyForInvoicingQuotes || []} />
    </DashboardShell>
  )
}

