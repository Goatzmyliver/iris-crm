import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { EditCustomerForm } from "@/components/edit-customer-form"

export const metadata: Metadata = {
  title: "Edit Customer | Iris CRM",
  description: "Edit customer details",
}

interface EditCustomerPageProps {
  params: {
    id: string
  }
}

export default async function EditCustomerPage({ params }: EditCustomerPageProps) {
  const supabase = createServerComponentClient({ cookies })

  // Fetch customer details
  const { data: customer } = await supabase.from("customers").select("*").eq("id", params.id).single()

  if (!customer) {
    notFound()
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Edit Customer" description={`Edit details for ${customer.name}`} />
      <div className="grid gap-8">
        <EditCustomerForm customer={customer} />
      </div>
    </DashboardShell>
  )
}

