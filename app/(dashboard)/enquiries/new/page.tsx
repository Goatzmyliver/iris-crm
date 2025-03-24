import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { NewEnquiryForm } from "@/components/new-enquiry-form"

export const metadata: Metadata = {
  title: "New Enquiry | Iris CRM",
  description: "Create a new enquiry",
}

export default function NewEnquiryPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="New Enquiry" description="Create a new enquiry in the system" />
      <div className="grid gap-8">
        <NewEnquiryForm />
      </div>
    </DashboardShell>
  )
}

