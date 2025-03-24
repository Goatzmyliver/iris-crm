"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download, BarChart3, TrendingUp, DollarSign, Users, FileText } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { formatCurrency } from "@/lib/utils"
import { SalesOverviewChart } from "@/components/reports/sales-overview-chart"
import { QuoteConversionChart } from "@/components/reports/quote-conversion-chart"
import { CustomerGrowthChart } from "@/components/reports/customer-growth-chart"
import { JobStatusChart } from "@/components/reports/job-status-chart"
import { RevenueByMonthChart } from "@/components/reports/revenue-by-month-chart"

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("last30days")
  const [isLoading, setIsLoading] = useState(true)
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

  useEffect(() => {
    const fetchReportData = async () => {
      setIsLoading(true)
      try {
        // In a real implementation, you would fetch actual data from Supabase
        // For now, we'll use mock data

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Set mock metrics based on the selected time range
        const mockData = {
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
          thisYear: {
            totalRevenue: 124500,
            totalQuotes: 180,
            conversionRate: 70,
            averageQuoteValue: 2650,
            newCustomers: 65,
            completedJobs: 110,
            pendingJobs: 25,
            profitMargin: 40,
          },
        }

        setMetrics(mockData[timeRange as keyof typeof mockData])
      } catch (error) {
        console.error("Error fetching report data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReportData()
  }, [timeRange, supabase])

  const handleExportReport = () => {
    // In a real implementation, this would generate and download a PDF or CSV report
    alert("This would download a report in a real implementation")
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Reports & Analytics</h1>
            <p className="text-muted-foreground">Track your business performance and growth</p>
          </div>

          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last7days">Last 7 Days</SelectItem>
                <SelectItem value="last30days">Last 30 Days</SelectItem>
                <SelectItem value="last90days">Last 90 Days</SelectItem>
                <SelectItem value="thisYear">This Year</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={handleExportReport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
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
                  <SalesOverviewChart timeRange={timeRange} />
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue over time</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <RevenueByMonthChart timeRange={timeRange} />
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
                  <CustomerGrowthChart timeRange={timeRange} />
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

