import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, CheckCircle, Clock, Users } from "lucide-react"

export const metadata = {
  title: "Dashboard - Iris CRM",
  description: "Overview of your business",
}

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch stats
  const { data: customerCount } = await supabase.from("customers").select("id", { count: "exact", head: true })
  const { data: jobsThisMonth } = await supabase
    .from("jobs")
    .select("id", { count: "exact", head: true })
    .gte("scheduled_date", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
    .lte("scheduled_date", new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString())
  const { data: completedJobs } = await supabase
    .from("jobs")
    .select("id", { count: "exact", head: true })
    .eq("status", "completed")
  const { data: pendingJobs } = await supabase
    .from("jobs")
    .select("id", { count: "exact", head: true })
    .eq("status", "scheduled")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your business</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerCount?.count || 0}</div>
            <p className="text-xs text-muted-foreground">Active customers in your database</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs This Month</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobsThisMonth?.count || 0}</div>
            <p className="text-xs text-muted-foreground">Total jobs scheduled this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedJobs?.count || 0}</div>
            <p className="text-xs text-muted-foreground">Total completed jobs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Jobs</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingJobs?.count || 0}</div>
            <p className="text-xs text-muted-foreground">Jobs waiting to be completed</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
