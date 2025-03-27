"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

// Sample data - in a real app, this would come from the database
const data = [
  {
    name: "Jan",
    total: 1500,
  },
  {
    name: "Feb",
    total: 2300,
  },
  {
    name: "Mar",
    total: 3200,
  },
  {
    name: "Apr",
    total: 4500,
  },
  {
    name: "May",
    total: 3800,
  },
  {
    name: "Jun",
    total: 5000,
  },
  {
    name: "Jul",
    total: 4800,
  },
  {
    name: "Aug",
    total: 5300,
  },
  {
    name: "Sep",
    total: 6000,
  },
  {
    name: "Oct",
    total: 5500,
  },
  {
    name: "Nov",
    total: 4800,
  },
  {
    name: "Dec",
    total: 6500,
  },
]

export function RevenueChart() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={formatCurrency} />
        <Tooltip
          formatter={(value: number) => [formatCurrency(value), "Revenue"]}
          cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
        />
        <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

