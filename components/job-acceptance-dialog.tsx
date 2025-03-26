"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { Clock, MapPin, Phone, User, FileText, CheckCircle, XCircle } from "lucide-react"
// Import the JobCompletionForm component
import { JobCompletionForm } from "@/components/job-completion-form"

interface JobAcceptanceDialogProps {
  job: any
  installerId: string
  open: boolean
  onClose: () => void
  onJobUpdated: () => void
}

export function JobAcceptanceDialog({ job, installerId, open, onClose, onJobUpdated }: JobAcceptanceDialogProps) {
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  // Add a state for showing the completion form
  const [showCompletionForm, setShowCompletionForm] = useState(false)

  const handleAcceptJob = async () => {
    setIsLoading(true)
    try {
      // Update the job with acceptance status
      const { error } = await supabase
        .from("jobs")
        .update({
          acceptance_status: "accepted",
          acceptance_date: new Date().toISOString(),
        })
        .eq("id", job.id)

      if (error) throw error

      // Create a job update record
      await supabase.from("job_updates").insert({
        job_id: job.id,
        update_type: "job_accepted",
        notes: "Job accepted by installer",
        created_by: installerId,
      })

      toast({
        title: "Job accepted",
        description: "You have successfully accepted this job.",
      })

      onJobUpdated()
      onClose()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to accept job",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRejectJob = async () => {
    setIsLoading(true)
    try {
      // Update the job with rejection status
      const { error } = await supabase
        .from("jobs")
        .update({
          acceptance_status: "rejected",
          acceptance_date: new Date().toISOString(),
        })
        .eq("id", job.id)

      if (error) throw error

      // Create a job update record
      await supabase.from("job_updates").insert({
        job_id: job.id,
        update_type: "job_rejected",
        notes: "Job rejected by installer",
        created_by: installerId,
      })

      toast({
        title: "Job rejected",
        description: "You have rejected this job.",
      })

      onJobUpdated()
      onClose()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject job",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartJob = async () => {
    setIsLoading(true)
    try {
      // Update the job status to in_progress
      const { error } = await supabase
        .from("jobs")
        .update({
          status: "in_progress",
          progress_percentage: 10,
        })
        .eq("id", job.id)

      if (error) throw error

      toast({
        title: "Job started",
        description: "You have marked this job as in progress.",
      })

      onJobUpdated()
      onClose()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to start job",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Add a function to handle job completion
  const handleCompleteJob = () => {
    setShowCompletionForm(true)
  }

  // Update the canStart condition and add a canComplete condition
  const needsAcceptance = !job.acceptance_status || job.acceptance_status === "pending"
  const isAccepted = job.acceptance_status === "accepted"
  const canStart = isAccepted && job.status === "scheduled"
  const canComplete = isAccepted && job.status === "in_progress"

  // Update the return statement to include the completion form
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        {!showCompletionForm ? (
          <>
            <DialogHeader>
              <DialogTitle>Job Details</DialogTitle>
              <DialogDescription>
                {format(new Date(job.scheduled_date), "EEEE, MMMM d, yyyy 'at' h:mm a")}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Customer</h3>
                <div className="flex items-center text-sm">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  {job.customers?.full_name || "Unknown Customer"}
                </div>
                {job.customers?.phone && (
                  <div className="flex items-center text-sm">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    {job.customers.phone}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Location</h3>
                <div className="flex items-start text-sm">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span>{job.customers?.address || "No address provided"}</span>
                </div>
              </div>

              {job.notes && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Notes</h3>
                  <div className="flex items-start text-sm">
                    <FileText className="mr-2 h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span className="whitespace-pre-line">{job.notes}</span>
                  </div>
                </div>
              )}

              <div className="rounded-md bg-muted p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Status</span>
                  <span className="capitalize">{job.status.replace("_", " ")}</span>
                </div>
                {isAccepted ? (
                  <div className="mt-2 flex items-center text-sm text-green-600">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    You have accepted this job
                  </div>
                ) : job.acceptance_status === "rejected" ? (
                  <div className="mt-2 flex items-center text-sm text-red-600">
                    <XCircle className="mr-2 h-4 w-4" />
                    You have rejected this job
                  </div>
                ) : (
                  <div className="mt-2 flex items-center text-sm text-yellow-600">
                    <Clock className="mr-2 h-4 w-4" />
                    This job needs your confirmation
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={onClose} className="sm:w-auto w-full">
                Close
              </Button>
              {needsAcceptance && (
                <>
                  <Button
                    variant="destructive"
                    onClick={handleRejectJob}
                    disabled={isLoading}
                    className="sm:w-auto w-full"
                  >
                    {isLoading ? "Processing..." : "Reject Job"}
                  </Button>
                  <Button onClick={handleAcceptJob} disabled={isLoading} className="sm:w-auto w-full">
                    {isLoading ? "Processing..." : "Accept Job"}
                  </Button>
                </>
              )}
              {canStart && (
                <Button onClick={handleStartJob} disabled={isLoading} className="sm:w-auto w-full">
                  {isLoading ? "Processing..." : "Start Job"}
                </Button>
              )}
              {canComplete && (
                <Button onClick={handleCompleteJob} disabled={isLoading} className="sm:w-auto w-full">
                  {isLoading ? "Processing..." : "Complete Job"}
                </Button>
              )}
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Complete Job</DialogTitle>
              <DialogDescription>Please provide details about the completed job</DialogDescription>
            </DialogHeader>

            <JobCompletionForm
              jobId={job.id}
              installerId={installerId}
              onComplete={() => {
                setShowCompletionForm(false)
                onJobUpdated()
                onClose()
              }}
              onCancel={() => setShowCompletionForm(false)}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

