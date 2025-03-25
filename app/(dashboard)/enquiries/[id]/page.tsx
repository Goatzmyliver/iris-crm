import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, ArrowRight, Phone, Mail, Calendar } from "lucide-react"
import { UpdateEnquiryStatus } from "@/components/update-enquiry-status"

export default async function EnquiryDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerComponentClient({ cookies })
  const { id } = params

  // Fetch enquiry details
  const { data: enquiry, error } = await supabase.from("enquiries").select("*, customers(*)").eq("id", id).single()

  if (error || !enquiry) {
    notFound()
  }

  // Fetch related quotes if any
  const { data: quotes } = await supabase
    .from("quotes")
    .select("*")
    .eq("enquiry_id", id)
    .order("created_at", { ascending: false })

  // Format the date
  const formattedDate = new Date(enquiry.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{enquiry.customers?.full_name}</h2>
          <p className="text-muted-foreground">Enquiry from {formattedDate}</p>
        </div>
        <div className="flex items-center gap-2">
          <UpdateEnquiryStatus enquiry={enquiry} />
          <Button asChild variant="outline">
            <Link href={`/enquiries/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          {enquiry.status !== "converted" && enquiry.status !== "lost" && (
            <Button asChild>
              <Link href={`/quotes/new?enquiry=${id}`}>
                <ArrowRight className="mr-2 h-4 w-4" />
                Create Quote
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Enquiry Details</CardTitle>
            <CardDescription>Information about the customer's request</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                <div className="mt-1">
                  {enquiry.status === "new" && <Badge className="bg-blue-500">New</Badge>}
                  {enquiry.status === "contacted" && <Badge className="bg-yellow-500">Contacted</Badge>}
                  {enquiry.status === "quoted" && <Badge className="bg-purple-500">Quoted</Badge>}
                  {enquiry.status === "converted" && <Badge className="bg-green-500">Converted</Badge>}
                  {enquiry.status === "lost" && (
                    <Badge variant="outline" className="text-red-500 border-red-500">
                      Lost
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Source</h4>
                <p className="font-medium capitalize">{enquiry.source.replace("_", " ")}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
              <p className="whitespace-pre-line">{enquiry.description}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Product Interest</h4>
                <p className="font-medium capitalize">{enquiry.product_interest.replace("_", " ")}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Room Type</h4>
                <p className="font-medium">{enquiry.room_type || "Not specified"}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Approximate Size</h4>
                <p className="font-medium">{enquiry.approximate_size || "Not specified"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Budget Range</h4>
                <p className="font-medium">{enquiry.budget_range || "Not specified"}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Preferred Contact Method</h4>
                <p className="font-medium capitalize">{enquiry.preferred_contact_method.replace("_", " ")}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Preferred Contact Time</h4>
                <p className="font-medium">{enquiry.preferred_contact_time || "Any time"}</p>
              </div>
            </div>

            {enquiry.notes && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Additional Notes</h4>
                <p className="whitespace-pre-line">{enquiry.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">{enquiry.customers?.full_name}</h4>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center text-sm">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    {enquiry.customers?.phone || "No phone provided"}
                  </div>
                  <div className="flex items-center text-sm">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    {enquiry.customers?.email || "No email provided"}
                  </div>
                </div>
              </div>
              {enquiry.customers?.address && (
                <div>
                  <h4 className="text-sm font-medium">Address</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{enquiry.customers.address}</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/customers/${enquiry.customer_id}`}>View Customer</Link>
              </Button>
            </CardFooter>
          </Card>

          {quotes && quotes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Related Quotes</CardTitle>
                <CardDescription>
                  {quotes.length} quote{quotes.length !== 1 ? "s" : ""} created from this enquiry
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quotes.slice(0, 3).map((quote) => (
                    <Link key={quote.id} href={`/quotes/${quote.id}`}>
                      <div className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted/50">
                        <div>
                          <p className="font-medium">Quote #{quote.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(quote.created_at).toLocaleDateString()} - {quote.status}
                          </p>
                        </div>
                        <p className="font-bold">${quote.total_amount.toFixed(2)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
              {quotes.length > 3 && (
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/quotes?enquiry=${id}`}>View All Quotes</Link>
                  </Button>
                </CardFooter>
              )}
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Follow-up</CardTitle>
              <CardDescription>Schedule a follow-up with this customer</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/calendar/new?enquiry=${id}`}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Follow-up
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

