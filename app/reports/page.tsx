"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download, BarChart3, TrendingUp, DollarSign, Users, FileText, Calendar } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { formatCurrency } from "@/lib/utils"
import { SalesOverviewChart } from "@/components/reports/sales-overview-chart"
import { QuoteConversionChart } from "@/components/reports/quote-conversion-chart"
import { CustomerGrowthChart } from "@/components/reports/customer-growth-chart"
import { JobStatusChart } from "@/components/reports/job-status-chart"
import { RevenueByMonthChart } from "@/components/reports/revenue-by-month-chart"
import { DateRangePicker } from "@/components/date-range-picker"
import { subDays, subYears, startOfYear, startOfQuarter, endOfQuarter, format } from "date-fns"

export default function ReportsPage() {
  // Update the state to include more date range options
  const [timeRange, setTimeRange] = useState("last30days")
  const [userFilter, setUserFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<any[]>([])
  const [dateRange, setDateRange] = useState<{
    from: Date
    to: Date
  }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalQuotes: 0,
    conversionRate: 0,
    averageQuoteValue: 0,
    newCustomers: 0,
    completedJobs: 0,
    pendingJobs: 0,
    profitMargin: 0,
  })
  const supabase = createClientComponentClient()

  // Handle time range changes
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value)

    const today = new Date()
    let from = today
    let to = today

    switch (value) {
      case "thisWeek":
        from = subDays(today, today.getDay())
        break
      case "thisMonth":
        from = new Date(today.getFullYear(), today.getMonth(), 1)
        break
      case "thisQuarter":
        from = startOfQuarter(today)
        to = endOfQuarter(today)
        break
      case "thisYear":
        from = startOfYear(today)
        break
      case "last7days":
        from = subDays(today, 7)
        break
      case "last30days":
        from = subDays(today, 30)
        break
      case "last90days":
        from = subDays(today, 90)
        break
      case "lastYear":
        from = subYears(today, 1)
        break
      case "allTime":
        from = new Date(2020, 0, 1) // Set a reasonable "all time" start date
        break
      case "custom":
        // Don't change the date range for custom
        return
    }

    setDateRange({ from, to })
  }

  // Add this to the useEffect to fetch users
  useEffect(() => {
    const fetchReportData = async () => {
      setIsLoading(true)
      try {
        // Fetch users
        const { data: usersData } = await supabase.from("users").select("id, name, email")

        setUsers(usersData || [])

        // In a real implementation, you would fetch actual data from Supabase
        // For now, we'll use mock data

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Set mock metrics based on the selected time range and user filter
        const mockData = {
          thisWeek: {
            totalRevenue: 2150,
            totalQuotes: 4,
            conversionRate: 45,
            averageQuoteValue: 1950,
            newCustomers: 2,
            completedJobs: 2,
            pendingJobs: 3,
            profitMargin: 30,
          },
          thisMonth: {
            totalRevenue: 8750,
            totalQuotes: 12,
            conversionRate: 55,
            averageQuoteValue: 2100,
            newCustomers: 6,
            completedJobs: 8,
            pendingJobs: 5,
            profitMargin: 33,
          },
          thisQuarter: {
            totalRevenue: 28500,
            totalQuotes: 35,
            conversionRate: 60,
            averageQuoteValue: 2250,
            newCustomers: 15,
            completedJobs: 22,
            pendingJobs: 8,
            profitMargin: 35,
          },
          thisYear: {
            totalRevenue: 95000,
            totalQuotes: 120,
            conversionRate: 65,
            averageQuoteValue: 2400,
            newCustomers: 45,
            completedJobs: 75,
            pendingJobs: 15,
            profitMargin: 38,
          },
          last7days: {
            totalRevenue: 4250,
            totalQuotes: 8,
            conversionRate: 50,
            averageQuoteValue: 2125,
            newCustomers: 3,
            completedJobs: 4,
            pendingJobs: 6,
            profitMargin: 32,
          },
          last30days: {
            totalRevenue: 18750,
            totalQuotes: 25,
            conversionRate: 60,
            averageQuoteValue: 2340,
            newCustomers: 12,
            completedJobs: 15,
            pendingJobs: 10,
            profitMargin: 35,
          },
          last90days: {
            totalRevenue: 52500,
            totalQuotes: 75,
            conversionRate: 65,
            averageQuoteValue: 2450,
            newCustomers: 28,
            completedJobs: 42,
            pendingJobs: 15,
            profitMargin: 38,
          },
          lastYear: {
            totalRevenue: 124500,
            totalQuotes: 180,
            conversionRate: 70,
            averageQuoteValue: 2650,
            newCustomers: 65,
            completedJobs: 110,
            pendingJobs: 25,
            profitMargin: 40,
          },
          allTime: {
            totalRevenue: 245000,
            totalQuotes: 320,
            conversionRate: 72,
            averageQuoteValue: 2800,
            newCustomers: 120,
            completedJobs: 230,
            pendingJobs: 30,
            profitMargin: 42,
          },
          custom: {
            totalRevenue: 35000,
            totalQuotes: 45,
            conversionRate: 62,
            averageQuoteValue: 2400,
            newCustomers: 18,
            completedJobs: 28,
            pendingJobs: 12,
            profitMargin: 36,
          },
        }

        // Adjust metrics based on user filter (in a real implementation, this would be a database query)
        let filteredMetrics = mockData[timeRange as keyof typeof mockData]
        if (userFilter !== "all") {
          // Simulate filtered data - reduce values by a percentage
          filteredMetrics = {
            ...filteredMetrics,
            totalRevenue: Math.round(filteredMetrics.totalRevenue * 0.4),
            totalQuotes: Math.round(filteredMetrics.totalQuotes * 0.4),
            newCustomers: Math.round(filteredMetrics.newCustomers * 0.4),
            completedJobs: Math.round(filteredMetrics.completedJobs * 0.4),
            pendingJobs: Math.round(filteredMetrics.pendingJobs * 0.4),
          }
        }

        setMetrics(filteredMetrics)
      } catch (error) {
        console.error("Error fetching report data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReportData()
  }, [timeRange, userFilter, dateRange, supabase])

  const handleExportReport = () => {
    // In a real implementation, this would generate and download a PDF or CSV report
    alert("This would download a report in a real implementation")
  }

  // Format date range for display
  const formattedDateRange = `${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Reports & Analytics</h1>
            <p className="text-muted-foreground">Track your business performance and growth</p>
          </div>

          {/* Update the filter section in the JSX to include more date range options */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
            <div className="flex flex-col gap-1 w-full sm:w-auto">
              <Select value={timeRange} onValueChange={handleTimeRangeChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="thisWeek">This Week</SelectItem>
                  <SelectItem value="thisMonth">This Month</SelectItem>
                  <SelectItem value="thisQuarter">This Quarter</SelectItem>
                  <SelectItem value="thisYear">This Year</SelectItem>
                  <SelectItem value="last7days">Last 7 Days</SelectItem>
                  <SelectItem value="last30days">Last 30 Days</SelectItem>
                  <SelectItem value="last90days">Last 90 Days</SelectItem>
                  <SelectItem value="lastYear">Last Year</SelectItem>
                  <SelectItem value="allTime">All Time</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
              {timeRange === "custom" && <DateRangePicker dateRange={dateRange} onUpdate={setDateRange} />}
            </div>

            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="current">My Data Only</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={handleExportReport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Display the current date range */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span className="text-muted-foreground font-medium">{formattedDateRange}</span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500 font-medium">+12%</span> from previous period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quote Conversion</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500 font-medium">+5%</span> from previous period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.newCustomers}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500 font-medium">+18%</span> from previous period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.profitMargin}%</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500 font-medium">+3%</span> from previous period
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Sales Overview</CardTitle>
                  <CardDescription>Quote volume and conversion rates</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <SalesOverviewChart timeRange={timeRange} userFilter={userFilter} dateRange={dateRange} />
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue over time</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <RevenueByMonthChart timeRange={timeRange} userFilter={userFilter} dateRange={dateRange} />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Quote Conversion</CardTitle>
                  <CardDescription>Quote to job conversion rate</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <QuoteConversionChart />
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Customer Growth</CardTitle>
                  <CardDescription>New customers over time</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <CustomerGrowthChart timeRange={timeRange} userFilter={userFilter} dateRange={dateRange} />
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Job Status</CardTitle>
                  <CardDescription>Current job status breakdown</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <JobStatusChart />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sales" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sales Performance</CardTitle>
                <CardDescription>Detailed sales metrics and analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-20 text-muted-foreground">Detailed sales reports will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Analytics</CardTitle>
                <CardDescription>Customer acquisition and retention metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-20 text-muted-foreground">
                  Detailed customer analytics will be displayed here
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Job Performance</CardTitle>
                <CardDescription>Job completion rates and efficiency metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-20 text-muted-foreground">
                  Detailed job performance metrics will be displayed here
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

