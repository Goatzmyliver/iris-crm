"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { DateRange } from "react-day-picker"
import {
  format,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  eachQuarterOfInterval,
  endOfWeek,
  differenceInDays,
} from "date-fns"

interface SalesOverviewChartProps {
  timeRange: string
  userFilter?: string
  dateRange?: DateRange
}

export function SalesOverviewChart({ timeRange, userFilter = "all", dateRange }: SalesOverviewChartProps) {
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
        quotes: Math.floor(Math.random() * 5),
        converted: Math.floor(Math.random() * 3),
      }))

      chartData = mockData.map((item) => ({
        name: format(item.date, "MMM d"),
        quotes: item.quotes,
        converted: item.converted,
      }))
    } else if (daysDifference <= 90) {
      // For medium ranges, show weekly data
      mockData = eachWeekOfInterval({ start: from, end: to }, { weekStartsOn: 1 }).map((weekStart) => {
        const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 })
        return {
          date: weekStart,
          quotes: Math.floor(Math.random() * 15) + 5,
          converted: Math.floor(Math.random() * 10) + 2,
        }
      })

      chartData = mockData.map((item) => ({
        name: `${format(item.date, "MMM d")} - ${format(endOfWeek(item.date, { weekStartsOn: 1 }), "MMM d")}`,
        quotes: item.quotes,
        converted: item.converted,
      }))
    } else if (daysDifference <= 365) {
      // For longer ranges, show monthly data
      mockData = eachMonthOfInterval({ start: from, end: to }).map((monthStart) => ({
        date: monthStart,
        quotes: Math.floor(Math.random() * 30) + 10,
        converted: Math.floor(Math.random() * 20) + 5,
      }))

      chartData = mockData.map((item) => ({
        name: format(item.date, "MMM yyyy"),
        quotes: item.quotes,
        converted: item.converted,
      }))
    } else {
      // For very long ranges, show quarterly data
      mockData = eachQuarterOfInterval({ start: from, end: to }).map((quarterStart) => ({
        date: quarterStart,
        quotes: Math.floor(Math.random() * 60) + 20,
        converted: Math.floor(Math.random() * 40) + 10,
      }))

      chartData = mockData.map((item) => ({
        name: `Q${Math.floor(item.date.getMonth() / 3) + 1} ${item.date.getFullYear()}`,
        quotes: item.quotes,
        converted: item.converted,
      }))
    }

    // Apply user filter if needed
    if (userFilter !== "all") {
      // Simulate filtered data - reduce values by a percentage
      chartData = chartData.map((item: any) => ({
        ...item,
        quotes: Math.round(item.quotes * 0.4),
        converted: Math.round(item.converted * 0.4),
      }))
    }

    setData(chartData)
  }, [timeRange, userFilter, dateRange])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="quotes" name="Total Quotes" fill="#8884d8" />
        <Bar dataKey="converted" name="Converted to Jobs" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  )
}

