"use client"

import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface JobUpdate {
  id: string
  update_type: string
  notes: string
  created_at: string
  created_by: {
    full_name: string
  }
}

interface JobUpdatesListProps {
  updates: JobUpdate[]
}

export function JobUpdatesList({ updates }: JobUpdatesListProps) {
  if (updates.length === 0) {
    return <p className="text-muted-foreground">No updates yet.</p>
  }

  return (
    <div className="space-y-4">
      {updates.map((update) => (
        <Card key={update.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">
                <Badge className="mr-2">{update.update_type.replace("_", " ")}</Badge>
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(update.created_at), { addSuffix: true })}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p>{update.notes}</p>
            <p className="text-sm text-muted-foreground mt-2">By: {update.created_by?.full_name || "Unknown"}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
