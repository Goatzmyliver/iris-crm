"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { MoreHorizontal, Eye, Edit, Trash, Download, DollarSign } from "lucide-react"

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

interface Invoice {
  id: string
  invoice_date: string
  due_date: string
  total_amount: number
  amount_paid: number
  payment_status: string
  customers: {
    id: number
    name: string
    email: string
  } | null
  quotes: {
    id: string
    name: string
  } | null
}

interface InvoicesTableProps {
  invoices: Invoice[]
}

export function InvoicesTable({ invoices }: InvoicesTableProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const supabase = createClientComponentClient()

  // Filter invoices based on search term
  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.customers?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.payment_status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Status badge color mapping
  const statusColorMap: Record<string, string> = {
    pending: "bg-yellow-500",
    partial: "bg-blue-500",
    paid: "bg-green-500",
    overdue: "bg-red-500",
  }

  const handleDeleteInvoice = async () => {
    if (!invoiceToDelete) return

    setIsDeleting(true)

    try {
      // Delete the invoice
      const { error } = await supabase.from("invoices").delete().eq("id", invoiceToDelete)

      if (error) throw error

      toast({
        title: "Invoice deleted",
        description: "The invoice has been deleted successfully",
      })

      router.refresh()
    } catch (error) {
      console.error("Error deleting invoice:", error)
      toast({
        title: "Error",
        description: "There was an error deleting the invoice",
        variant: "destructive",
      })
    } finally {
      setInvoiceToDelete(null)
      setIsDeleting(false)
    }
  }

  return (
    <Card>
      <div className="p-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search invoices..."
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
              <TableHead>Invoice #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No invoices found
                </TableCell>
              </TableRow>
            ) : (
              filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">
                    <Link href={`/invoices/${invoice.id}`} className="hover:underline">
                      #{invoice.id.slice(-6)}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {invoice.customers ? (
                      <Link href={`/customers/${invoice.customers.id}`} className="hover:underline">
                        {invoice.customers.name}
                      </Link>
                    ) : (
                      "Unknown Customer"
                    )}
                  </TableCell>
                  <TableCell>{format(new Date(invoice.invoice_date), "MMM d, yyyy")}</TableCell>
                  <TableCell>{invoice.due_date ? format(new Date(invoice.due_date), "MMM d, yyyy") : "N/A"}</TableCell>
                  <TableCell>{formatCurrency(invoice.total_amount)}</TableCell>
                  <TableCell>
                    <Badge className={statusColorMap[invoice.payment_status] || "bg-gray-500"}>
                      {invoice.payment_status.charAt(0).toUpperCase() + invoice.payment_status.slice(1)}
                    </Badge>
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
                        <DropdownMenuItem onClick={() => router.push(`/invoices/${invoice.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/invoices/${invoice.id}/edit`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/invoices/${invoice.id}/record-payment`)}>
                          <DollarSign className="mr-2 h-4 w-4" />
                          Record Payment
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setInvoiceToDelete(invoice.id)}>
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

      <AlertDialog open={invoiceToDelete !== null} onOpenChange={(open) => !open && setInvoiceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the invoice. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteInvoice} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

