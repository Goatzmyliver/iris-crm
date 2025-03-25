import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Send, FileText, Calendar, ArrowRight } from "lucide-react"

export default async function QuoteDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerComponentClient({ cookies })
  const { id } = params

  // Fetch quote details
  const { data: quote, error } = await supabase
    .from("quotes")
    .select("*, customers(*), enquiries(*)")
    .eq("id", id)
    .single()

  if (error || !quote) {
    notFound()
  }

  // Fetch quote items
  const { data: items } = await supabase.from("quote_items").select("*, products(name)").eq("quote_id", id).order("id")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quote #{quote.id}</h2>
          <p className="text-muted-foreground">{new Date(quote.created_at).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href={`/quotes/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/quotes/${id}/send`}>
              <Send className="mr-2 h-4 w-4" />
              Send
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/quotes/${id}/pdf`} target="_blank">
              <FileText className="mr-2 h-4 w-4" />
              PDF
            </Link>
          </Button>
          {quote.status === "approved" && (
            <Button asChild>
              <Link href={`/quotes/${id}/convert`}>
                <Calendar className="mr-2 h-4 w-4" />
                Convert to Job
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Quote Details</CardTitle>
            <CardDescription>Quote items and pricing information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr className="divide-x divide-border">
                      <th className="px-4 py-3.5 text-left text-sm font-semibold">Item</th>
                      <th className="px-4 py-3.5 text-right text-sm font-semibold">Quantity</th>
                      <th className="px-4 py-3.5 text-right text-sm font-semibold">Unit Price</th>
                      <th className="px-4 py-3.5 text-right text-sm font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {items?.map((item) => (
                      <tr key={item.id} className="divide-x divide-border">
                        <td className="whitespace-nowrap px-4 py-4">
                          <div className="font-medium">{item.products?.name || item.description}</div>
                          {item.description && item.products?.name !== item.description && (
                            <div className="text-sm text-muted-foreground">{item.description}</div>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-right">{item.quantity}</td>
                        <td className="whitespace-nowrap px-4 py-4 text-right">${item.unit_price.toFixed(2)}</td>
                        <td className="whitespace-nowrap px-4 py-4 text-right font-medium">
                          ${(item.quantity * item.unit_price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="divide-x divide-border">
                      <td colSpan={3} className="px-4 py-3.5 text-right text-sm font-semibold">
                        Total
                      </td>
                      <td className="px-4 py-3.5 text-right text-base font-bold">${quote.total_amount.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {quote.notes && (
                <div className="rounded-md border p-4">
                  <h4 className="mb-2 font-medium">Notes</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{quote.notes}</p>
                </div>
              )}

              {/* Only show profit information to staff */}
              <div className="rounded-md border p-4 bg-muted/20">
                <h4 className="mb-2 font-medium">Profit Information (Internal Only)</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Cost Total:</span>
                    <span>${quote.cost_total?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit:</span>
                    <span>${quote.profit?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Profit Margin:</span>
                    <span>
                      {quote.total_amount > 0 ? ((quote.profit / quote.total_amount) * 100).toFixed(2) : "0.00"}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm">Current Status</span>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    quote.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : quote.status === "sent"
                        ? "bg-blue-100 text-blue-800"
                        : quote.status === "draft"
                          ? "bg-gray-100 text-gray-800"
                          : quote.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                </span>
              </div>
              {quote.expiry_date && (
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm">Expiry Date</span>
                  <span className="text-sm font-medium">{new Date(quote.expiry_date).toLocaleDateString()}</span>
                </div>
              )}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm">Show Item Breakdown</span>
                <span className="text-sm font-medium">{quote.show_item_breakdown ? "Yes" : "No"}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">{quote.customers?.full_name || "Unknown Customer"}</h4>
                  <p className="text-sm text-muted-foreground">{quote.customers?.email}</p>
                  <p className="text-sm text-muted-foreground">{quote.customers?.phone}</p>
                </div>
                {quote.customers?.address && (
                  <div>
                    <h4 className="text-sm font-medium">Address</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{quote.customers.address}</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/customers/${quote.customer_id}`}>View Customer</Link>
              </Button>
            </CardFooter>
          </Card>

          {quote.enquiry_id && (
            <Card>
              <CardHeader>
                <CardTitle>Enquiry</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">This quote was created from an enquiry</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {quote.enquiries?.description?.substring(0, 100)}
                  {quote.enquiries?.description?.length > 100 ? "..." : ""}
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/enquiries/${quote.enquiry_id}`}>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    View Enquiry
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

