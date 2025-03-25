"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { DateRange } from "react-day-picker"
import {
  format,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  eachQuarterOfInterval,
  differenceInDays,
} from "date-fns"

interface CustomerGrowthChartProps {
  timeRange: string
  userFilter?: string
  dateRange?: DateRange
}

export function CustomerGrowthChart({ timeRange, userFilter = "all", dateRange }: CustomerGrowthChartProps) {
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

    // Base customer count to start with
    const baseCustomers = 10

    // Determine the appropriate interval based on the date range
    if (daysDifference <= 31) {
      // For shorter ranges, show daily data
      mockData = eachDayOfInterval({ start: from, end: to }).map((date, index) => ({
        date,
        customers: baseCustomers + index,
      }))

      chartData = mockData.map((item) => ({
        name: format(item.date, "MMM d"),
        customers: item.customers,
      }))
    } else if (daysDifference <= 90) {
      // For medium ranges, show weekly data
      mockData = eachWeekOfInterval({ start: from, end: to }, { weekStartsOn: 1 }).map((weekStart, index) => ({
        date: weekStart,
        customers: baseCustomers + index * 3,
      }))

      chartData = mockData.map((item) => ({
        name: `${format(item.date, "MMM d")}`,
        customers: item.customers,
      }))
    } else if (daysDifference <= 365) {
      // For longer ranges, show monthly data
      mockData = eachMonthOfInterval({ start: from, end: to }).map((monthStart, index) => ({
        date: monthStart,
        customers: baseCustomers + index * 8,
      }))

      chartData = mockData.map((item) => ({
        name: format(item.date, "MMM yyyy"),
        customers: item.customers,
      }))
    } else {
      // For very long ranges, show quarterly data
      mockData = eachQuarterOfInterval({ start: from, end: to }).map((quarterStart, index) => ({
        date: quarterStart,
        customers: baseCustomers + index * 15,
      }))

      chartData = mockData.map((item) => ({
        name: `Q${Math.floor(item.date.getMonth() / 3) + 1} ${item.date.getFullYear()}`,
        customers: item.customers,
      }))
    }

    // Apply user filter if needed
    if (userFilter !== "all") {
      // Simulate filtered data - reduce values by a percentage
      chartData = chartData.map((item: any) => ({
        ...item,
        customers: Math.round(item.customers * 0.4),
      }))
    }

    setData(chartData)
  }, [timeRange, userFilter, dateRange])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="customers" name="Total Customers" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

