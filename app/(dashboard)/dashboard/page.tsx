import { createServerComponentClient } from "@/lib/supabase"
import DashboardStats from "@/components/dashboard-stats"
import RecentEnquiries from "@/components/recent-enquiries"
import RecentCustomers from "@/components/recent-customers"

export default async function DashboardPage() {
  const supabase = createServerComponentClient()

  // Fetch stats data - with error handling
  let customersCount = 0
  let activeEnquiries = 0
  let quotesValue = 0
  let jobsCount = 0
  let recentEnquiries = []
  let recentCustomers = []

  try {
    // Fetch customers count
    const { count: fetchedCustomersCount, error: customersError } = await supabase
      .from("customers")
      .select("*", { count: "exact", head: true })

    if (!customersError) customersCount = fetchedCustomersCount || 0

    // Fetch active enquiries
    const { count: fetchedActiveEnquiries, error: enquiriesError } = await supabase
      .from("enquiries")
      .select("*", { count: "exact", head: true })
      .eq("status", "new")

    if (!enquiriesError) activeEnquiries = fetchedActiveEnquiries || 0

    // Fetch quotes data
    const { data: quotesData, error: quotesError } = await supabase.from("quotes").select("total")

    if (!quotesError && quotesData) {
      quotesValue = quotesData.reduce((sum, quote) => sum + Number.parseFloat(quote.total || "0"), 0)
    }

    // Fetch jobs count
    const { count: fetchedJobsCount, error: jobsError } = await supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("status", "scheduled")

    if (!jobsError) jobsCount = fetchedJobsCount || 0

    // Fetch recent data
    const { data: fetchedRecentEnquiries } = await supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5)

    if (fetchedRecentEnquiries) recentEnquiries = fetchedRecentEnquiries

    const { data: fetchedRecentCustomers } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5)

    if (fetchedRecentCustomers) recentCustomers = fetchedRecentCustomers
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
  }

  const stats = {
    customersCount,
    activeEnquiries,
    quotesValue,
    jobsCount,
  }

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="space-y-6">
        <DashboardStats stats={stats} />

        <div className="grid gap-6 md:grid-cols-2">
          <RecentEnquiries enquiries={recentEnquiries} />
          <RecentCustomers customers={recentCustomers} />
        </div>
      </div>
    </div>
  )
}

