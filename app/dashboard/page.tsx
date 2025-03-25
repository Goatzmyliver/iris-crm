"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import {
  DollarSign,
  Users,
  Calendar,
  Clock,
  ArrowRight,
  PlusCircle,
  FileText,
  BarChart3,
  UserPlus,
  ClipboardList,
  CalendarPlus,
} from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { RecentActivityFeed } from "@/components/dashboard/recent-activity-feed"
import { QuotesOverviewChart } from "@/components/dashboard/quotes-overview-chart"
import { TasksList } from "@/components/dashboard/tasks-list"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const [stats, setStats] = useState({
    totalCustomers: 0,
    myCustomers: 0,
    activeQuotes: 0,
    myQuotes: 0,
    scheduledJobs: 0,
    myJobs: 0,
    lowStock: 0,
    quotesThisMonth: 0,
    quotesLastMonth: 0,
    revenueThisMonth: 0,
    revenueLastMonth: 0,
    conversionRate: 0,
  })
  const [upcomingJobs, setUpcomingJobs] = useState<any[]>([])
  const [recentQuotes, setRecentQuotes] = useState<any[]>([])
  const [recentCustomers, setRecentCustomers] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) return

        // Get user profile data
        const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

        setUserData(userData || { name: user.email?.split("@")[0], email: user.email })

        // In a real app, you would fetch actual data from Supabase
        // For now, we'll use dummy data
        setStats({
          totalCustomers: 42,
          myCustomers: 18,
          activeQuotes: 15,
          myQuotes: 7,
          scheduledJobs: 9,
          myJobs: 4,
          lowStock: 3,
          quotesThisMonth: 12,
          quotesLastMonth: 9,
          revenueThisMonth: 24500,
          revenueLastMonth: 18750,
          conversionRate: 65,
        })

        // Filter upcoming jobs to only show those assigned to the current user
        // In a real implementation, this would be a database query
        const allJobs = [
          {
            id: "J-2025-001",
            customer: "Sarah Johnson",
            address: "456 High St, Wellington",
            date: "2025-03-22",
            time: "9:00 AM - 12:00 PM",
            status: "confirmed",
            assigned_user_id: user.id,
            type: "Installation",
          },
          {
            id: "J-2025-002",
            customer: "Michael Brown",
            address: "789 Park Ave, Christchurch",
            date: "2025-03-24",
            time: "1:00 PM - 4:00 PM",
            status: "confirmed",
            assigned_user_id: "some-other-id",
            type: "Repair",
          },
          {
            id: "J-2025-003",
            customer: "Emily Davis",
            address: "321 Beach Rd, Auckland",
            date: "2025-03-25",
            time: "10:00 AM - 2:00 PM",
            status: "pending",
            assigned_user_id: user.id,
            type: "Measurement",
          },
          {
            id: "J-2025-004",
            customer: "Robert Wilson",
            address: "567 Queen St, Auckland",
            date: "2025-03-26",
            time: "9:00 AM - 11:00 AM",
            status: "confirmed",
            assigned_user_id: user.id,
            type: "Consultation",
          },
        ]

        // Filter to show only jobs assigned to the current user
        setUpcomingJobs(allJobs.filter((job) => job.assigned_user_id === user.id))

        // Recent quotes
        setRecentQuotes(
          [
            {
              id: "Q-2025-001",
              customer: "John Smith",
              amount: 1250,
              date: "2025-03-20",
              status: "sent",
              assigned_user_id: user.id,
            },
            {
              id: "Q-2025-003",
              customer: "Michael Brown",
              amount: 2340,
              date: "2025-03-19",
              status: "draft",
              assigned_user_id: user.id,
            },
            {
              id: "Q-2025-002",
              customer: "Robert Wilson",
              amount: 4250,
              date: "2025-03-18",
              status: "approved",
              assigned_user_id: user.id,
            },
            {
              id: "Q-2025-004",
              customer: "Emily Davis",
              amount: 1875,
              date: "2025-03-17",
              status: "sent",
              assigned_user_id: "some-other-id",
            },
            {
              id: "Q-2025-005",
              customer: "Sarah Johnson",
              amount: 3450,
              date: "2025-03-16",
              status: "draft",
              assigned_user_id: user.id,
            },
          ].filter((quote) => quote.assigned_user_id === user.id),
        )

        // Recent customers
        setRecentCustomers(
          [
            {
              id: 1,
              name: "John Smith",
              email: "john@example.com",
              phone: "021-555-1234",
              date: "2025-03-18",
              assigned_user_id: user.id,
            },
            {
              id: 2,
              name: "Sarah Johnson",
              email: "sarah@example.com",
              phone: "022-555-5678",
              date: "2025-03-15",
              assigned_user_id: user.id,
            },
            {
              id: 3,
              name: "Michael Brown",
              email: "michael@example.com",
              phone: "027-555-9012",
              date: "2025-03-12",
              assigned_user_id: user.id,
            },
            {
              id: 4,
              name: "Emily Davis",
              email: "emily@example.com",
              phone: "021-555-3456",
              date: "2025-03-10",
              assigned_user_id: "some-other-id",
            },
          ].filter((customer) => customer.assigned_user_id === user.id),
        )

        // Tasks and follow-ups
        setTasks([
          {
            id: 1,
            title: "Follow up on quote Q-2025-001",
            customer: "John Smith",
            type: "quote",
            dueDate: "2025-03-23",
            priority: "high",
            completed: false,
          },
          {
            id: 2,
            title: "Confirm installation details",
            customer: "Sarah Johnson",
            type: "job",
            dueDate: "2025-03-21",
            priority: "medium",
            completed: false,
          },
          {
            id: 3,
            title: "Send product catalog",
            customer: "Michael Brown",
            type: "customer",
            dueDate: "2025-03-22",
            priority: "low",
            completed: false,
          },
          {
            id: 4,
            title: "Update quote with new pricing",
            customer: "Robert Wilson",
            type: "quote",
            dueDate: "2025-03-20",
            priority: "medium",
            completed: true,
          },
        ])
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [supabase])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      case "sent":
        return <Badge variant="secondary">Sent</Badge>
      case "approved":
        return <Badge variant="success">Approved</Badge>
      case "confirmed":
        return <Badge variant="success">Confirmed</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[50vh]">
          <p>Loading dashboard data...</p>
        </div>
      </DashboardLayout>
    )
  }

  // Calculate percentage changes for KPIs
  const quotePercentChange =
    stats.quotesLastMonth > 0
      ? Math.round(((stats.quotesThisMonth - stats.quotesLastMonth) / stats.quotesLastMonth) * 100)
      : 100

  const revenuePercentChange =
    stats.revenueLastMonth > 0
      ? Math.round(((stats.revenueThisMonth - stats.revenueLastMonth) / stats.revenueLastMonth) * 100)
      : 100

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {userData?.name || "User"}</h1>
            <p className="text-muted-foreground">Here's what's happening with your assigned work today.</p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/quotes/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Quote
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/customers/new">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Customer
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.myCustomers}</div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">
                  {Math.round((stats.myCustomers / stats.totalCustomers) * 100)}% of total
                </p>
                <Link href="/customers" className="text-xs text-primary hover:underline inline-flex items-center">
                  View all
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
              <Progress className="mt-2" value={(stats.myCustomers / stats.totalCustomers) * 100} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Quotes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.myQuotes}</div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">
                  {Math.round((stats.myQuotes / stats.activeQuotes) * 100)}% of total
                </p>
                <Link href="/quotes" className="text-xs text-primary hover:underline inline-flex items-center">
                  View all
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
              <Progress className="mt-2" value={(stats.myQuotes / stats.activeQuotes) * 100} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Jobs</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.myJobs}</div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">
                  {Math.round((stats.myJobs / stats.scheduledJobs) * 100)}% of total
                </p>
                <Link href="/jobs" className="text-xs text-primary hover:underline inline-flex items-center">
                  View schedule
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
              <Progress className="mt-2" value={(stats.myJobs / stats.scheduledJobs) * 100} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.conversionRate}%</div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">Quote to job conversion</p>
                <Link href="/reports" className="text-xs text-primary hover:underline inline-flex items-center">
                  View reports
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
              <Progress className="mt-2" value={stats.conversionRate} />
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          {/* Left Column - 4/7 width */}
          <div className="md:col-span-2 lg:col-span-4 space-y-6">
            {/* Monthly Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance</CardTitle>
                <CardDescription>Your quotes and revenue for this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-muted-foreground">Quotes This Month</div>
                      <div
                        className={`text-sm font-medium ${quotePercentChange >= 0 ? "text-green-500" : "text-red-500"}`}
                      >
                        {quotePercentChange > 0 ? "+" : ""}
                        {quotePercentChange}%
                      </div>
                    </div>
                    <div className="text-2xl font-bold">{stats.quotesThisMonth}</div>
                    <div className="text-xs text-muted-foreground">vs {stats.quotesLastMonth} last month</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-muted-foreground">Revenue This Month</div>
                      <div
                        className={`text-sm font-medium ${revenuePercentChange >= 0 ? "text-green-500" : "text-red-500"}`}
                      >
                        {revenuePercentChange > 0 ? "+" : ""}
                        {revenuePercentChange}%
                      </div>
                    </div>
                    <div className="text-2xl font-bold">{formatCurrency(stats.revenueThisMonth)}</div>
                    <div className="text-xs text-muted-foreground">
                      vs {formatCurrency(stats.revenueLastMonth)} last month
                    </div>
                  </div>
                </div>

                <div className="h-[200px]">
                  <QuotesOverviewChart />
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Jobs */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>My Upcoming Jobs</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/jobs">View all</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {upcomingJobs.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingJobs.map((job) => (
                      <div key={job.id} className="flex items-start gap-4 rounded-lg border p-3">
                        <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{job.customer}</p>
                            {getStatusBadge(job.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">{job.address}</p>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <Clock className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                              <span>
                                {job.date}, {job.time}
                              </span>
                            </div>
                            <Badge variant="outline">{job.type}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/jobs/new">
                        <CalendarPlus className="mr-2 h-4 w-4" />
                        Schedule New Job
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground mb-4">No upcoming jobs assigned to you</p>
                    <Button asChild>
                      <Link href="/jobs/new">
                        <CalendarPlus className="mr-2 h-4 w-4" />
                        Schedule Job
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - 3/7 width */}
          <div className="md:col-span-2 lg:col-span-3 space-y-6">
            {/* Tasks and Follow-ups */}
            <Card>
              <CardHeader>
                <CardTitle>My Tasks</CardTitle>
                <CardDescription>Follow-ups and pending actions</CardDescription>
              </CardHeader>
              <CardContent>
                <TasksList tasks={tasks} quotes={recentQuotes} customers={recentCustomers} jobs={upcomingJobs} />
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  View All Tasks
                </Button>
              </CardFooter>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates across your accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivityFeed quotes={recentQuotes} customers={recentCustomers} jobs={upcomingJobs} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Quotes and Customers */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Quotes */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>My Recent Quotes</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/quotes">View all</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentQuotes.length > 0 ? (
                <div className="space-y-4">
                  {recentQuotes.map((quote) => (
                    <div key={quote.id} className="flex items-start gap-4 rounded-lg border p-3">
                      <DollarSign className="h-5 w-5 text-green-500 mt-0.5" />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{quote.customer}</p>
                          {getStatusBadge(quote.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">{quote.id}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span>{formatCurrency(quote.amount)}</span>
                          <span className="text-muted-foreground">{quote.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <DollarSign className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No recent quotes</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/quotes/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Quote
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Recent Customers */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>My Recent Customers</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/customers">View all</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentCustomers.length > 0 ? (
                <div className="space-y-4">
                  {recentCustomers.map((customer) => (
                    <div key={customer.id} className="flex items-start gap-4 rounded-lg border p-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{customer.name}</p>
                          <span className="text-xs text-muted-foreground">{customer.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                        <p className="text-sm">{customer.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Users className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No recent customers</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/customers/new">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add New Customer
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

