"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export function QuotesOverviewChart() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    // In a real implementation, you would fetch this data from your API
    // For now, we'll use mock data
    const mockData = [
      { name: "Week 1", quotes: 3, revenue: 5200 },
      { name: "Week 2", quotes: 2, revenue: 3800 },
      { name: "Week 3", quotes: 4, revenue: 8500 },
      { name: "Week 4", quotes: 3, revenue: 7000 },
    ]

    setData(mockData)
  }, [])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
        <Tooltip
          formatter={(value, name) => {
            if (name === "revenue") return [`$${value}`, "Revenue"]
            return [value, "Quotes"]
          }}
        />
        <Legend />
        <Bar yAxisId="left" dataKey="quotes" name="Quotes" fill="#8884d8" />
        <Bar yAxisId="right" dataKey="revenue" name="Revenue" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  )
}

