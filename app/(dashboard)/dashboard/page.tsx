import { createServerComponentClient } from "@/lib/supabase"
import DashboardStats from "@/components/dashboard-stats"
import RecentEnquiries from "@/components/recent-enquiries"
import RecentCustomers from "@/components/recent-customers"

export default async function DashboardPage() {
  const supabase = createServerComponentClient()

  // Fetch stats data
  const { count: customersCount } = await supabase.from("customers").select("*", { count: "exact", head: true })

  const { count: activeEnquiries } = await supabase
    .from("enquiries")
    .select("*", { count: "exact", head: true })
    .eq("status", "new")

  const { data: quotesData } = await supabase.from("quotes").select("total")

  const quotesValue = quotesData?.reduce((sum, quote) => sum + Number.parseFloat(quote.total), 0) || 0

  const { count: jobsCount } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .eq("status", "scheduled")

    // Fetch recent data  { count: 'exact', head: true })
    .eq("status", "scheduled")

  // Fetch recent data
  const { data: recentEnquiries } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: recentCustomers } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  const stats = {
    customersCount: customersCount || 0,
    activeEnquiries: activeEnquiries || 0,
    quotesValue,
    jobsCount: jobsCount || 0,
  }

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="space-y-6">
        <DashboardStats stats={stats} />

        <div className="grid gap-6 md:grid-cols-2">
          <RecentEnquiries enquiries={recentEnquiries || []} />
          <RecentCustomers customers={recentCustomers || []} />
        </div>
      </div>
    </div>
  )
}

