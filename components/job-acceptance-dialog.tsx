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
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { AlertCircle, Calendar, Clock, MapPin, Phone, User } from "lucide-react"
import { toast } from "sonner"

interface JobAcceptanceDialogProps {
  job: any
  installerId: string
  open: boolean
  onClose: () => void
  onJobUpdated: () => void
}

export function JobAcceptanceDialog({ job, installerId, open, onClose, onJobUpdated }: JobAcceptanceDialogProps) {
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState("")

  const handleAcceptJob = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from("jobs")
        .update({
          acceptance_status: "accepted",
          installer_notes: notes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", job.id)

      if (error) throw error

      // Add a job update entry
      await supabase.from("job_updates").insert({
        job_id: job.id,
        update_text: `Job accepted by installer${notes ? `: "${notes}"` : ""}`,
        status: "accepted",
        created_by: installerId,
      })

      toast.success("Job accepted successfully")
      onJobUpdated()
      onClose()
    } catch (error) {
      console.error("Error accepting job:", error)
      toast.error("Failed to accept job")
    } finally {
      setLoading(false)
    }
  }

  const handleRejectJob = async () => {
    if (!notes) {
      toast.error("Please provide a reason for rejecting this job")
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from("jobs")
        .update({
          acceptance_status: "rejected",
          installer_notes: notes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", job.id)

      if (error) throw error

      // Add a job update entry
      await supabase.from("job_updates").insert({
        job_id: job.id,
        update_text: `Job rejected by installer: "${notes}"`,
        status: "rejected",
        created_by: installerId,
      })

      toast.success("Job rejected successfully")
      onJobUpdated()
      onClose()
    } catch (error) {
      console.error("Error rejecting job:", error)
      toast.error("Failed to reject job")
    } finally {
      setLoading(false)
    }
  }

  if (!job) return null

  const isJobAccepted = job.acceptance_status === "accepted"
  const isJobRejected = job.acceptance_status === "rejected"
  const needsAction = !isJobAccepted && !isJobRejected

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Job Details</DialogTitle>
          <DialogDescription>
            {needsAction
              ? "Please confirm if you can complete this job."
              : isJobAccepted
                ? "You have accepted this job."
                : "You have rejected this job."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <User className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{job.customers?.full_name || "Unknown Customer"}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{format(new Date(job.scheduled_date), "EEEE, MMMM d, yyyy")}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{format(new Date(job.scheduled_date), "h:mm a")}</span>
            </div>
            {job.customers?.address && (
              <div className="flex items-start">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{job.customers.address}</span>
              </div>
            )}
            {job.customers?.phone && (
              <div className="flex items-center">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{job.customers.phone}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Job Description</h4>
            <p className="text-sm text-muted-foreground">{job.description || "No description provided."}</p>
          </div>

          {(isJobAccepted || isJobRejected) && job.installer_notes && (
            <div className="space-y-2">
              <h4 className="font-medium">Your Notes</h4>
              <p className="text-sm text-muted-foreground">{job.installer_notes}</p>
            </div>
          )}

          {needsAction && (
            <div className="space-y-2">
              <div className="flex items-start">
                <AlertCircle className="mr-2 h-4 w-4 text-amber-500" />
                <span className="text-sm">This job requires your confirmation.</span>
              </div>
              <Textarea
                placeholder="Add notes about this job (required for rejection)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-24"
              />
            </div>
          )}
        </div>

        <DialogFooter className="flex sm:justify-between">
          {needsAction ? (
            <>
              <Button variant="destructive" onClick={handleRejectJob} disabled={loading}>
                {loading ? "Rejecting..." : "Reject Job"}
              </Button>
              <Button onClick={handleAcceptJob} disabled={loading}>
                {loading ? "Accepting..." : "Accept Job"}
              </Button>
            </>
          ) : (
            <Button onClick={onClose}>Close</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
