"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"

interface JobSchedulerProps {
  job: {
    id: string
    scheduled_date: string
    installer_id: string | null
    installer_name: string | null
  }
  installers: Array<{
    id: string
    full_name: string
  }>
}

export function JobScheduler({ job, installers }: JobSchedulerProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const initialDate = new Date(job.scheduled_date)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialDate)
  const [selectedTime, setSelectedTime] = useState(
    `${initialDate.getHours().toString().padStart(2, "0")}:${initialDate.getMinutes().toString().padStart(2, "0")}`,
  )
  const [selectedInstaller, setSelectedInstaller] = useState(job.installer_id || "")

  const updateSchedule = async () => {
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
        title: "Schedule updated",
        description: "Job schedule has been updated successfully.",
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update schedule",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule & Assignment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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

        <div className="space-y-2">
          <label className="text-sm font-medium">Assigned Installer</label>
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

        <Button onClick={updateSchedule} disabled={isLoading} className="w-full">
          {isLoading ? "Updating..." : "Update Schedule"}
        </Button>
      </CardContent>
    </Card>
  )
}

