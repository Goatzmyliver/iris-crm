"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RevenueChart } from "@/components/reports/revenue-chart"
import { JobsChart } from "@/components/reports/jobs-chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface JobStats {
  total: number
  completed: number
  inProgress: number
  scheduled: number
}

interface QuoteStats {
  total: number
  accepted: number
  sent: number
  totalValue: number
  acceptedValue: number
}

interface ReportsOverviewProps {
  jobStats: JobStats
  quoteStats: QuoteStats
}

export function ReportsOverview({ jobStats, quoteStats }: ReportsOverviewProps) {
  const [timeRange, setTimeRange] = useState("month")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="jobs">Jobs</TabsTrigger>
              <TabsTrigger value="quotes">Quotes</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
            </TabsList>

            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{jobStats.total}</div>
                  <p className="text-xs text-muted-foreground">
                    {timeRange === "month"
                      ? "This month"
                      : timeRange === "week"
                        ? "This week"
                        : timeRange === "quarter"
                          ? "This quarter"
                          : "This year"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{jobStats.completed}</div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((jobStats.completed / (jobStats.total || 1)) * 100)}% completion rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Quote Acceptance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round((quoteStats.accepted / (quoteStats.total || 1)) * 100)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {quoteStats.accepted} of {quoteStats.total} quotes accepted
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Quote Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(quoteStats.totalValue)}</div>
                  <p className="text-xs text-muted-foreground">{formatCurrency(quoteStats.acceptedValue)} accepted</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <RevenueChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Job Status</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <JobsChart jobStats={jobStats} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Jobs Analysis</CardTitle>
                <CardDescription>Detailed breakdown of job performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <JobsChart jobStats={jobStats} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quotes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quotes Analysis</CardTitle>
                <CardDescription>Detailed breakdown of quote performance and conversion rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Quote Status Distribution</h3>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-muted rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold">{quoteStats.total}</div>
                        <p className="text-sm text-muted-foreground">Total Quotes</p>
                      </div>
                      <div className="bg-muted rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold">{quoteStats.sent}</div>
                        <p className="text-sm text-muted-foreground">Sent</p>
                      </div>
                      <div className="bg-muted rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold">{quoteStats.accepted}</div>
                        <p className="text-sm text-muted-foreground">Accepted</p>
                      </div>
                      <div className="bg-muted rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold">
                          {quoteStats.total - quoteStats.accepted - quoteStats.sent}
                        </div>
                        <p className="text-sm text-muted-foreground">Other</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Quote Value</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted rounded-lg p-4">
                        <div className="text-2xl font-bold">{formatCurrency(quoteStats.totalValue)}</div>
                        <p className="text-sm text-muted-foreground">Total Quote Value</p>
                      </div>
                      <div className="bg-muted rounded-lg p-4">
                        <div className="text-2xl font-bold">{formatCurrency(quoteStats.acceptedValue)}</div>
                        <p className="text-sm text-muted-foreground">Accepted Quote Value</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analysis</CardTitle>
                <CardDescription>Detailed breakdown of revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <RevenueChart />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

