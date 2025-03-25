import { createServerComponentClient } from "@/lib/supabase"
import DashboardStats from "@/components/dashboard-stats"
import RecentEnquiries from "@/components/recent-enquiries"
import RecentCustomers from "@/components/recent-customers"

export default async function DashboardPage() {
  const supabase = createServerComponentClient()

  // Initialize with safe default values
  const stats = {
    customersCount: 0,
    activeEnquiries: 0,
    quotesValue: 0,
    jobsCount: 0,
  }

  let recentEnquiries: any[] = []
  let recentCustomers: any[] = []

  try {
    // Safely fetch customers count
    try {
      const { count } = await supabase.from("customers").select("*", { count: "exact", head: true })

      if (count !== null) {
        stats.customersCount = count
      }
    } catch (error) {
      console.error("Error fetching customers count:", error)
    }

    // Safely fetch active enquiries
    try {
      const { count } = await supabase.from("enquiries").select("*", { count: "exact", head: true }).eq("status", "new")

      if (count !== null) {
        stats.activeEnquiries = count
      }
    } catch (error) {
      console.error("Error fetching active enquiries:", error)
    }

    // Safely fetch quotes value
    try {
      const { data: quotesData } = await supabase.from("quotes").select("amount")

      if (quotesData && Array.isArray(quotesData)) {
        stats.quotesValue = quotesData.reduce((sum, quote) => {
          const amount = Number.parseFloat(quote.amount || "0")
          return isNaN(amount) ? sum : sum + amount
        }, 0)
      }
    } catch (error) {
      console.error("Error fetching quotes value:", error)
    }

    // Safely fetch jobs count
    try {
      const { count } = await supabase
        .from("jobs")
        .select("*", { count: "exact", head: true })
        .eq("status", "scheduled")

      if (count !== null) {
        stats.jobsCount = count
      }
    } catch (error) {
      console.error("Error fetching jobs count:", error)
      // Table might not exist yet, which is fine
    }

    // Safely fetch recent enquiries
    try {
      const { data } = await supabase.from("enquiries").select("*").order("created_at", { ascending: false }).limit(5)

      if (data) {
        recentEnquiries = data
      }
    } catch (error) {
      console.error("Error fetching recent enquiries:", error)
    }

    // Safely fetch recent customers
    try {
      const { data } = await supabase.from("customers").select("*").order("created_at", { ascending: false }).limit(5)

      if (data) {
        recentCustomers = data
      }
    } catch (error) {
      console.error("Error fetching recent customers:", error)
    }
  } catch (error) {
    console.error("Error in dashboard page:", error)
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

