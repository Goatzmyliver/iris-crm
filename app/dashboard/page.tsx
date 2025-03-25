import { DashboardStats } from "@/components/dashboard-stats"
import { RecentEnquiries } from "@/components/recent-enquiries"
import { RecentCustomers } from "@/components/recent-customers"

export const metadata = {
  title: "Dashboard | Iris CRM",
}

export default async function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <DashboardStats />
      <div className="grid gap-6 md:grid-cols-2">
        <RecentEnquiries />
        <RecentCustomers />
      </div>
    </div>
  )
}

