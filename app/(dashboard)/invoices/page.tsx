import type { Metadata } from "next"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { InvoicesTable } from "@/components/invoices-table"

export const metadata: Metadata = {
  title: "Invoices | Iris CRM",
  description: "Manage your invoices and payments",
}

export default async function InvoicesPage() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch invoices with customer information
  const { data: invoices } = await supabase
    .from("invoices")
    .select(`
      *,
      customers (
        id,
        name,
        email
      ),
      quotes (
        id,
        name
      )
    `)
    .order("created_at", { ascending: false })

  return (
    <DashboardShell>
      <DashboardHeader heading="Invoices" description="Manage your invoices and payments">
        <Button asChild>
          <Link href="/invoices/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Invoice
          </Link>
        </Button>
      </DashboardHeader>
      <InvoicesTable invoices={invoices || []} />
    </DashboardShell>
  )
}

