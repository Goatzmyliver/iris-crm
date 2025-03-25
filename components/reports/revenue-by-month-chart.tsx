"use client"

import { useEffect, useState } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { DateRange } from "react-day-picker"
import {
  format,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  eachQuarterOfInterval,
  differenceInDays,
} from "date-fns"

interface RevenueByMonthChartProps {
  timeRange: string
  userFilter?: string
  dateRange?: DateRange
}

export function RevenueByMonthChart({ timeRange, userFilter = "all", dateRange }: RevenueByMonthChartProps) {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    // In a real implementation, you would fetch this data from your API
    // For now, we'll use mock data based on the selected time range

    // Generate data based on the date range
    if (!dateRange?.from || !dateRange?.to) return

    const { from, to } = dateRange
    const daysDifference = differenceInDays(to, from)

    let chartData: any[] = []
    let mockData: any[] = []

    // Determine the appropriate interval based on the date range
    if (daysDifference <= 31) {
      // For shorter ranges, show daily data
      mockData = eachDayOfInterval({ start: from, end: to }).map((date) => ({
        date,
        revenue: Math.floor(Math.random() * 1500) + 500,
      }))

      chartData = mockData.map((item) => ({
        name: format(item.date, "MMM d"),
        revenue: item.revenue,
      }))
    } else if (daysDifference <= 90) {
      // For medium ranges, show weekly data
      mockData = eachWeekOfInterval({ start: from, end: to }, { weekStartsOn: 1 }).map((weekStart) => ({
        date: weekStart,
        revenue: Math.floor(Math.random() * 5000) + 2000,
      }))

      chartData = mockData.map((item) => ({
        name: `${format(item.date, "MMM d")}`,
        revenue: item.revenue,
      }))
    } else if (daysDifference <= 365) {
      // For longer ranges, show monthly data
      mockData = eachMonthOfInterval({ start: from, end: to }).map((monthStart) => ({
        date: monthStart,
        revenue: Math.floor(Math.random() * 20000) + 10000,
      }))

      chartData = mockData.map((item) => ({
        name: format(item.date, "MMM yyyy"),
        revenue: item.revenue,
      }))
    } else {
      // For very long ranges, show quarterly data
      mockData = eachQuarterOfInterval({ start: from, end: to }).map((quarterStart) => ({
        date: quarterStart,
        revenue: Math.floor(Math.random() * 50000) + 25000,
      }))

      chartData = mockData.map((item) => ({
        name: `Q${Math.floor(item.date.getMonth() / 3) + 1} ${item.date.getFullYear()}`,
        revenue: item.revenue,
      }))
    }

    // Apply user filter if needed
    if (userFilter !== "all") {
      // Simulate filtered data - reduce values by a percentage
      chartData = chartData.map((item: any) => ({
        ...item,
        revenue: Math.round(item.revenue * 0.4),
      }))
    }

    setData(chartData)
  }, [timeRange, userFilter, dateRange])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => `$${value}`} />
        <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

