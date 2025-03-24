"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { FileCheck, Eye, Download, Printer } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface BookkeeperViewProps {
  quotes: any[]
}

export function BookkeeperView({ quotes }: BookkeeperViewProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})

  // Filter quotes based on search term
  const filteredQuotes = quotes.filter(
    (quote) =>
      quote.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.customers?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleMarkAsInvoiced = async (quoteId: string) => {
    setIsLoading((prev) => ({ ...prev, [quoteId]: true }))

    try {
      const { error } = await supabase
        .from("quotes")
        .update({
          status: "invoiced",
          invoiced_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", quoteId)

      if (error) throw error

      toast({
        title: "Quote marked as invoiced",
        description: "The quote has been marked as invoiced in MYOB",
      })

      router.refresh()
    } catch (error) {
      console.error("Error updating quote:", error)
      toast({
        title: "Error",
        description: "There was an error updating the quote",
        variant: "destructive",
      })
    } finally {
      setIsLoading((prev) => ({ ...prev, [quoteId]: false }))
    }
  }

  // Calculate total value of quotes ready for invoicing
  const totalValue = filteredQuotes.reduce((sum, quote) => sum + (quote.total_amount || 0), 0)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quotes Ready for Invoicing</CardTitle>
          <CardDescription>These quotes have been approved and are ready to be invoiced in MYOB</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search quotes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[300px]"
              />
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
            </div>
          </div>

          {filteredQuotes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No quotes are currently ready for invoicing</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quote #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotes.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell className="font-medium">
                      <Link href={`/quotes/${quote.id}`} className="hover:underline">
                        #{quote.id.slice(-6)}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{quote.customers?.name || "Unknown Customer"}</p>
                        <p className="text-xs text-muted-foreground">{quote.customers?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(quote.created_at), "MMM d, yyyy")}</TableCell>
                    <TableCell>{formatCurrency(quote.total_amount)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/quotes/${quote.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Printer className="h-4 w-4 mr-1" />
                          Print
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Export
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleMarkAsInvoiced(quote.id)}
                          disabled={isLoading[quote.id]}
                        >
                          <FileCheck className="h-4 w-4 mr-1" />
                          {isLoading[quote.id] ? "Processing..." : "Mark as Invoiced"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>MYOB Integration Notes</CardTitle>
          <CardDescription>Information for bookkeepers about the MYOB integration process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Process for Invoicing in MYOB</h3>
              <ol className="list-decimal ml-5 mt-2 space-y-2">
                <li>Review each quote marked as "Ready for Invoicing" in the table above</li>
                <li>Create a corresponding invoice in MYOB using the quote details</li>
                <li>Once the invoice is created in MYOB, click "Mark as Invoiced" in this system</li>
                <li>This will update the status in the CRM and maintain data consistency</li>
              </ol>
            </div>

            <div>
              <h3 className="font-medium">Important Information</h3>
              <ul className="list-disc ml-5 mt-2 space-y-2">
                <li>All prices shown include tax unless otherwise specified</li>
                <li>Customer details should be verified in MYOB before creating invoices</li>
                <li>If a customer doesn't exist in MYOB, please create them first</li>
                <li>For any discrepancies, please contact the account manager</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

