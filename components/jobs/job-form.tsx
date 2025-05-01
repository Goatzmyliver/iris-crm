"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"

interface Customer {
  id: string
  full_name: string
}

interface Installer {
  id: string
  full_name: string
}

interface Job {
  id: string
  job_number: string
  customer_id: string
  installer_id: string
  scheduled_date: string
  status: string
  notes: string
}

interface JobFormProps {
  job?: Job
  customers: Customer[]
  installers: Installer[]
}

export function JobForm({ job, customers, installers }: JobFormProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    customer_id: job?.customer_id || "",
    installer_id: job?.installer_id || "",
    scheduled_date: job?.scheduled_date || format(new Date(), "yyyy-MM-dd"),
    status: job?.status || "scheduled",
    notes: job?.notes || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (job) {
        // Update existing job
        const { error } = await supabase.from("jobs").update(formData).eq("id", job.id)

        if (error) throw error

        toast({
          title: "Job updated",
          description: "The job has been updated successfully",
        })
      } else {
        // Create new job
        const { error } = await supabase.from("jobs").insert(formData)

        if (error) throw error

        toast({
          title: "Job created",
          description: "The job has been created successfully",
        })
      }

      router.push("/dashboard/jobs")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save job",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer_id">Customer</Label>
            <Select value={formData.customer_id} onValueChange={(value) => handleSelectChange("customer_id", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="installer_id">Installer</Label>
            <Select value={formData.installer_id} onValueChange={(value) => handleSelectChange("installer_id", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select an installer" />
              </SelectTrigger>
              <SelectContent>
                {installers.map((installer) => (
                  <SelectItem key={installer.id} value={installer.id}>
                    {installer.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scheduled_date">Scheduled Date</Label>
            <Input
              id="scheduled_date"
              name="scheduled_date"
              type="date"
              value={formData.scheduled_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/jobs")} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : job ? "Update Job" : "Create Job"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
