import type { Metadata } from "next"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { CustomersTable } from "@/components/customers-table"

export const metadata: Metadata = {
  title: "Customers | Iris CRM",
  description: "Manage your customer relationships",
}

export default async function CustomersPage() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch customers
  const { data: customers } = await supabase.from("customers").select("*").order("created_at", { ascending: false })

  return (
    <DashboardShell>
      <DashboardHeader heading="Customers" description="Manage your customer relationships">
        <Button asChild>
          <Link href="/customers/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Customer
          </Link>
        </Button>
      </DashboardHeader>
      <CustomersTable customers={customers || []} />
    </DashboardShell>
  )
}

