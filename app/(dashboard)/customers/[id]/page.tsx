import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pencil, Plus } from "lucide-react"

export default async function CustomerDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerComponentClient({ cookies })
  const { id } = params

  // Fetch customer details
  const { data: customer, error } = await supabase.from("customers").select("*").eq("id", id).single()

  if (error || !customer) {
    notFound()
  }

  // Fetch customer quotes
  const { data: quotes } = await supabase
    .from("quotes")
    .select("*")
    .eq("customer_id", id)
    .order("created_at", { ascending: false })

  // Fetch customer jobs
  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("customer_id", id)
    .order("scheduled_date", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{customer.full_name}</h2>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href={`/customers/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/quotes/new?customer=${id}`}>
              <Plus className="mr-2 h-4 w-4" />
              New Quote
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                <dd>{customer.email || "Not provided"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                <dd>{customer.phone || "Not provided"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Address</dt>
                <dd className="whitespace-pre-line">{customer.address || "Not provided"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Customer Since</dt>
                <dd>{new Date(customer.created_at).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Notes</dt>
                <dd className="whitespace-pre-line">{customer.notes || "No notes"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="quotes">
        <TabsList>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
        </TabsList>
        <TabsContent value="quotes" className="space-y-4">
          <div className="grid gap-4">
            {quotes && quotes.length > 0 ? (
              quotes.map((quote) => (
                <Link key={quote.id} href={`/quotes/${quote.id}`}>
                  <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Quote #{quote.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(quote.created_at).toLocaleDateString()} - {quote.status}
                          </p>
                        </div>
                        <p className="text-lg font-bold">${quote.total_amount.toFixed(2)}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="py-4 text-muted-foreground">No quotes found for this customer</p>
                  <Button asChild>
                    <Link href={`/quotes/new?customer=${id}`}>Create Quote</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        <TabsContent value="jobs" className="space-y-4">
          <div className="grid gap-4">
            {jobs && jobs.length > 0 ? (
              jobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`}>
                  <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Job #{job.id}</p>
                          <p className="text-sm text-muted-foreground">
                            Scheduled: {new Date(job.scheduled_date).toLocaleDateString()} - {job.status}
                          </p>
                        </div>
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
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="py-4 text-muted-foreground">No jobs found for this customer</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

