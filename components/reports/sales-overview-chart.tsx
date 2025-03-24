"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface SalesOverviewChartProps {
  timeRange: string
}

export function SalesOverviewChart({ timeRange }: SalesOverviewChartProps) {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    // In a real implementation, you would fetch this data from your API
    // For now, we'll use mock data based on the selected time range

    const mockData = {
      last7days: [
        { name: "Mon", quotes: 2, converted: 1 },
        { name: "Tue", quotes: 1, converted: 0 },
        { name: "Wed", quotes: 3, converted: 2 },
        { name: "Thu", quotes: 0, converted: 0 },
        { name: "Fri", quotes: 1, converted: 1 },
        { name: "Sat", quotes: 1, converted: 0 },
        { name: "Sun", quotes: 0, converted: 0 },
      ],
      last30days: [
        { name: "Week 1", quotes: 7, converted: 4 },
        { name: "Week 2", quotes: 5, converted: 3 },
        { name: "Week 3", quotes: 8, converted: 5 },
        { name: "Week 4", quotes: 5, converted: 3 },
      ],
      last90days: [
        { name: "Jan", quotes: 18, converted: 12 },
        { name: "Feb", quotes: 22, converted: 15 },
        { name: "Mar", quotes: 35, converted: 22 },
      ],
      thisYear: [
        { name: "Q1", quotes: 45, converted: 30 },
        { name: "Q2", quotes: 55, converted: 38 },
        { name: "Q3", quotes: 40, converted: 25 },
        { name: "Q4", quotes: 40, converted: 27 },
      ],
    }

    setData(mockData[timeRange as keyof typeof mockData])
  }, [timeRange])

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

