"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal, UserPlus, FileText, Edit, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { convertEnquiryToCustomer, convertEnquiryToQuote, deleteEnquiry } from "@/lib/enquiries"

type Enquiry = {
  id: number
  name: string
  status: string
  convertedToCustomerId: number | null
  convertedToQuoteId: string | null
}

export function EnquiryActions({ enquiry }: { enquiry: Enquiry }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      await deleteEnquiry(enquiry.id)

      toast({
        title: "Enquiry deleted",
        description: "The enquiry has been deleted successfully.",
      })

      router.push("/enquiries")
    } catch (error) {
      console.error("Error deleting enquiry:", error)

      toast({
        title: "Error",
        description: "There was an error deleting the enquiry. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const handleConvertToCustomer = async () => {
    if (enquiry.convertedToCustomerId) {
      toast({
        title: "Already converted",
        description: "This enquiry has already been converted to a customer.",
      })
      return
    }

    setIsConverting(true)

    try {
      const result = await convertEnquiryToCustomer(enquiry.id)

      toast({
        title: "Enquiry converted",
        description: "The enquiry has been converted to a customer successfully.",
      })

      router.refresh()
      router.push(`/customers/${result.customerId}`)
    } catch (error) {
      console.error("Error converting enquiry to customer:", error)

      toast({
        title: "Error",
        description: "There was an error converting the enquiry to a customer. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConverting(false)
    }
  }

  const handleConvertToQuote = async () => {
    if (enquiry.convertedToQuoteId) {
      toast({
        title: "Already converted",
        description: "This enquiry has already been converted to a quote.",
      })
      return
    }

    setIsConverting(true)

    try {
      const result = await convertEnquiryToQuote(enquiry.id)

      toast({
        title: "Enquiry converted",
        description: "The enquiry has been converted to a quote successfully.",
      })

      router.refresh()
      router.push(`/quotes/${result.quoteId}`)
    } catch (error) {
      console.error("Error converting enquiry to quote:", error)

      toast({
        title: "Error",
        description: "There was an error converting the enquiry to a quote. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConverting(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="gap-1"
        disabled={isConverting || enquiry.convertedToCustomerId !== null}
        onClick={handleConvertToCustomer}
      >
        <UserPlus className="h-4 w-4" />
        <span className="hidden sm:inline">Convert to Customer</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="gap-1"
        disabled={isConverting || enquiry.convertedToQuoteId !== null}
        onClick={handleConvertToQuote}
      >
        <FileText className="h-4 w-4" />
        <span className="hidden sm:inline">Create Quote</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.push(`/enquiries/${enquiry.id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Enquiry</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this enquiry? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

