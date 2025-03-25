"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { FileText, User, Calendar, Send, Clock } from "lucide-react"

interface ActivityItem {
  id: string
  type: string
  title: string
  description: string
  timestamp: Date
  icon: React.ReactNode
}

interface RecentActivityFeedProps {
  quotes: any[]
  customers: any[]
  jobs: any[]
}

export function RecentActivityFeed({ quotes, customers, jobs }: RecentActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([])

  useEffect(() => {
    // Generate activity feed from quotes, customers, and jobs
    const quoteActivities = quotes.map((quote) => ({
      id: `quote-${quote.id}`,
      type: "quote",
      title: `Quote ${quote.id}`,
      description: `${quote.status === "draft" ? "Created" : "Sent to"} ${quote.customer} for ${formatCurrency(quote.amount)}`,
      timestamp: new Date(quote.date),
      icon:
        quote.status === "draft" ? (
          <FileText className="h-4 w-4 text-blue-500" />
        ) : (
          <Send className="h-4 w-4 text-green-500" />
        ),
    }))

    const customerActivities = customers.map((customer) => ({
      id: `customer-${customer.id}`,
      type: "customer",
      title: `New Customer`,
      description: `Added ${customer.name} to your customers`,
      timestamp: new Date(customer.date),
      icon: <User className="h-4 w-4 text-purple-500" />,
    }))

    const jobActivities = jobs.map((job) => ({
      id: `job-${job.id}`,
      type: "job",
      title: `Job ${job.id}`,
      description: `Scheduled for ${job.customer} on ${job.date}`,
      timestamp: new Date(job.date),
      icon: <Calendar className="h-4 w-4 text-amber-500" />,
    }))

    // Combine all activities and sort by timestamp (newest first)
    const allActivities = [...quoteActivities, ...customerActivities, ...jobActivities]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10) // Limit to 10 most recent activities

    setActivities(allActivities)
  }, [quotes, customers, jobs])

  // Helper function to format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-NZ", {
      style: "currency",
      currency: "NZD",
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      {activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">{activity.icon}</div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <Clock className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No recent activity</p>
        </div>
      )}
    </div>
  )
}

