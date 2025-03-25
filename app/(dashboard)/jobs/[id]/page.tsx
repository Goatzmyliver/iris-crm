import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Camera } from "lucide-react"
import { UpdateJobStatus } from "@/components/update-job-status"

export default async function JobDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerComponentClient({ cookies })
  const { id } = params

  // Fetch job details
  const { data: job, error } = await supabase.from("jobs").select("*, customers(*), quotes(*)").eq("id", id).single()

  if (error || !job) {
    notFound()
  }

  // Fetch job items
  const { data: items } = await supabase.from("job_items").select("*, products(name)").eq("job_id", id).order("id")

  // Fetch job photos
  const { data: photos } = await supabase
    .from("job_photos")
    .select("*")
    .eq("job_id", id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Job #{job.id}</h2>
          <p className="text-muted-foreground">Scheduled: {new Date(job.scheduled_date).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-2">
          <UpdateJobStatus job={job} />
          <Button asChild variant="outline">
            <Link href={`/jobs/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/jobs/${id}/photos/upload`}>
              <Camera className="mr-2 h-4 w-4" />
              Upload Photos
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>Job information and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                  <p className="font-medium">
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
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Scheduled Date</h4>
                  <p className="font-medium">{new Date(job.scheduled_date).toLocaleDateString()}</p>
                </div>
              </div>

              {job.installer_id && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Installer</h4>
                  <p className="font-medium">{job.installer_name || job.installer_id}</p>
                </div>
              )}

              {job.notes && (
                <div className="rounded-md border p-4">
                  <h4 className="mb-2 font-medium">Notes</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{job.notes}</p>
                </div>
              )}

              {items && items.length > 0 && (
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="divide-x divide-border">
                        <th className="px-4 py-3.5 text-left text-sm font-semibold">Item</th>
                        <th className="px-4 py-3.5 text-right text-sm font-semibold">Quantity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {items.map((item) => (
                        <tr key={item.id} className="divide-x divide-border">
                          <td className="whitespace-nowrap px-4 py-4">
                            <div className="font-medium">{item.products?.name || item.description}</div>
                            {item.description && item.products?.name !== item.description && (
                              <div className="text-sm text-muted-foreground">{item.description}</div>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-right">{item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">{job.customers?.full_name || "Unknown Customer"}</h4>
                  <p className="text-sm text-muted-foreground">{job.customers?.email}</p>
                  <p className="text-sm text-muted-foreground">{job.customers?.phone}</p>
                </div>
                {job.customers?.address && (
                  <div>
                    <h4 className="text-sm font-medium">Address</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{job.customers.address}</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/customers/${job.customer_id}`}>View Customer</Link>
              </Button>
            </CardFooter>
          </Card>

          {job.quote_id && (
            <Card>
              <CardHeader>
                <CardTitle>Quote</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">This job was created from Quote #{job.quote_id}</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/quotes/${job.quote_id}`}>View Quote</Link>
                </Button>
              </CardFooter>
            </Card>
          )}

          {photos && photos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Job Photos</CardTitle>
                <CardDescription>
                  {photos.length} photo{photos.length !== 1 ? "s" : ""} uploaded
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {photos.slice(0, 4).map((photo) => (
                    <div key={photo.id} className="relative aspect-square overflow-hidden rounded-md">
                      <img
                        src={photo.url || "/placeholder.svg"}
                        alt={`Job photo ${photo.id}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
              {photos.length > 4 && (
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/jobs/${id}/photos`}>View All Photos</Link>
                  </Button>
                </CardFooter>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

