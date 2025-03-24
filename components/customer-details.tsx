"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { format } from "date-fns"
import { Edit, Trash, FileText, FileCheck } from "lucide-react"

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

interface CustomerDetailsProps {
  customer: any
  quotes: any[]
  invoices: any[]
}

export function CustomerDetails({ customer, quotes, invoices }: CustomerDetailsProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isLoading, setIsLoading] = useState(false)
  const [notes, setNotes] = useState(customer.notes || "")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleUpdateNotes = async () => {
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from("customers")
        .update({ notes, updated_at: new Date().toISOString() })
        .eq("id", customer.id)

      if (error) throw error

      toast({
        title: "Notes updated",
        description: "The customer notes have been updated",
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

  const handleDeleteCustomer = async () => {
    setIsLoading(true)

    try {
      // Check for related quotes and invoices
      if (quotes.length > 0 || invoices.length > 0) {
        toast({
          title: "Cannot delete customer",
          description: "This customer has related quotes or invoices. Please delete those first.",
          variant: "destructive",
        })
        setShowDeleteDialog(false)
        setIsLoading(false)
        return
      }

      const { error } = await supabase.from("customers").delete().eq("id", customer.id)

      if (error) throw error

      toast({
        title: "Customer deleted",
        description: "The customer has been deleted successfully",
      })

      router.push("/customers")
      router.refresh()
    } catch (error) {
      console.error("Error deleting customer:", error)
      toast({
        title: "Error",
        description: "There was an error deleting the customer",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setShowDeleteDialog(false)
    }
  }

  // Stage badge color mapping
  const stageColorMap: Record<string, string> = {
    lead: "bg-blue-500",
    prospect: "bg-yellow-500",
    qualified: "bg-purple-500",
    customer: "bg-green-500",
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <Badge className={stageColorMap[customer.stage] || "bg-gray-500"}>
          {customer.stage ? customer.stage.charAt(0).toUpperCase() + customer.stage.slice(1) : "Unknown"}
        </Badge>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => router.push(`/customers/${customer.id}/edit`)}
          >
            <Edit className="h-4 w-4" />
            Edit
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
                  This action cannot be undone. This will permanently delete the customer and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteCustomer} disabled={isLoading}>
                  {isLoading ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
            <CardDescription>Details about the customer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                <p>{customer.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Date Added</h3>
                <p>{format(new Date(customer.created_at), "PPP")}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p>{customer.email || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                <p>{customer.phone || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Industry</h3>
                <p>{customer.industry || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Company Size</h3>
                <p>{customer.company_size || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Revenue</h3>
                <p>{customer.revenue || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Lead Source</h3>
                <p>{customer.lead_source || "N/A"}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
              <p>
                {[customer.address, customer.city, customer.region, customer.postal_code, customer.country]
                  .filter(Boolean)
                  .join(", ") || "N/A"}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              className="gap-1"
              onClick={() => router.push(`/quotes/new?customer=${customer.id}`)}
            >
              <FileText className="h-4 w-4" />
              Create Quote
            </Button>
            <Button className="gap-1" onClick={() => router.push(`/invoices/new?customer=${customer.id}`)}>
              <FileCheck className="h-4 w-4" />
              Create Invoice
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>Add notes about this customer</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this customer..."
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

      <Tabs defaultValue="quotes">
        <TabsList>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="quotes" className="p-4 border rounded-md mt-2">
          {quotes.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No quotes found for this customer</div>
          ) : (
            <div className="space-y-4">
              {quotes.map((quote) => (
                <div key={quote.id} className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <h3 className="font-medium">{quote.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={
                          quote.status === "draft"
                            ? "outline"
                            : quote.status === "sent"
                              ? "secondary"
                              : quote.status === "accepted"
                                ? "success"
                                : quote.status === "rejected"
                                  ? "destructive"
                                  : "outline"
                        }
                      >
                        {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(quote.created_at), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(quote.total_amount)}</p>
                      {quote.expiry_date && (
                        <p className="text-sm text-muted-foreground">
                          Expires: {format(new Date(quote.expiry_date), "MMM d, yyyy")}
                        </p>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/quotes/${quote.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 flex justify-end">
            <Button asChild>
              <Link href={`/quotes/new?customer=${customer.id}`}>
                <FileText className="mr-2 h-4 w-4" />
                Create New Quote
              </Link>
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="invoices" className="p-4 border rounded-md mt-2">
          {invoices.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No invoices found for this customer</div>
          ) : (
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <h3 className="font-medium">Invoice #{invoice.id.slice(-6)}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={
                          invoice.payment_status === "pending"
                            ? "outline"
                            : invoice.payment_status === "partial"
                              ? "secondary"
                              : invoice.payment_status === "paid"
                                ? "success"
                                : invoice.payment_status === "overdue"
                                  ? "destructive"
                                  : "outline"
                        }
                      >
                        {invoice.payment_status.charAt(0).toUpperCase() + invoice.payment_status.slice(1)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(invoice.invoice_date), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(invoice.total_amount)}</p>
                      {invoice.due_date && (
                        <p className="text-sm text-muted-foreground">
                          Due: {format(new Date(invoice.due_date), "MMM d, yyyy")}
                        </p>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/invoices/${invoice.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 flex justify-end">
            <Button asChild>
              <Link href={`/invoices/new?customer=${customer.id}`}>
                <FileCheck className="mr-2 h-4 w-4" />
                Create New Invoice
              </Link>
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="activity" className="p-4 border rounded-md mt-2">
          <div className="text-center text-muted-foreground py-8">
            Activity tracking will be implemented in a future update
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

