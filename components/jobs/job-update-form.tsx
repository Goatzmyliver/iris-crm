"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

interface JobUpdateFormProps {
  jobId: string
}

export function JobUpdateForm({ jobId }: JobUpdateFormProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isLoading, setIsLoading] = useState(false)
  const [updateType, setUpdateType] = useState("status_update")
  const [notes, setNotes] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.from("job_updates").insert({
        job_id: jobId,
        update_type: updateType,
        notes,
      })

      if (error) throw error

      toast({
        title: "Update added",
        description: "Your job update has been added successfully.",
      })

      // Reset form
      setUpdateType("status_update")
      setNotes("")

      // Refresh the page to show the new update
      router.refresh()
    } catch (error) {
      console.error("Error adding job update:", error)
      toast({
        title: "Error",
        description: "There was a problem adding your update. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Update</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="update-type" className="text-sm font-medium">
              Update Type
            </label>
            <Select value={updateType} onValueChange={setUpdateType}>
              <SelectTrigger id="update-type">
                <SelectValue placeholder="Select update type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="status_update">Status Update</SelectItem>
                <SelectItem value="customer_contact">Customer Contact</SelectItem>
                <SelectItem value="issue_reported">Issue Reported</SelectItem>
                <SelectItem value="materials_update">Materials Update</SelectItem>
                <SelectItem value="schedule_change">Schedule Change</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Notes
            </label>
            <Textarea
              id="notes"
              placeholder="Enter update details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              required
            />
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Update"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
