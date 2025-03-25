"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getJobs } from "@/lib/data-client"
import { useSearchParams } from "next/navigation"

export default function JobsPage() {
  const searchParams = useSearchParams()
  const status = searchParams.get("status") || ""
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const data = await getJobs(status)
        setJobs(data)
      } catch (error) {
        console.error("Error fetching jobs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [status])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Jobs</h2>
      </div>

      <div className="flex items-center space-x-2">
        <form className="flex-1 sm:max-w-xs">
          <select
            name="status"
            defaultValue={status}
            onChange={(e) => {
              const url = new URL(window.location.href)
              if (e.target.value) {
                url.searchParams.set("status", e.target.value)
              } else {
                url.searchParams.delete("status")
              }
              window.location.href = url.toString()
            }}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="all">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs?.map((job: any) => (
            <Link key={job.id} href={`/jobs/${job.id}`}>
              <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Job #{job.id}</CardTitle>
                      <CardDescription>{job.customers?.full_name || "Unknown Customer"}</CardDescription>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          job.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : job.status === "in_progress"
                              ? "bg-blue-100 text-blue-800"
                              : job.status === "scheduled"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                        }`}
                      >
                        {job.status === "in_progress"
                          ? "In Progress"
                          : job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Scheduled: {new Date(job.scheduled_date).toLocaleDateString()}
                      </p>
                      {job.installer_id && (
                        <p className="text-sm text-muted-foreground">Installer: {job.installer_name || "Assigned"}</p>
                      )}
                      {job.quotes?.id && <p className="text-sm text-muted-foreground">Quote: #{job.quotes.id}</p>}
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {jobs?.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                <h3 className="mt-4 text-lg font-semibold">No jobs found</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                  {status ? `No jobs with status "${status}"` : "You haven't created any jobs yet."}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

