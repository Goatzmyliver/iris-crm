import { Suspense } from "react"
import type { Metadata } from "next"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/dashboard/overview"
import { RecentSales } from "@/components/dashboard/recent-sales"
import { TasksList } from "@/components/dashboard/tasks-list"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"
import { BookkeeperSummary } from "@/components/dashboard/bookkeeper-summary"
import { getRecentCustomers } from "@/lib/data"
import { getQuotes } from "@/lib/quotes"
import { getUpcomingJobs } from "@/lib/jobs"

export const metadata: Metadata = {
  title: "Dashboard - Iris CRM",
  description: "Example dashboard app built using the components.",
}

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  const recentCustomers = await getRecentCustomers()
  const quotes = await getQuotes()
  const upcomingJobs = await getUpcomingJobs()

  // Get quotes ready for invoicing
  const { data: readyForInvoicingQuotes } = await supabase
    .from("quotes")
    .select("id, total_amount")
    .eq("status", "ready_for_invoicing")

  // Get recently invoiced quotes (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: recentlyInvoicedQuotes } = await supabase
    .from("quotes")
    .select("id, total_amount")
    .eq("status", "invoiced")
    .gte("invoiced_at", thirtyDaysAgo.toISOString())

  // Calculate totals for bookkeeper summary
  const readyForInvoicingCount = readyForInvoicingQuotes?.length || 0
  const readyForInvoicingValue =
    readyForInvoicingQuotes?.reduce((sum, quote) => sum + (quote.total_amount || 0), 0) || 0

  const recentlyInvoicedCount = recentlyInvoicedQuotes?.length || 0
  const recentlyInvoicedValue = recentlyInvoicedQuotes?.reduce((sum, quote) => sum + (quote.total_amount || 0), 0) || 0

  // Generate automated tasks based on system events
  const automatedTasks = [
    ...quotes
      .filter((quote) => quote.status === "sent" && !quote.followedUp)
      .map((quote) => ({
        id: `quote-${quote.id}`,
        title: `Follow up on quote for ${quote.customerName}`,
        type: "quote-followup",
        dueDate: new Date(new Date(quote.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000),
        priority: "high",
        isAutomated: true,
        relatedId: quote.id,
      })),
    ...upcomingJobs
      .filter((job) => new Date(job.scheduledDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
      .map((job) => ({
        id: `job-${job.id}`,
        title: `Prepare for upcoming job with ${job.customerName}`,
        type: "job-preparation",
        dueDate: new Date(job.scheduledDate),
        priority: "medium",
        isAutomated: true,
        relatedId: job.id,
      })),
    ...recentCustomers
      .filter((customer) => new Date(customer.createdAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      .map((customer) => ({
        id: `customer-${customer.id}`,
        title: `Welcome new customer ${customer.name}`,
        type: "customer-welcome",
        dueDate: new Date(new Date(customer.createdAt).getTime() + 1 * 24 * 60 * 60 * 1000),
        priority: "medium",
        isAutomated: true,
        relatedId: customer.id,
      })),
  ]

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <p className="text-xs text-muted-foreground">+180.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12,234</div>
              <p className="text-xs text-muted-foreground">+19% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Now</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">+201 since last hour</p>
            </CardContent>
          </Card>
        </div>

        {/* Bookkeeper Summary */}
        <BookkeeperSummary
          readyForInvoicingCount={readyForInvoicingCount}
          readyForInvoicingValue={readyForInvoicingValue}
          recentlyInvoicedCount={recentlyInvoicedCount}
          recentlyInvoicedValue={recentlyInvoicedValue}
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>You made 265 sales this month.</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentSales customers={recentCustomers} />
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>My Tasks</CardTitle>
              <CardDescription>Tasks that need your attention.</CardDescription>
            </CardHeader>
            <CardContent>
              <TasksList automatedTasks={automatedTasks} />
            </CardContent>
          </Card>
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Recent activity across your CRM.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="customers">Customers</TabsTrigger>
                  <TabsTrigger value="quotes">Quotes</TabsTrigger>
                  <TabsTrigger value="enquiries">Enquiries</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4">
                  <div className="grid gap-4">
                    {/* Activity items would go here */}
                    <div className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">New customer added: ABC Corp</p>
                        <p className="text-sm text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </Suspense>
  )
}

