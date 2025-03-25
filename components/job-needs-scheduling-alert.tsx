"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { AlertCircle, CalendarIcon, Clock } from "lucide-react"

interface JobNeedsSchedulingAlertProps {
  job: {
    id: string
    scheduled_date: string
  }
  installers: Array<{
    id: string
    full_name: string
  }>
}

export function JobNeedsSchedulingAlert({ job, installers }: JobNeedsSchedulingAlertProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isScheduling, setIsScheduling] = useState(false)

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState("09:00")
  const [selectedInstaller, setSelectedInstaller] = useState("")

  const scheduleJob = async () => {
    setIsLoading(true)

    try {
      if (!selectedDate) {
        throw new Error("Please select a scheduled date")
      }

      // Combine date and time
      const scheduledDate = new Date(selectedDate)
      const [hours, minutes] = selectedTime.split(":").map(Number)
      scheduledDate.setHours(hours, minutes)

      // Get installer name if an installer is selected
      let installerName = null
      if (selectedInstaller) {
        const installer = installers.find((i) => i.id === selectedInstaller)
        installerName = installer ? installer.full_name : null
      }

      const { error } = await supabase
        .from("jobs")
        .update({
          scheduled_date: scheduledDate.toISOString(),
          installer_id: selectedInstaller || null,
          installer_name: installerName,
        })
        .eq("id", job.id)

      if (error) {
        throw error
      }

      toast({
        title: "Job scheduled",
        description: "The job has been successfully scheduled.",
      })

      setIsScheduling(false)
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to schedule job",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Check if the job needs scheduling (scheduled date is in the past or too close to now)
  const scheduledDate = new Date(job.scheduled_date)
  const now = new Date()
  const needsScheduling = scheduledDate < now || scheduledDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000 // Less than 24 hours from now

  if (!needsScheduling) {
    return null
  }

  return (
    <Alert variant="warning" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Job Needs Scheduling</AlertTitle>
      <AlertDescription className="mt-2">
        {isScheduling ? (
          <div className="space-y-4 mt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Scheduled Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Scheduled Time</label>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input type="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} required />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Assign Installer</label>
              <Select value={selectedInstaller} onValueChange={setSelectedInstaller}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an installer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {installers.map((installer) => (
                    <SelectItem key={installer.id} value={installer.id}>
                      {installer.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsScheduling(false)}>
                Cancel
              </Button>
              <Button onClick={scheduleJob} disabled={isLoading}>
                {isLoading ? "Scheduling..." : "Schedule Job"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4">
            <div className="flex-1">
              This job needs to be scheduled. Please set a date and time for the installation.
            </div>
            <Button onClick={() => setIsScheduling(true)}>Schedule Now</Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  )
}

