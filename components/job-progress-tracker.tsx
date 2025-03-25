"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, Clock, PlayCircle, XCircle } from "lucide-react"

interface JobProgressTrackerProps {
  job: {
    id: string
    status: string
    notes: string | null
    progress_notes: string | null
    completion_notes: string | null
    progress_percentage: number | null
  }
}

export function JobProgressTracker({ job }: JobProgressTrackerProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [progressPercentage, setProgressPercentage] = useState(job.progress_percentage || 0)
  const [progressNotes, setProgressNotes] = useState(job.progress_notes || "")
  const [completionNotes, setCompletionNotes] = useState(job.completion_notes || "")

  const updateProgress = async () => {
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from("jobs")
        .update({
          progress_percentage: progressPercentage,
          progress_notes: progressNotes,
        })
        .eq("id", job.id)

      if (error) {
        throw error
      }

      toast({
        title: "Progress updated",
        description: "Job progress has been updated successfully.",
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update progress",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const completeJob = async () => {
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from("jobs")
        .update({
          status: "completed",
          progress_percentage: 100,
          completion_notes: completionNotes,
          completion_date: new Date().toISOString(),
        })
        .eq("id", job.id)

      if (error) {
        throw error
      }

      toast({
        title: "Job completed",
        description: "Job has been marked as completed.",
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete job",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = () => {
    switch (job.status) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          {getStatusIcon()}
          <span className="ml-2">Job Progress</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {job.status === "completed" ? (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm font-medium">100%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: "100%" }}></div>
              </div>
            </div>

            {job.completion_notes && (
              <div className="rounded-md border p-3">
                <p className="text-sm font-medium mb-1">Completion Notes</p>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{job.completion_notes}</p>
              </div>
            )}

            <div className="flex justify-center">
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                <CheckCircle className="mr-1 h-4 w-4" />
                Job Completed
              </span>
            </div>
          </div>
        ) : job.status === "cancelled" ? (
          <div className="flex justify-center">
            <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
              <XCircle className="mr-1 h-4 w-4" />
              Job Cancelled
            </span>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm font-medium">{progressPercentage}%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    progressPercentage < 30 ? "bg-blue-500" : progressPercentage < 70 ? "bg-yellow-500" : "bg-green-500"
                  }`}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {[0, 25, 50, 75, 100].map((value) => (
                <Button
                  key={value}
                  variant={progressPercentage === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setProgressPercentage(value)}
                >
                  {value}%
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Progress Notes</label>
              <Textarea
                value={progressNotes}
                onChange={(e) => setProgressNotes(e.target.value)}
                placeholder="Enter notes about the current progress"
                rows={3}
              />
            </div>

            <Button onClick={updateProgress} disabled={isLoading} className="w-full">
              {isLoading ? "Updating..." : "Update Progress"}
            </Button>

            {job.status === "in_progress" && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Complete Job</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Completion Notes</label>
                  <Textarea
                    value={completionNotes}
                    onChange={(e) => setCompletionNotes(e.target.value)}
                    placeholder="Enter notes about the job completion"
                    rows={3}
                  />
                </div>

                <Button onClick={completeJob} disabled={isLoading} variant="default" className="w-full">
                  {isLoading ? "Completing..." : "Mark as Completed"}
                </Button>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

