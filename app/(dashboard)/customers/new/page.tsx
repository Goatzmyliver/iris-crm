import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { NewCustomerForm } from "@/components/new-customer-form"

export const metadata: Metadata = {
  title: "New Customer | Iris CRM",
  description: "Add a new customer to your CRM",
}

export default function NewCustomerPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="New Customer" description="Add a new customer to your CRM" />
      <div className="grid gap-8">
        <NewCustomerForm />
      </div>
    </DashboardShell>
  )
}

