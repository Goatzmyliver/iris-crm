"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format, isSameDay } from "date-fns"
import { ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react"
import { JobAcceptanceDialog } from "@/components/job-acceptance-dialog"
// Import the useMobile hook
import { useMobile } from "@/hooks/use-mobile"

interface InstallerCalendarProps {
  installerId: string
}

export function InstallerCalendar({ installerId }: InstallerCalendarProps) {
  const supabase = createClientComponentClient()
  const [date, setDate] = useState<Date>(new Date())
  const [month, setMonth] = useState<Date>(new Date())
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<any | null>(null)

  // Add the useMobile hook inside the component
  const isMobile = useMobile()

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true)
      try {
        // Fetch all jobs assigned to this installer
        const { data, error } = await supabase
          .from("jobs")
          .select("*, customers(full_name, address, phone)")
          .eq("installer_id", installerId)
          .gte("scheduled_date", new Date(month.getFullYear(), month.getMonth(), 1).toISOString())
          .lte("scheduled_date", new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59).toISOString())
          .order("scheduled_date", { ascending: true })

        if (error) throw error
        setJobs(data || [])
      } catch (error) {
        console.error("Error fetching jobs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [supabase, installerId, month])

  // Fix the date handling in the calendar component
  useEffect(() => {
    // When month changes, make sure the selected date is within that month
    const currentMonth = month.getMonth()
    const currentYear = month.getFullYear()

    // If the selected date is not in the current month view, update it
    if (date.getMonth() !== currentMonth || date.getFullYear() !== currentYear) {
      // Set date to the first day of the current month view
      setDate(new Date(currentYear, currentMonth, 1))
    }
  }, [month])

  const previousMonth = () => {
    setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
  }

  const getDayJobs = (day: Date) => {
    return jobs.filter((job) => {
      const jobDate = new Date(job.scheduled_date)
      return isSameDay(jobDate, day)
    })
  }

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-yellow-500"
      case "in_progress":
        return "bg-blue-500"
      case "completed":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getJobAcceptanceStatus = (job: any) => {
    if (job.acceptance_status === "accepted") {
      return (
        <Badge variant="outline" className="mt-2 bg-green-50 text-green-700 border-green-200">
          Accepted
        </Badge>
      )
    } else if (job.acceptance_status === "rejected") {
      return (
        <Badge variant="outline" className="mt-2 bg-red-50 text-red-700 border-red-200">
          Rejected
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="mt-2 bg-yellow-50 text-yellow-700 border-yellow-200">
          Needs confirmation
        </Badge>
      )
    }
  }

  const selectedDateJobs = getDayJobs(date)

  // Update the return statement to be more responsive
  return (
    <>
      <div className={`flex ${isMobile ? "flex-col" : "flex-col md:flex-row"} gap-6`}>
        {!isMobile && (
          <div className="md:w-2/3 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={previousMonth}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h3 className="text-lg font-medium">
                      {month.toLocaleDateString("default", { month: "long", year: "numeric" })}
                    </h3>
                    <Button variant="outline" size="icon" onClick={nextMonth}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    month={month}
                    onMonthChange={setMonth}
                    className="rounded-md border"
                    components={{
                      DayContent: (props) => {
                        const dayJobs = getDayJobs(props.date)
                        return (
                          <div className="relative h-full w-full p-2">
                            <div className="absolute top-0 left-0 right-0 text-center">{props.date.getDate()}</div>
                            <div className="mt-5 flex flex-wrap gap-1 justify-center">
                              {dayJobs.slice(0, 3).map((job, i) => (
                                <div
                                  key={i}
                                  className={`w-2 h-2 rounded-full ${getJobStatusColor(job.status)}`}
                                  title={job.customers?.full_name || "Unknown Customer"}
                                />
                              ))}
                              {dayJobs.length > 3 && (
                                <div className="text-xs text-muted-foreground">+{dayJobs.length - 3}</div>
                              )}
                            </div>
                          </div>
                        )
                      },
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        )}

        <div className={isMobile ? "w-full" : "md:w-1/3"}>
          {isMobile && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-4">
                <Button variant="outline" size="sm" onClick={previousMonth}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <h3 className="text-lg font-medium">
                  {month.toLocaleDateString("default", { month: "long", year: "numeric" })}
                </h3>
                <Button variant="outline" size="sm" onClick={nextMonth}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from(
                  { length: new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate() },
                  (_, i) => i + 1,
                ).map((day) => {
                  const currentDate = new Date(month.getFullYear(), month.getMonth(), day)
                  const dayJobs = getDayJobs(currentDate)
                  const isSelected = isSameDay(currentDate, date)
                  const hasJobs = dayJobs.length > 0

                  return (
                    <Button
                      key={day}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className={`h-10 p-0 ${hasJobs ? "border-primary border-2" : ""}`}
                      onClick={() => setDate(currentDate)}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <span>{day}</span>
                        {hasJobs && (
                          <div className="flex gap-0.5 mt-0.5">
                            {dayJobs.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                          </div>
                        )}
                      </div>
                    </Button>
                  )
                })}
              </div>
            </div>
          )}

          <Card className="h-full">
            <CardHeader>
              <CardTitle>
                {date.toLocaleDateString("default", { weekday: "long", month: "long", day: "numeric" })}
              </CardTitle>
              <CardDescription>
                {selectedDateJobs.length} job{selectedDateJobs.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDateJobs.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateJobs.map((job) => (
                    <div
                      key={job.id}
                      className="rounded-lg border p-3 transition-colors hover:bg-muted/50 cursor-pointer"
                      onClick={() => setSelectedJob(job)}
                    >
                      <div className="flex items-center justify-between">
                        <Badge className={getJobStatusColor(job.status)}>
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1).replace("_", " ")}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(job.scheduled_date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <h4 className="mt-2 font-medium">{job.customers?.full_name || "Unknown Customer"}</h4>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-2 h-4 w-4" />
                          {format(new Date(job.scheduled_date), "h:mm a")}
                        </div>
                        {job.customers?.address && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="mr-2 h-4 w-4" />
                            {job.customers.address}
                          </div>
                        )}
                        {getJobAcceptanceStatus(job)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-muted-foreground">No jobs scheduled for this day</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedJob && (
        <JobAcceptanceDialog
          job={selectedJob}
          installerId={installerId}
          open={!!selectedJob}
          onClose={() => setSelectedJob(null)}
          onJobUpdated={() => {
            // Refresh the jobs list
            const fetchJobs = async () => {
              const { data } = await supabase
                .from("jobs")
                .select("*, customers(full_name, address, phone)")
                .eq("installer_id", installerId)
                .gte("scheduled_date", new Date(month.getFullYear(), month.getMonth(), 1).toISOString())
                .lte("scheduled_date", new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59).toISOString())
                .order("scheduled_date", { ascending: true })

              if (data) setJobs(data)
            }
            fetchJobs()
          }}
        />
      )}
    </>
  )
}
