"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Eye, Plus, Search } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Enquiry {
  id: number
  name: string
  email: string | null
  phone: string
  enquiry_type: string
  status: string
  created_at: string
}

export default function EnquiriesTable({ enquiries }: { enquiries: Enquiry[] }) {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter enquiries based on search term
  const filteredEnquiries = enquiries.filter(
    (enquiry) =>
      enquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (enquiry.email && enquiry.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      enquiry.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.enquiry_type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Status badge color mapping
  const statusColors = {
    new: "bg-blue-500",
    "in-progress": "bg-yellow-500",
    completed: "bg-green-500",
    closed: "bg-gray-500",
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <CardTitle>Enquiries</CardTitle>
          <CardDescription>Manage and track customer enquiries</CardDescription>
        </div>
        <Button asChild>
          <Link href="/enquiries/new">
            <Plus className="h-4 w-4 mr-2" />
            New Enquiry
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search enquiries..."
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
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEnquiries.length > 0 ? (
                filteredEnquiries.map((enquiry) => (
                  <TableRow key={enquiry.id}>
                    <TableCell className="font-medium">{enquiry.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{enquiry.email || "-"}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {enquiry.enquiry_type.charAt(0).toUpperCase() + enquiry.enquiry_type.slice(1)}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[enquiry.status as keyof typeof statusColors] || "bg-gray-500"}>
                        {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDistanceToNow(new Date(enquiry.created_at), { addSuffix: true })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/enquiries/${enquiry.id}`}>
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
                    {enquiries.length === 0 ? "No enquiries found" : "No matching enquiries found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

