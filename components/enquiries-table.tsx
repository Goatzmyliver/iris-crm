"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { MoreHorizontal, Eye, UserPlus, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Enquiry {
  id: string
  name: string
  email: string
  phone: string
  enquiry_type: string
  status: string
  created_at: string
  converted_to_customer_id: number | null
  converted_to_quote_id: string | null
}

interface EnquiriesTableProps {
  enquiries: Enquiry[]
}

export function EnquiriesTable({ enquiries }: EnquiriesTableProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  // Filter enquiries based on search term
  const filteredEnquiries = enquiries.filter(
    (enquiry) =>
      enquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.enquiry_type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Status badge color mapping
  const statusColorMap: Record<string, string> = {
    new: "bg-blue-500",
    "in-progress": "bg-yellow-500",
    converted: "bg-green-500",
    closed: "bg-gray-500",
  }

  return (
    <Card>
      <div className="p-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search enquiries..."
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
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEnquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No enquiries found
                </TableCell>
              </TableRow>
            ) : (
              filteredEnquiries.map((enquiry) => (
                <TableRow key={enquiry.id}>
                  <TableCell className="font-medium">
                    <Link href={`/enquiries/${enquiry.id}`} className="hover:underline">
                      {enquiry.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      {enquiry.email && <span className="text-xs">{enquiry.email}</span>}
                      <span className="text-xs">{enquiry.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>{enquiry.enquiry_type}</TableCell>
                  <TableCell>
                    <Badge className={statusColorMap[enquiry.status] || "bg-gray-500"}>{enquiry.status}</Badge>
                  </TableCell>
                  <TableCell>{formatDistanceToNow(new Date(enquiry.created_at), { addSuffix: true })}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/enquiries/${enquiry.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/enquiries/${enquiry.id}/convert-to-customer`)}
                          disabled={!!enquiry.converted_to_customer_id}
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          Convert to Customer
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/enquiries/${enquiry.id}/create-quote`)}>
                          <FileText className="mr-2 h-4 w-4" />
                          Create Quote
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
    </Card>
  )
}

