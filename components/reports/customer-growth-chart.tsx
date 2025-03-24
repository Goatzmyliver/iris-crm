"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface CustomerGrowthChartProps {
  timeRange: string
}

export function CustomerGrowthChart({ timeRange }: CustomerGrowthChartProps) {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    // In a real implementation, you would fetch this data from your API
    // For now, we'll use mock data based on the selected time range

    const mockData = {
      last7days: [
        { name: "Mon", customers: 12 },
        { name: "Tue", customers: 13 },
        { name: "Wed", customers: 13 },
        { name: "Thu", customers: 14 },
        { name: "Fri", customers: 14 },
        { name: "Sat", customers: 15 },
        { name: "Sun", customers: 15 },
      ],
      last30days: [
        { name: "Week 1", customers: 10 },
        { name: "Week 2", customers: 14 },
        { name: "Week 3", customers: 18 },
        { name: "Week 4", customers: 22 },
      ],
      last90days: [
        { name: "Jan", customers: 15 },
        { name: "Feb", customers: 28 },
        { name: "Mar", customers: 43 },
      ],
      thisYear: [
        { name: "Q1", customers: 25 },
        { name: "Q2", customers: 45 },
        { name: "Q3", customers: 60 },
        { name: "Q4", customers: 75 },
      ],
    }

    setData(mockData[timeRange as keyof typeof mockData])
  }, [timeRange])

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

