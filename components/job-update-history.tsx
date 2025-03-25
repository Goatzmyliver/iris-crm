"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, FileText, PlayCircle, XCircle } from "lucide-react"

interface JobUpdateHistoryProps {
  jobId: string
}

export function JobUpdateHistory({ jobId }: JobUpdateHistoryProps) {
  const supabase = createClientComponentClient()
  const [updates, setUpdates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUpdates = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from("job_updates")
          .select("*, profiles(full_name)")
          .eq("job_id", jobId)
          .order("created_at", { ascending: false })

        if (error) throw error
        setUpdates(data || [])
      } catch (error) {
        console.error("Error fetching job updates:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUpdates()
  }, [supabase, jobId])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "in_progress":
        return <PlayCircle className="h-5 w-5 text-blue-500" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getUpdateIcon = (update: any) => {
    if (update.update_type === "status_change") {
      return getStatusIcon(update.new_status)
    } else if (update.update_type === "progress_update") {
      return <FileText className="h-5 w-5 text-blue-500" />
    } else {
      return <FileText className="h-5 w-5 text-muted-foreground" />
    }
  }

  const formatUpdateText = (update: any) => {
    if (update.update_type === "status_change") {
      const previousStatus =
        update.previous_status.charAt(0).toUpperCase() + update.previous_status.slice(1).replace("_", " ")
      const newStatus = update.new_status.charAt(0).toUpperCase() + update.new_status.slice(1).replace("_", " ")
      return `Status changed from ${previousStatus} to ${newStatus}`
    } else if (update.update_type === "progress_update") {
      return `Progress updated to ${update.progress_percentage}%`
    } else {
      return "Update made to job"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job History</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : updates.length > 0 ? (
          <div className="space-y-4">
            {updates.map((update) => (
              <div key={update.id} className="border-l-2 border-muted pl-4 relative">
                <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-background border-2 border-primary"></div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getUpdateIcon(update)}</div>
                  <div className="space-y-1">
                    <p className="font-medium">{formatUpdateText(update)}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(update.created_at).toLocaleString()} by {update.profiles?.full_name || "Unknown"}
                    </p>
                    {update.notes && <p className="text-sm mt-1 whitespace-pre-line">{update.notes}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-4">No updates recorded yet</p>
        )}
      </CardContent>
    </Card>
  )
}

