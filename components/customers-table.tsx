"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Search } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Customer {
  id: string
  name: string
  email: string | null
  phone: string | null
  company: string | null
  created_at: string
}

export function CustomersTable({ customers }: { customers: Customer[] }) {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter customers based on search term
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (customer.phone && customer.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (customer.company && customer.company.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search customers..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>
              <TableHead className="hidden lg:table-cell">Company</TableHead>
              <TableHead className="hidden lg:table-cell">Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{customer.email || "-"}</TableCell>
                  <TableCell className="hidden md:table-cell">{customer.phone || "-"}</TableCell>
                  <TableCell className="hidden lg:table-cell">{customer.company || "-"}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {formatDistanceToNow(new Date(customer.created_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/customers/${customer.id}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  {customers.length === 0 ? "No customers found" : "No matching customers found"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

