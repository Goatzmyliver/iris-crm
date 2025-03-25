import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarClock, ClipboardList, DollarSign, Users } from "lucide-react"

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch counts for dashboard
  const [
    { count: customersCount },
    { count: quotesCount },
    { count: jobsCount },
    { data: recentQuotes },
    { data: upcomingJobs },
  ] = await Promise.all([
    supabase.from("customers").select("*", { count: "exact", head: true }),
    supabase.from("quotes").select("*", { count: "exact", head: true }),
    supabase.from("jobs").select("*", { count: "exact", head: true }),
    supabase.from("quotes").select("*, customers(full_name)").order("created_at", { ascending: false }).limit(5),
    supabase
      .from("jobs")
      .select("*, customers(full_name)")
      .eq("status", "scheduled")
      .order("scheduled_date", { ascending: true })
      .limit(5),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/quotes/new">New Quote</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/customers/new">New Customer</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customersCount || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Quotes</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quotesCount || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Jobs</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobsCount || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,780</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Quotes</CardTitle>
            <CardDescription>Latest quotes created in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentQuotes?.length ? (
                recentQuotes.map((quote: any) => (
                  <div key={quote.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{quote.customers?.full_name || "Unknown Customer"}</p>
                      <p className="text-sm text-muted-foreground">
                        ${quote.total_amount} - {quote.status}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/quotes/${quote.id}`}>View</Link>
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent quotes</p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Jobs</CardTitle>
            <CardDescription>Jobs scheduled for installation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingJobs?.length ? (
                upcomingJobs.map((job: any) => (
                  <div key={job.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{job.customers?.full_name || "Unknown Customer"}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(job.scheduled_date).toLocaleDateString()} - {job.status}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/jobs/${job.id}`}>View</Link>
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No upcoming jobs</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

