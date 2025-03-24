import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { ConvertToCustomerForm } from "@/components/convert-to-customer-form"

export const metadata: Metadata = {
  title: "Convert to Customer | Iris CRM",
  description: "Convert an enquiry to a customer",
}

interface ConvertToCustomerPageProps {
  params: {
    id: string
  }
}

export default async function ConvertToCustomerPage({ params }: ConvertToCustomerPageProps) {
  const supabase = createServerComponentClient({ cookies })

  // Fetch enquiry details
  const { data: enquiry } = await supabase.from("enquiries").select("*").eq("id", params.id).single()

  if (!enquiry) {
    notFound()
  }

  // If already converted, redirect to customer page
  if (enquiry.converted_to_customer_id) {
    redirect(`/customers/${enquiry.converted_to_customer_id}`)
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading={`Convert ${enquiry.name} to Customer`}
        description="Create a new customer record from this enquiry"
      />
      <ConvertToCustomerForm enquiry={enquiry} />
    </DashboardShell>
  )
}

