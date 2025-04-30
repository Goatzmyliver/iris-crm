import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserProfile } from "@/lib/auth"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { DollarSign, Users, Briefcase, Calendar } from "lucide-react"

export default async function DashboardPage() {
  const profile = await getUserProfile()
  const supabase = createServerSupabaseClient()

  // Fetch dashboard data
  const { data: customers } = await supabase
    .from("customers")
    .select("*")
    .eq("user_id", profile?.id)
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: jobs } = await supabase
    .from("jobs")
    .select("*, customers(name)")
    .eq("user_id", profile?.id)
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: customerCount } = await supabase
    .from("customers")
    .select("id", { count: "exact", head: true })
    .eq("user_id", profile?.id)

  const { data: jobCount } = await supabase
    .from("jobs")
    .select("id", { count: "exact", head: true })
    .eq("user_id", profile?.id)

  const { data: totalRevenue } = await supabase
    .from("jobs")
    .select("total_amount")
    .eq("user_id", profile?.id)
    .eq("status", "completed")

  const { data: upcomingJobs } = await supabase
    .from("jobs")
    .select("*, customers(name)")
    .eq("user_id", profile?.id)
    .eq("status", "scheduled")
    .gte("scheduled_date", new Date().toISOString())
    .order("scheduled_date", { ascending: true })
    .limit(5)

  // Calculate total revenue
  const revenue = totalRevenue?.reduce((sum, job) => sum + (job.total_amount || 0), 0) || 0

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {profile?.full_name || "User"}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From completed jobs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerCount?.count || 0}</div>
            <p className="text-xs text-muted-foreground">Total customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobCount?.count || 0}</div>
            <p className="text-xs text-muted-foreground">Total jobs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingJobs?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Scheduled jobs</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent">
        <TabsList>
          <TabsTrigger value="recent">Recent Jobs</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Schedule</TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Jobs</CardTitle>
              <CardDescription>Your most recent jobs and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobs?.length ? (
                  jobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{job.title}</p>
                        <p className="text-sm text-muted-foreground">{job.customers?.name}</p>
                      </div>
                      <div>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            job.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : job.status === "in_progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {job.status === "in_progress"
                            ? "In Progress"
                            : job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No recent jobs found.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Schedule</CardTitle>
              <CardDescription>Your upcoming scheduled jobs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingJobs?.length ? (
                  upcomingJobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{job.title}</p>
                        <p className="text-sm text-muted-foreground">{job.customers?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm">{new Date(job.scheduled_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No upcoming jobs scheduled.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
