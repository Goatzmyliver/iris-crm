"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, Calendar, Clock, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    customers: 0,
    activeQuotes: 0,
    scheduledJobs: 0,
    lowStock: 0,
  })
  const [upcomingJobs, setUpcomingJobs] = useState<any[]>([])
  const [recentQuotes, setRecentQuotes] = useState<any[]>([])
  const [followUps, setFollowUps] = useState<any[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser()

        // In a real app, you would fetch actual data from Supabase
        // For now, we'll use dummy data
        setStats({
          customers: 12,
          activeQuotes: 5,
          scheduledJobs: 3,
          lowStock: 2,
        })

        // Filter upcoming jobs to only show those assigned to the current user
        // In a real implementation, this would be a database query
        const allJobs = [
          {
            id: "J-2025-001",
            customer: "Sarah Johnson",
            address: "456 High St, Wellington",
            date: "2025-03-22",
            status: "confirmed",
            assigned_user_id: user?.id,
          },
          {
            id: "J-2025-002",
            customer: "Michael Brown",
            address: "789 Park Ave, Christchurch",
            date: "2025-03-24",
            status: "confirmed",
            assigned_user_id: "some-other-id",
          },
          {
            id: "J-2025-003",
            customer: "Emily Davis",
            address: "321 Beach Rd, Auckland",
            date: "2025-03-25",
            status: "pending",
            assigned_user_id: user?.id,
          },
        ]

        // Filter to show only jobs assigned to the current user
        setUpcomingJobs(allJobs.filter((job) => job.assigned_user_id === user?.id))

        // Similar filtering for quotes and follow-ups
        // ... rest of the function remains the same
        setRecentQuotes([
          { id: "Q-2025-001", customer: "John Smith", amount: 1250, date: "2025-03-20", status: "sent" },
          { id: "Q-2025-003", customer: "Michael Brown", amount: 2340, date: "2025-03-19", status: "draft" },
          { id: "Q-2025-002", customer: "Robert Wilson", amount: 4250, date: "2025-03-18", status: "approved" },
        ])

        setFollowUps([
          {
            id: 1,
            customer: "John Smith",
            type: "quote",
            dueDate: "2025-03-23",
            description: "Follow up on quote Q-2025-001",
          },
          {
            id: 2,
            customer: "Sarah Johnson",
            type: "job",
            dueDate: "2025-03-21",
            description: "Confirm installation details",
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

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.customers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <Link href="/customers" className="text-primary hover:underline inline-flex items-center">
                  View all customers
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Quotes</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeQuotes}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <Link href="/quotes" className="text-primary hover:underline inline-flex items-center">
                  Manage quotes
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled Jobs</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.scheduledJobs}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <Link href="/jobs" className="text-primary hover:underline inline-flex items-center">
                  View schedule
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.lowStock}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <Link href="/inventory" className="text-primary hover:underline inline-flex items-center">
                  Check inventory
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Upcoming Jobs */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Upcoming Jobs</CardTitle>
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
                        <div className="flex items-center text-sm">
                          <Clock className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                          <span>{job.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No upcoming jobs</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Quotes */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Recent Quotes</CardTitle>
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
                          <span>${quote.amount.toFixed(2)}</span>
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
          </Card>
        </div>

        {/* Follow-ups */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Follow-ups</CardTitle>
              <Button variant="outline" size="sm">
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark All Complete
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {followUps.length > 0 ? (
              <div className="space-y-4">
                {followUps.map((task) => (
                  <div key={task.id} className="flex items-start gap-4 rounded-lg border p-3">
                    {task.type === "quote" ? (
                      <DollarSign className="h-5 w-5 text-amber-500 mt-0.5" />
                    ) : (
                      <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
                    )}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{task.customer}</p>
                        <span className="text-sm text-muted-foreground">Due: {task.dueDate}</span>
                      </div>
                      <p className="text-sm">{task.description}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <CheckCircle className="h-4 w-4" />
                      <span className="sr-only">Complete</span>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No follow-ups needed</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

