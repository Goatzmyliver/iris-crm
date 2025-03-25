"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Download,
  Send,
  FileText,
  Clock,
  User,
  CalendarDays,
  Edit,
  Printer,
  Copy,
  Check,
} from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"

export default function QuoteDetailPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true)
  const [quote, setQuote] = useState<any>(null)
  const [customer, setCustomer] = useState<any>(null)
  const [lineItems, setLineItems] = useState<any[]>([])
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchQuoteData = async () => {
      try {
        // Fetch quote
        const { data: quoteData, error: quoteError } = await supabase
          .from("quotes")
          .select("*")
          .eq("id", params.id)
          .single()

        if (quoteError) throw quoteError

        setQuote(quoteData)

        // Fetch customer
        const { data: customerData, error: customerError } = await supabase
          .from("customers")
          .select("*")
          .eq("id", quoteData.customer_id)
          .single()

        if (customerError) throw customerError

        setCustomer(customerData)

        // Fetch line items
        const { data: lineItemsData, error: lineItemsError } = await supabase
          .from("quote_items")
          .select("*")
          .eq("quote_id", params.id)
          .order("id")

        if (lineItemsError) throw lineItemsError

        setLineItems(lineItemsData || [])
      } catch (err) {
        console.error("Error fetching quote data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchQuoteData()
  }, [supabase, params.id])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      case "sent":
        return <Badge variant="secondary">Sent</Badge>
      case "approved":
        return <Badge variant="success">Approved</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      case "converted":
        return <Badge variant="default">Converted to Job</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleSendQuote = async () => {
    try {
      const { error } = await supabase.from("quotes").update({ status: "sent" }).eq("id", params.id)

      if (error) throw error

      // Refresh the quote data
      setQuote({ ...quote, status: "sent" })
    } catch (err) {
      console.error("Error sending quote:", err)
    }
  }

  const handleConvertToJob = async () => {
    try {
      // Generate a job ID
      const jobId = `J-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`

      // Create the job
      const { error: jobError } = await supabase.from("jobs").insert({
        id: jobId,
        quote_id: params.id,
        customer_id: customer.id,
        status: "scheduled",
        notes: quote.notes,
      })

      if (jobError) throw jobError

      // Update the quote status
      const { error: quoteError } = await supabase.from("quotes").update({ status: "converted" }).eq("id", params.id)

      if (quoteError) throw quoteError

      // Redirect to the job detail page
      router.push(`/jobs/${jobId}`)
    } catch (err) {
      console.error("Error converting quote to job:", err)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[50vh]">
          <p>Loading quote data...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (!quote || !customer) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <h2 className="text-2xl font-bold mb-2">Quote Not Found</h2>
          <p className="mb-4">The quote you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button asChild>
            <Link href="/quotes">Back to Quotes</Link>
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  // Calculate totals
  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0)
  const baseCost = lineItems.reduce((sum, item) => sum + item.cost_price * item.quantity, 0)
  const totalMarkup = subtotal - baseCost
  const taxRate = 0.15 // 15% GST
  const taxAmount = subtotal * taxRate
  const total = subtotal + taxAmount

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/quotes">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Quote {params.id}</h1>
            {getStatusBadge(quote.status)}
          </div>
          <div className="flex gap-2">
            {quote.status === "draft" && (
              <Button onClick={handleSendQuote}>
                <Send className="mr-2 h-4 w-4" />
                Send Quote
              </Button>
            )}
            {(quote.status === "sent" || quote.status === "approved") && (
              <Button onClick={handleConvertToJob}>
                <CalendarDays className="mr-2 h-4 w-4" />
                Convert to Job
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href={`/quotes/${params.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Quote Details</CardTitle>
              <CardDescription>Review and manage this quote</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                  <div>
                    <h3 className="font-semibold flex items-center">
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      Customer
                    </h3>
                    <div className="mt-1">
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">{customer.email}</p>
                      <p className="text-sm text-muted-foreground">{customer.phone}</p>
                      {customer.address && <p className="text-sm text-muted-foreground">{customer.address}</p>}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                      Quote Information
                    </h3>
                    <div className="mt-1">
                      <p className="text-sm">
                        <span className="text-muted-foreground">Quote #:</span> {params.id}
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Date:</span>{" "}
                        {new Date(quote.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Status:</span>{" "}
                        {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3">Line Items</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b text-sm text-muted-foreground">
                          <th className="py-2 px-1 text-left font-medium">Description</th>
                          <th className="py-2 px-1 text-right font-medium">Quantity</th>
                          <th className="py-2 px-1 text-right font-medium">Unit Price</th>
                          <th className="py-2 px-1 text-right font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lineItems.map((item) => (
                          <tr key={item.id} className="border-b">
                            <td className="py-3 px-1">{item.description}</td>
                            <td className="py-3 px-1 text-right">{item.quantity}</td>
                            <td className="py-3 px-1 text-right">
                              {formatCurrency(item.unit_price || item.cost_price * (1 + item.markup / 100))}
                            </td>
                            <td className="py-3 px-1 text-right">{formatCurrency(item.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 space-y-2 ml-auto w-full max-w-xs">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Markup</span>
                      <span className="text-green-600 font-medium">{formatCurrency(totalMarkup)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>GST (15%)</span>
                      <span>{formatCurrency(taxAmount)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>

                {quote.notes && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">Notes</h3>
                      <p className="text-sm whitespace-pre-line">{quote.notes}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/quotes">Back to Quotes</Link>
              </Button>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </CardFooter>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quote Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Quote Created</p>
                      <p className="text-xs text-muted-foreground">{new Date(quote.created_at).toLocaleString()}</p>
                    </div>
                  </div>

                  {quote.status !== "draft" && (
                    <div className="flex items-start gap-2">
                      <div className="rounded-full bg-primary/10 p-1">
                        <Send className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Quote Sent</p>
                        <p className="text-xs text-muted-foreground">{new Date(quote.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  )}

                  {quote.status === "approved" && (
                    <div className="flex items-start gap-2">
                      <div className="rounded-full bg-green-500/10 p-1">
                        <Check className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Quote Approved</p>
                        <p className="text-xs text-muted-foreground">{new Date(quote.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  )}

                  {quote.status === "converted" && (
                    <div className="flex items-start gap-2">
                      <div className="rounded-full bg-blue-500/10 p-1">
                        <CalendarDays className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Converted to Job</p>
                        <p className="text-xs text-muted-foreground">{new Date(quote.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate Quote
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Clock className="mr-2 h-4 w-4" />
                  Set Follow-up Reminder
                </Button>
                {quote.status === "draft" && (
                  <Button className="w-full justify-start" onClick={handleSendQuote}>
                    <Send className="mr-2 h-4 w-4" />
                    Send to Customer
                  </Button>
                )}
                {(quote.status === "sent" || quote.status === "approved") && (
                  <Button className="w-full justify-start" onClick={handleConvertToJob}>
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Convert to Job
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

