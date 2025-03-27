"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ArrowLeft, Download, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState } from "react"

interface QuotePreviewProps {
  quote: any
  companySettings: any
}

export function QuotePreview({ quote, companySettings }: QuotePreviewProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [isSending, setIsSending] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const handleSendQuote = async () => {
    setIsSending(true)
    try {
      // Update quote status to sent
      const { error } = await supabase.from("quotes").update({ status: "sent" }).eq("id", quote.id)

      if (error) throw error

      // In a real app, you would send an email here

      toast({
        title: "Quote sent",
        description: "The quote has been sent to the customer",
      })

      router.push("/dashboard/quotes")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send quote",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleDownloadPdf = () => {
    // In a real app, you would generate and download a PDF here
    toast({
      title: "Download started",
      description: "Your quote PDF is being generated",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownloadPdf}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          {quote.status === "draft" && (
            <Button onClick={handleSendQuote} disabled={isSending}>
              <Send className="mr-2 h-4 w-4" />
              {isSending ? "Sending..." : "Send to Customer"}
            </Button>
          )}
        </div>
      </div>

      <Card className="print:shadow-none">
        <CardContent className="p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-1">QUOTE</h1>
              <p className="text-muted-foreground">#{quote.quote_number}</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold">{companySettings.company_name || "Your Company"}</h2>
              <p>{companySettings.address || "123 Business St, City, State"}</p>
              <p>{companySettings.phone || "(555) 123-4567"}</p>
              <p>{companySettings.email || "contact@yourcompany.com"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mt-8">
            <div>
              <h3 className="font-semibold text-muted-foreground mb-2">Bill To:</h3>
              <p className="font-medium">{quote.customers?.full_name}</p>
              <p>{quote.customers?.address}</p>
              <p>{quote.customers?.email}</p>
              <p>{quote.customers?.phone}</p>
            </div>
            <div className="text-right">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-semibold text-muted-foreground">Quote Date:</span>
                  <span>{format(new Date(quote.created_at), "MMMM d, yyyy")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-muted-foreground">Expiry Date:</span>
                  <span>{format(new Date(quote.expiry_date), "MMMM d, yyyy")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-muted-foreground">Status:</span>
                  <span className="capitalize">{quote.status}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">Item</th>
                  <th className="py-2 text-left">Description</th>
                  <th className="py-2 text-right">Qty</th>
                  <th className="py-2 text-right">Unit Price</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {quote.quote_items
                  .filter((item: any) => item.is_visible_to_customer)
                  .map((item: any) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-3">{item.name}</td>
                      <td className="py-3">{item.description}</td>
                      <td className="py-3 text-right">{item.quantity}</td>
                      <td className="py-3 text-right">{formatCurrency(item.unit_price)}</td>
                      <td className="py-3 text-right">{formatCurrency(item.total_price)}</td>
                    </tr>
                  ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3}></td>
                  <td className="py-3 text-right font-semibold">Total:</td>
                  <td className="py-3 text-right font-bold">{formatCurrency(quote.total_amount)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {quote.notes && (
            <div className="mt-8">
              <h3 className="font-semibold mb-2">Notes:</h3>
              <p className="whitespace-pre-line">{quote.notes}</p>
            </div>
          )}

          <div className="mt-8">
            <h3 className="font-semibold mb-2">Terms and Conditions:</h3>
            <p className="whitespace-pre-line">{quote.terms_and_conditions}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

