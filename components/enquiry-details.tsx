"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { format } from "date-fns"
import { UserPlus, FileText, Edit, Trash } from "lucide-react"

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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EnquiryDetailsProps {
  enquiry: any
}

export function EnquiryDetails({ enquiry }: EnquiryDetailsProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isLoading, setIsLoading] = useState(false)
  const [notes, setNotes] = useState(enquiry.notes || "")
  const [status, setStatus] = useState(enquiry.status || "new")

  const handleUpdateNotes = async () => {
    setIsLoading(true)

    try {
      const { error } = await supabase.from("enquiries").update({ notes }).eq("id", enquiry.id)

      if (error) throw error

      toast({
        title: "Notes updated",
        description: "The enquiry notes have been updated",
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

  const handleUpdateStatus = async (newStatus: string) => {
    setIsLoading(true)

    try {
      const { error } = await supabase.from("enquiries").update({ status: newStatus }).eq("id", enquiry.id)

      if (error) throw error

      setStatus(newStatus)

      toast({
        title: "Status updated",
        description: `The enquiry status has been updated to ${newStatus}`,
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

  const handleDeleteEnquiry = async () => {
    setIsLoading(true)

    try {
      const { error } = await supabase.from("enquiries").delete().eq("id", enquiry.id)

      if (error) throw error

      toast({
        title: "Enquiry deleted",
        description: "The enquiry has been deleted successfully",
      })

      router.push("/enquiries")
      router.refresh()
    } catch (error) {
      console.error("Error deleting enquiry:", error)
      toast({
        title: "Error",
        description: "There was an error deleting the enquiry",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleConvertToCustomer = () => {
    router.push(`/enquiries/${enquiry.id}/convert-to-customer`)
  }

  const handleCreateQuote = () => {
    router.push(`/enquiries/${enquiry.id}/create-quote`)
  }

  // Status badge color mapping
  const statusColorMap: Record<string, string> = {
    new: "bg-blue-500",
    "in-progress": "bg-yellow-500",
    converted: "bg-green-500",
    closed: "bg-gray-500",
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge className={statusColorMap[status] || "bg-gray-500"}>{status}</Badge>
          <div className="flex items-center gap-2">
            <Label htmlFor="status-select">Change status:</Label>
            <Select value={status} onValueChange={handleUpdateStatus} disabled={isLoading}>
              <SelectTrigger id="status-select" className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => router.push(`/enquiries/${enquiry.id}/edit`)}
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <AlertDialog>
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
                  This action cannot be undone. This will permanently delete the enquiry.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteEnquiry}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Enquiry Information</CardTitle>
            <CardDescription>Details about the enquiry</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                <p>{enquiry.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
                <p>{format(new Date(enquiry.created_at), "PPP")}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p>{enquiry.email || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                <p>{enquiry.phone}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                <p>{enquiry.address || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
                <p>{enquiry.enquiry_type}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Source</h3>
                <p>{enquiry.source || "N/A"}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
              <p className="whitespace-pre-wrap">{enquiry.description || "No description provided"}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              className="gap-1"
              onClick={handleConvertToCustomer}
              disabled={!!enquiry.converted_to_customer_id}
            >
              <UserPlus className="h-4 w-4" />
              {enquiry.converted_to_customer_id ? "Already Converted" : "Convert to Customer"}
            </Button>
            <Button className="gap-1" onClick={handleCreateQuote}>
              <FileText className="h-4 w-4" />
              Create Quote
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>Add notes about this enquiry</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this enquiry..."
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
          <TabsTrigger value="conversions">Conversions</TabsTrigger>
        </TabsList>
        <TabsContent value="activity" className="p-4 border rounded-md mt-2">
          <div className="text-center text-muted-foreground py-8">
            Activity tracking will be implemented in a future update
          </div>
        </TabsContent>
        <TabsContent value="conversions" className="p-4 border rounded-md mt-2">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Customer Conversion</h3>
              {enquiry.converted_to_customer_id ? (
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-green-500">Converted</Badge>
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => router.push(`/customers/${enquiry.converted_to_customer_id}`)}
                  >
                    View Customer
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground mt-2">Not converted to a customer yet</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium">Quote Creation</h3>
              {enquiry.converted_to_quote_id ? (
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-green-500">Quote Created</Badge>
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => router.push(`/quotes/${enquiry.converted_to_quote_id}`)}
                  >
                    View Quote
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground mt-2">No quote created yet</p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

