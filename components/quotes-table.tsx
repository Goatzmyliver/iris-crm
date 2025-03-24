"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { MoreHorizontal, Eye, Edit, Trash, FileCheck, Send, Download, DollarSign } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { formatCurrency } from "@/lib/utils"

interface Quote {
  id: string
  name: string
  status: string
  total_amount: number
  created_at: string
  expiry_date: string
  customers: {
    id: number
    name: string
    email: string
  } | null
}

interface QuotesTableProps {
  quotes: Quote[]
}

export function QuotesTable({ quotes }: QuotesTableProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [quoteToDelete, setQuoteToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const supabase = createClientComponentClient()

  // Filter quotes based on search term
  const filteredQuotes = quotes.filter(
    (quote) =>
      quote.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.customers?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Status badge color mapping
  const statusColorMap: Record<string, string> = {
    draft: "bg-gray-500",
    sent: "bg-blue-500",
    accepted: "bg-green-500",
    rejected: "bg-red-500",
    ready_for_invoicing: "bg-purple-500",
    invoiced: "bg-emerald-500",
  }

  // Format status for display
  const formatStatus = (status: string) => {
    return status
      .replace("_", " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const handleDeleteQuote = async () => {
    if (!quoteToDelete) return

    setIsDeleting(true)

    try {
      // Delete the quote
      const { error } = await supabase.from("quotes").delete().eq("id", quoteToDelete)

      if (error) throw error

      toast({
        title: "Quote deleted",
        description: "The quote has been deleted successfully",
      })

      router.refresh()
    } catch (error) {
      console.error("Error deleting quote:", error)
      toast({
        title: "Error",
        description: "There was an error deleting the quote",
        variant: "destructive",
      })
    } finally {
      setQuoteToDelete(null)
      setIsDeleting(false)
    }
  }

  const handleUpdateStatus = async (quoteId: string, status: string) => {
    try {
      // Update quote status
      const { error } = await supabase
        .from("quotes")
        .update({
          status,
          updated_at: new Date().toISOString(),
          ...(status === "invoiced" ? { invoiced_at: new Date().toISOString() } : {}),
        })
        .eq("id", quoteId)

      if (error) throw error

      toast({
        title: "Status updated",
        description: `The quote status has been updated to ${formatStatus(status)}`,
      })

      router.refresh()
    } catch (error) {
      console.error("Error updating quote status:", error)
      toast({
        title: "Error",
        description: "There was an error updating the quote status",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <div className="p-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search quotes..."
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="border-t">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quote</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuotes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No quotes found
                </TableCell>
              </TableRow>
            ) : (
              filteredQuotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell className="font-medium">
                    <Link href={`/quotes/${quote.id}`} className="hover:underline">
                      {quote.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {quote.customers ? (
                      <Link href={`/customers/${quote.customers.id}`} className="hover:underline">
                        {quote.customers.name}
                      </Link>
                    ) : (
                      "Unknown Customer"
                    )}
                  </TableCell>
                  <TableCell>{formatCurrency(quote.total_amount)}</TableCell>
                  <TableCell>
                    <Badge className={statusColorMap[quote.status] || "bg-gray-500"}>
                      {formatStatus(quote.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(quote.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    {quote.expiry_date ? format(new Date(quote.expiry_date), "MMM d, yyyy") : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/quotes/${quote.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/quotes/${quote.id}/edit`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>

                        {quote.status === "draft" && (
                          <DropdownMenuItem onClick={() => handleUpdateStatus(quote.id, "sent")}>
                            <Send className="mr-2 h-4 w-4" />
                            Mark as Sent
                          </DropdownMenuItem>
                        )}

                        {quote.status === "accepted" && (
                          <DropdownMenuItem onClick={() => handleUpdateStatus(quote.id, "ready_for_invoicing")}>
                            <DollarSign className="mr-2 h-4 w-4" />
                            Ready for Invoicing
                          </DropdownMenuItem>
                        )}

                        {quote.status === "ready_for_invoicing" && (
                          <DropdownMenuItem onClick={() => handleUpdateStatus(quote.id, "invoiced")}>
                            <FileCheck className="mr-2 h-4 w-4" />
                            Mark as Invoiced
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => setQuoteToDelete(quote.id)}>
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={quoteToDelete !== null} onOpenChange={(open) => !open && setQuoteToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the quote. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteQuote} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

