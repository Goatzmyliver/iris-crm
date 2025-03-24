"use client"

import { useEffect, useState } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface RevenueByMonthChartProps {
  timeRange: string
}

export function RevenueByMonthChart({ timeRange }: RevenueByMonthChartProps) {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    // In a real implementation, you would fetch this data from your API
    // For now, we'll use mock data based on the selected time range

    const mockData = {
      last7days: [
        { name: "Mon", revenue: 850 },
        { name: "Tue", revenue: 0 },
        { name: "Wed", revenue: 1200 },
        { name: "Thu", revenue: 0 },
        { name: "Fri", revenue: 1500 },
        { name: "Sat", revenue: 700 },
        { name: "Sun", revenue: 0 },
      ],
      last30days: [
        { name: "Week 1", revenue: 3500 },
        { name: "Week 2", revenue: 4200 },
        { name: "Week 3", revenue: 5800 },
        { name: "Week 4", revenue: 5250 },
      ],
      last90days: [
        { name: "Jan", revenue: 12500 },
        { name: "Feb", revenue: 16800 },
        { name: "Mar", revenue: 23200 },
      ],
      thisYear: [
        { name: "Jan", revenue: 12500 },
        { name: "Feb", revenue: 16800 },
        { name: "Mar", revenue: 23200 },
        { name: "Apr", revenue: 18900 },
        { name: "May", revenue: 21500 },
        { name: "Jun", revenue: 19800 },
        { name: "Jul", revenue: 22300 },
        { name: "Aug", revenue: 25600 },
        { name: "Sep", revenue: 24100 },
        { name: "Oct", revenue: 27800 },
        { name: "Nov", revenue: 29500 },
        { name: "Dec", revenue: 32000 },
      ],
    }

    // Use the appropriate data based on the time range
    // For thisYear, we might want to show only the relevant months
    if (timeRange === "thisYear") {
      // Get current month index (0-based)
      const currentMonth = new Date().getMonth()
      // Only show data up to the current month
      setData(mockData.thisYear.slice(0, currentMonth + 1))
    } else {
      setData(mockData[timeRange as keyof typeof mockData])
    }
  }, [timeRange])

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

