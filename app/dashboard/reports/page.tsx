import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { ReportsOverview } from "@/components/reports/reports-overview"

export const metadata = {
  title: "Reports - Iris CRM",
  description: "Business performance reports and analytics",
}

export default async function ReportsPage() {
  const supabase = createServerComponentClient({ cookies })

  // Get current date and first day of current month
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  // Fetch monthly job stats
  const { data: monthlyJobStats } = await supabase
    .from("jobs")
    .select("status")
    .gte("created_at", firstDayOfMonth.toISOString())

  // Fetch monthly quote stats
  const { data: monthlyQuoteStats } = await supabase
    .from("quotes")
    .select("status, total_amount")
    .gte("created_at", firstDayOfMonth.toISOString())

  // Calculate job statistics
  const jobStats = {
    total: monthlyJobStats?.length || 0,
    completed: monthlyJobStats?.filter((job) => job.status === "completed").length || 0,
    inProgress: monthlyJobStats?.filter((job) => job.status === "in_progress").length || 0,
    scheduled: monthlyJobStats?.filter((job) => job.status === "scheduled").length || 0,
  }

  // Calculate quote statistics
  const quoteStats = {
    total: monthlyQuoteStats?.length || 0,
    accepted: monthlyQuoteStats?.filter((quote) => quote.status === "accepted").length || 0,
    sent: monthlyQuoteStats?.filter((quote) => quote.status === "sent").length || 0,
    totalValue: monthlyQuoteStats?.reduce((sum, quote) => sum + (quote.total_amount || 0), 0) || 0,
    acceptedValue:
      monthlyQuoteStats
        ?.filter((quote) => quote.status === "accepted")
        .reduce((sum, quote) => sum + (quote.total_amount || 0), 0) || 0,
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
        <p className="text-muted-foreground">Business performance reports and analytics</p>
      </div>

      <ReportsOverview jobStats={jobStats} quoteStats={quoteStats} />
    </div>
  )
}
