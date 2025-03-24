import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { EnquiryDetails } from "@/components/enquiry-details"

export const metadata: Metadata = {
  title: "Enquiry Details | Iris CRM",
  description: "View and manage enquiry details",
}

interface EnquiryPageProps {
  params: {
    id: string
  }
}

export default async function EnquiryPage({ params }: EnquiryPageProps) {
  const supabase = createServerComponentClient({ cookies })

  // Fetch enquiry details
  const { data: enquiry } = await supabase.from("enquiries").select("*").eq("id", params.id).single()

  if (!enquiry) {
    notFound()
  }

  return (
    <DashboardShell>
      <DashboardHeader heading={`Enquiry from ${enquiry.name}`} description={`Enquiry ID: ${enquiry.id}`} />
      <EnquiryDetails enquiry={enquiry} />
    </DashboardShell>
  )
}

