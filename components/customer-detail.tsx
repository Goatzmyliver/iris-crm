"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Building, Mail, MapPin, Phone, FileText, FileCheck, Pencil, Trash2, AlertTriangle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { createClientComponentClient } from "@/lib/supabase"
import { toast } from "sonner"
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
import CustomerForm from "@/components/customer-form"

interface CustomerDetailProps {
  customer: any
  enquiries: any[]
  quotes: any[]
}

export default function CustomerDetail({ customer, enquiries, quotes }: CustomerDetailProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const supabase = createClientComponentClient()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const { error } = await supabase.from("customers").delete().eq("id", customer.id)

      if (error) throw error

      toast.success("Customer deleted successfully")
      router.push("/customers")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete customer")
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Edit Customer</h2>
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </div>
        <CustomerForm customer={customer} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>{customer.name}</CardTitle>
            <CardDescription>
              Customer since {formatDistanceToNow(new Date(customer.created_at), { addSuffix: true })}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the customer and all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{customer.email || "No email provided"}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{customer.phone || "No phone provided"}</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center text-sm">
                  <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{customer.company || "No company provided"}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{customer.address || "No address provided"}</span>
                </div>
              </div>
            </div>

            {customer.notes && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium mb-2">Notes</h3>
                  <p className="text-sm text-muted-foreground">{customer.notes}</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="enquiries">
        <TabsList>
          <TabsTrigger value="enquiries">Enquiries ({enquiries.length})</TabsTrigger>
          <TabsTrigger value="quotes">Quotes ({quotes.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="enquiries" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Enquiries</CardTitle>
              <Button asChild size="sm">
                <Link href={`/enquiries/new?customer=${customer.id}`}>
                  <FileText className="h-4 w-4 mr-2" />
                  New Enquiry
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {enquiries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertTriangle className="h-8 w-8 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No enquiries found</h3>
                  <p className="text-sm text-muted-foreground mt-1">This customer doesn't have any enquiries yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {enquiries.map((enquiry) => (
                    <div
                      key={enquiry.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <Link href={`/enquiries/${enquiry.id}`} className="font-medium hover:underline">
                          {enquiry.subject}
                        </Link>
                        <div className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(enquiry.created_at), { addSuffix: true })}
                        </div>
                      </div>
                      <Badge>{enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="quotes" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Quotes</CardTitle>
              <Button asChild size="sm">
                <Link href={`/quotes/new?customer=${customer.id}`}>
                  <FileCheck className="h-4 w-4 mr-2" />
                  New Quote
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {quotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertTriangle className="h-8 w-8 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No quotes found</h3>
                  <p className="text-sm text-muted-foreground mt-1">This customer doesn't have any quotes yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {quotes.map((quote) => (
                    <div
                      key={quote.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <Link href={`/quotes/${quote.id}`} className="font-medium hover:underline">
                          Quote #{quote.id.substring(0, 8)}
                        </Link>
                        <div className="text-sm text-muted-foreground">
                          ${Number.parseFloat(quote.amount).toLocaleString()} •
                          {formatDistanceToNow(new Date(quote.created_at), { addSuffix: true })}
                        </div>
                      </div>
                      <Badge>{quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

