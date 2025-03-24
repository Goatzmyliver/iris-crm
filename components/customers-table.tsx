"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { MoreHorizontal, Eye, Edit, Trash, FileText } from "lucide-react"

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

interface Customer {
  id: number
  name: string
  email: string
  phone: string
  industry: string
  stage: string
  created_at: string
}

interface CustomersTableProps {
  customers: Customer[]
}

export function CustomersTable({ customers }: CustomersTableProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [customerToDelete, setCustomerToDelete] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const supabase = createClientComponentClient()

  // Filter customers based on search term
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.industry?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Stage badge color mapping
  const stageColorMap: Record<string, string> = {
    lead: "bg-blue-500",
    prospect: "bg-yellow-500",
    qualified: "bg-purple-500",
    customer: "bg-green-500",
  }

  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return

    setIsDeleting(true)

    try {
      // Check for related quotes and invoices
      const { data: relatedQuotes } = await supabase
        .from("quotes")
        .select("id")
        .eq("customer_id", customerToDelete)
        .limit(1)

      const { data: relatedInvoices } = await supabase
        .from("invoices")
        .select("id")
        .eq("customer_id", customerToDelete)
        .limit(1)

      if (relatedQuotes?.length || relatedInvoices?.length) {
        toast({
          title: "Cannot delete customer",
          description: "This customer has related quotes or invoices. Please delete those first.",
          variant: "destructive",
        })
        setCustomerToDelete(null)
        setIsDeleting(false)
        return
      }

      // Delete the customer
      const { error } = await supabase.from("customers").delete().eq("id", customerToDelete)

      if (error) throw error

      toast({
        title: "Customer deleted",
        description: "The customer has been deleted successfully",
      })

      router.refresh()
    } catch (error) {
      console.error("Error deleting customer:", error)
      toast({
        title: "Error",
        description: "There was an error deleting the customer",
        variant: "destructive",
      })
    } finally {
      setCustomerToDelete(null)
      setIsDeleting(false)
    }
  }

  return (
    <Card>
      <div className="p-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search customers..."
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
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Added</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No customers found
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    <Link href={`/customers/${customer.id}`} className="hover:underline">
                      {customer.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      {customer.email && <span className="text-xs">{customer.email}</span>}
                      {customer.phone && <span className="text-xs">{customer.phone}</span>}
                    </div>
                  </TableCell>
                  <TableCell>{customer.industry || "—"}</TableCell>
                  <TableCell>
                    <Badge className={stageColorMap[customer.stage] || "bg-gray-500"}>
                      {customer.stage || "Unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDistanceToNow(new Date(customer.created_at), { addSuffix: true })}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/customers/${customer.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/customers/${customer.id}/edit`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/quotes/new?customer=${customer.id}`)}>
                          <FileText className="mr-2 h-4 w-4" />
                          Create Quote
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCustomerToDelete(customer.id)}>
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

      <AlertDialog open={customerToDelete !== null} onOpenChange={(open) => !open && setCustomerToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the customer and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCustomer} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

