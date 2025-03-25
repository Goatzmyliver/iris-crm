"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, ChevronLeft, ChevronRight } from "lucide-react"

export default function CalendarPage() {
  const supabase = createClientComponentClient()
  const [date, setDate] = useState<Date>(new Date())
  const [month, setMonth] = useState<Date>(new Date())
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedView, setSelectedView] = useState<"month" | "week" | "day">("month")
  const [selectedFilter, setSelectedFilter] = useState<string>("all")
  const [installers, setInstallers] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch all jobs with scheduled dates
        let query = supabase
          .from("jobs")
          .select("*, customers(full_name)")
          .gte("scheduled_date", new Date(month.getFullYear(), month.getMonth(), 1).toISOString())
          .lte("scheduled_date", new Date(month.getFullYear(), month.getMonth() + 1, 0).toISOString())

        if (selectedFilter !== "all") {
          query = query.eq("installer_id", selectedFilter)
        }

        const { data: jobsData } = await query

        // Fetch all follow-ups
        let followupQuery = supabase
          .from("follow_ups")
          .select("*, customers(full_name), enquiries(*)")
          .gte("scheduled_date", new Date(month.getFullYear(), month.getMonth(), 1).toISOString())
          .lte("scheduled_date", new Date(month.getFullYear(), month.getMonth() + 1, 0).toISOString())

        if (selectedFilter !== "all") {
          followupQuery = followupQuery.eq("assigned_to", selectedFilter)
        }

        const { data: followupsData } = await followupQuery

        // Combine and format the data
        const formattedJobs = (jobsData || []).map((job) => ({
          id: job.id,
          title: `Job: ${job.customers?.full_name || "Unknown Customer"}`,
          date: new Date(job.scheduled_date),
          type: "job",
          status: job.status,
          customer: job.customers?.full_name,
          assignedTo: job.installer_id,
          url: `/jobs/${job.id}`,
        }))

        const formattedFollowups = (followupsData || []).map((followup) => ({
          id: followup.id,
          title: `Follow-up: ${followup.customers?.full_name || "Unknown Customer"}`,
          date: new Date(followup.scheduled_date),
          type: "followup",
          status: followup.status,
          customer: followup.customers?.full_name,
          assignedTo: followup.assigned_to,
          url: `/follow-ups/${followup.id}`,
        }))

        setEvents([...formattedJobs, ...formattedFollowups])

        // Fetch installers (users with installer role)
        const { data: installersData } = await supabase.from("profiles").select("id, full_name").eq("role", "installer")

        setInstallers(installersData || [])
      } catch (error) {
        console.error("Error fetching calendar data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase, month, selectedFilter])

  const getDayEvents = (day: Date) => {
    return events.filter(
      (event) =>
        event.date.getDate() === day.getDate() &&
        event.date.getMonth() === day.getMonth() &&
        event.date.getFullYear() === day.getFullYear(),
    )
  }

  const getEventBadgeColor = (event: any) => {
    if (event.type === "job") {
      switch (event.status) {
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
    } else {
      switch (event.status) {
        case "pending":
          return "bg-purple-500"
        case "completed":
          return "bg-green-500"
        case "cancelled":
          return "bg-red-500"
        default:
          return "bg-gray-500"
      }
    }
  }

  const previousMonth = () => {
    setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
  }

  const selectedDateEvents = getDayEvents(date)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Schedule</h2>
        <Button asChild>
          <Link href="/calendar/new">
            <Plus className="mr-2 h-4 w-4" />
            New Event
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
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
                <div className="flex items-center gap-2">
                  <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by installer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Installers</SelectItem>
                      {installers.map((installer) => (
                        <SelectItem key={installer.id} value={installer.id}>
                          {installer.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={selectedView}
                    onValueChange={(value: "month" | "week" | "day") => setSelectedView(value)}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="View" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="day">Day</SelectItem>
                    </SelectContent>
                  </Select>
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
                      const dayEvents = getDayEvents(props.date)
                      return (
                        <div className="relative h-full w-full p-2">
                          <div className="absolute top-0 left-0 right-0 text-center">{props.date.getDate()}</div>
                          <div className="mt-5 flex flex-wrap gap-1 justify-center">
                            {dayEvents.slice(0, 3).map((event, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${getEventBadgeColor(event)}`}
                                title={event.title}
                              />
                            ))}
                            {dayEvents.length > 3 && (
                              <div className="text-xs text-muted-foreground">+{dayEvents.length - 3}</div>
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

        <div className="md:w-1/3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>
                {date.toLocaleDateString("default", { weekday: "long", month: "long", day: "numeric" })}
              </CardTitle>
              <CardDescription>
                {selectedDateEvents.length} event{selectedDateEvents.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateEvents.map((event, index) => (
                    <Link key={index} href={event.url}>
                      <div className="rounded-lg border p-3 transition-colors hover:bg-muted/50">
                        <div className="flex items-center justify-between">
                          <Badge className={getEventBadgeColor(event)}>
                            {event.type === "job" ? "Job" : "Follow-up"}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {event.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <h4 className="mt-2 font-medium">{event.customer}</h4>
                        <p className="text-sm text-muted-foreground">
                          Status: {event.status.charAt(0).toUpperCase() + event.status.slice(1).replace("_", " ")}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-muted-foreground">No events scheduled for this day</p>
                  <Button asChild className="mt-4" variant="outline">
                    <Link href={`/calendar/new?date=${date.toISOString().split("T")[0]}`}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Event
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

