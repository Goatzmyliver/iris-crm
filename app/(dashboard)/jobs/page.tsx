"use client"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default async function JobsPage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  const supabase = createServerComponentClient({ cookies })
  const status = searchParams.status || ""

  let query = supabase.from("jobs").select("*, customers(full_name), quotes(id)")

  if (status) {
    query = query.eq("status", status)
  }

  const { data: jobs } = await query.order("scheduled_date", {
    ascending: true,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Jobs</h2>
      </div>

      <div className="flex items-center space-x-2">
        <form className="flex-1 sm:max-w-xs">
          <Select
            name="status"
            defaultValue={status}
            onValueChange={(value) => {
              const url = new URL(window.location.href)
              if (value) {
                url.searchParams.set("status", value)
              } else {
                url.searchParams.delete("status")
              }
              window.location.href = url.toString()
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </form>
      </div>

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
    </div>
  )
}

