"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { format } from "date-fns"
import { Edit, Trash, Download, Send, CheckCircle, XCircle, DollarSign, FileCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface QuoteDetailsProps {
  quote: any
}

export function QuoteDetails({ quote }: QuoteDetailsProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isLoading, setIsLoading] = useState(false)
  const [notes, setNotes] = useState(quote.notes || "")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleUpdateNotes = async () => {
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from("quotes")
        .update({ notes, updated_at: new Date().toISOString() })
        .eq("id", quote.id)

      if (error) throw error

      toast({
        title: "Notes updated",
        description: "The quote notes have been updated",
      })
    } catch (error) {
      console.error("Error updating notes:", error)
      toast({
        title: "Error",
        description: "There was an error updating the notes",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteQuote = async () => {
    setIsLoading(true)

    try {
      const { error } = await supabase.from("quotes").delete().eq("id", quote.id)

      if (error) throw error

      toast({
        title: "Quote deleted",
        description: "The quote has been deleted successfully",
      })

      router.push("/quotes")
      router.refresh()
    } catch (error) {
      console.error("Error deleting quote:", error)
      toast({
        title: "Error",
        description: "There was an error deleting the quote",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setShowDeleteDialog(false)
    }
  }

  const handleUpdateStatus = async (status: string) => {
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from("quotes")
        .update({
          status,
          updated_at: new Date().toISOString(),
          // If marking as invoiced, record the date
          ...(status === "invoiced" ? { invoiced_at: new Date().toISOString() } : {}),
        })
        .eq("id", quote.id)

      if (error) throw error

      toast({
        title: "Status updated",
        description: `The quote status has been updated to ${status.replace("_", " ")}`,
      })

      router.refresh()
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error",
        description: "There was an error updating the status",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

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

  // Calculate totals
  const subtotal = quote.items?.reduce((sum: number, item: any) => sum + item.total, 0) || 0
  const discount = quote.discount || 0
  const tax = quote.tax || 0
  const total = subtotal - discount + tax

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge className={statusColorMap[quote.status] || "bg-gray-500"}>{formatStatus(quote.status)}</Badge>
          {quote.expiry_date && (
            <span className="text-sm text-muted-foreground">Expires: {format(new Date(quote.expiry_date), "PPP")}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {quote.status === "draft" && (
            <Button variant="outline" size="sm" className="gap-1" onClick={() => handleUpdateStatus("sent")}>
              <Send className="h-4 w-4" />
              Mark as Sent
            </Button>
          )}
          {quote.status === "sent" && (
            <>
              <Button variant="outline" size="sm" className="gap-1" onClick={() => handleUpdateStatus("accepted")}>
                <CheckCircle className="h-4 w-4" />
                Mark as Accepted
              </Button>
              <Button variant="outline" size="sm" className="gap-1" onClick={() => handleUpdateStatus("rejected")}>
                <XCircle className="h-4 w-4" />
                Mark as Rejected
              </Button>
            </>
          )}
          {quote.status === "accepted" && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => handleUpdateStatus("ready_for_invoicing")}
            >
              <DollarSign className="h-4 w-4" />
              Ready for Invoicing
            </Button>
          )}
          {quote.status === "ready_for_invoicing" && (
            <Button variant="outline" size="sm" className="gap-1" onClick={() => handleUpdateStatus("invoiced")}>
              <FileCheck className="h-4 w-4" />
              Mark as Invoiced in MYOB
            </Button>
          )}
          <Button variant="outline" size="sm" className="gap-1" onClick={() => router.push(`/quotes/${quote.id}/edit`)}>
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="gap-1">
                <Trash className="h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the quote.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteQuote} disabled={isLoading}>
                  {isLoading ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Quote Details</CardTitle>
            <CardDescription>Quote #{quote.id.slice(-6)}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Customer</h3>
                  <p className="font-medium">
                    <Link href={`/customers/${quote.customers?.id}`} className="hover:underline">
                      {quote.customers?.name || "Unknown Customer"}
                    </Link>
                  </p>
                  {quote.customers?.email && <p className="text-sm">{quote.customers.email}</p>}
                  {quote.customers?.phone && <p className="text-sm">{quote.customers.phone}</p>}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Quote Information</h3>
                  <p>Created: {format(new Date(quote.created_at), "PPP")}</p>
                  {quote.expiry_date && <p>Expires: {format(new Date(quote.expiry_date), "PPP")}</p>}
                  {quote.status === "invoiced" && quote.invoiced_at && (
                    <p>Invoiced: {format(new Date(quote.invoiced_at), "PPP")}</p>
                  )}
                </div>
              </div>

              {quote.description && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                  <p>{quote.description}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50%]">Description</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quote.items && quote.items.length > 0 ? (
                      quote.items.map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{formatCurrency(item.unit_price)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.total)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          No items
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end">
                <div className="w-1/3 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>Add notes about this quote</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this quote..."
              rows={8}
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleUpdateNotes} disabled={isLoading} className="ml-auto">
              {isLoading ? "Saving..." : "Save Notes"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="activity">
        <TabsList>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="activity" className="p-4 border rounded-md mt-2">
          <div className="text-center text-muted-foreground py-8">
            Activity tracking will be implemented in a future update
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

