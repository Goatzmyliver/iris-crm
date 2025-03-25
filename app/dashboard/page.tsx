import DashboardStats from "@/components/dashboard-stats"
import RecentEnquiries from "@/components/recent-enquiries"
import RecentCustomers from "@/components/recent-customers"

export default async function DashboardPage() {
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="space-y-6">
        <DashboardStats />

        <div className="grid gap-6 md:grid-cols-2">
          <RecentEnquiries />
          <RecentCustomers />
        </div>
      </div>
    </div>
  )
}

