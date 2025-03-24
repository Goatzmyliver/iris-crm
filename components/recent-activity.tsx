import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface RecentActivityProps {
  recentQuotes?: any[]
  recentEnquiries?: any[]
}

export function RecentActivity({ recentQuotes = [], recentEnquiries = [] }: RecentActivityProps) {
  // Combine and sort activities
  const activities = [
    ...recentQuotes.map((quote) => ({
      id: quote.id,
      type: "quote",
      title: quote.name,
      date: new Date(quote.created_at),
      href: `/quotes/${quote.id}`,
    })),
    ...recentEnquiries.map((enquiry) => ({
      id: enquiry.id,
      type: "enquiry",
      title: `Enquiry from ${enquiry.name}`,
      date: new Date(enquiry.created_at),
      href: `/enquiries/${enquiry.id}`,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your recent CRM activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={`${activity.type}-${activity.id}`} className="flex items-center">
                  <div className="space-y-1">
                    <Link href={activity.href} className="text-sm font-medium leading-none hover:underline">
                      {activity.title}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(activity.date, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

