import type { Metadata } from "next"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { RecentActivity } from "@/components/recent-activity"
import { StatsCards } from "@/components/stats-cards"
import { TasksList } from "@/components/tasks-list"
import { QuickActions } from "@/components/quick-actions"

export const metadata: Metadata = {
  title: "Dashboard | Iris CRM",
  description: "Overview of your CRM activities",
}

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch data for dashboard
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch recent quotes
  const { data: recentQuotes } = await supabase
    .from("quotes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  // Fetch customers that need follow-up
  const { data: customersNeedingFollowUp } = await supabase.from("customers").select("*").eq("stage", "lead").limit(3)

  // Fetch quotes needing follow-up
  const { data: quotesNeedingFollowUp } = await supabase
    .from("quotes")
    .select("*, customers(name)")
    .eq("status", "sent")
    .limit(3)

  // Fetch recent enquiries
  const { data: recentEnquiries } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3)

  // Calculate stats
  const { data: customerCount } = await supabase.from("customers").select("id", { count: "exact", head: true })

  const { data: quoteCount } = await supabase.from("quotes").select("id", { count: "exact", head: true })

  const { data: invoiceCount } = await supabase.from("invoices").select("id", { count: "exact", head: true })

  const { data: enquiryCount } = await supabase.from("enquiries").select("id", { count: "exact", head: true })

  const stats = [
    {
      name: "Total Customers",
      value: customerCount?.count || 0,
    },
    {
      name: "Active Quotes",
      value: quoteCount?.count || 0,
    },
    {
      name: "Invoices",
      value: invoiceCount?.count || 0,
    },
    {
      name: "New Enquiries",
      value: enquiryCount?.count || 0,
    },
  ]

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" description="Overview of your CRM activities" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCards stats={stats} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <TasksList
          className="lg:col-span-4"
          quotesNeedingFollowUp={quotesNeedingFollowUp || []}
          recentEnquiries={recentEnquiries || []}
        />
        <div className="space-y-4 lg:col-span-3">
          <QuickActions />
          <RecentActivity recentQuotes={recentQuotes || []} recentEnquiries={recentEnquiries || []} />
        </div>
      </div>
    </DashboardShell>
  )
}

