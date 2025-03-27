"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface JobStats {
  total: number
  completed: number
  inProgress: number
  scheduled: number
}

interface JobsChartProps {
  jobStats: JobStats
}

export function JobsChart({ jobStats }: JobsChartProps) {
  const data = [
    { name: "Completed", value: jobStats.completed, color: "#22c55e" },
    { name: "In Progress", value: jobStats.inProgress, color: "#3b82f6" },
    { name: "Scheduled", value: jobStats.scheduled, color: "#eab308" },
  ]

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} jobs`, "Count"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

