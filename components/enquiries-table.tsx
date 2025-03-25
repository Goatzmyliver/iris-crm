"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Eye, Plus, Search } from "lucide-react"

// Mock data for the table
const mockEnquiries = [
  {
    id: "ENQ-001",
    name: "John Smith",
    email: "john.smith@example.com",
    subject: "Product Information",
    status: "new",
    date: "2023-05-15",
  },
  {
    id: "ENQ-002",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    subject: "Service Inquiry",
    status: "in-progress",
    date: "2023-05-14",
  },
  {
    id: "ENQ-003",
    name: "Michael Brown",
    email: "m.brown@example.com",
    subject: "Quote Request",
    status: "completed",
    date: "2023-05-10",
  },
]

export default function EnquiriesTable() {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter enquiries based on search term
  const filteredEnquiries = mockEnquiries.filter(
    (enquiry) =>
      enquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Status badge color mapping
  const statusColors = {
    new: "bg-blue-500",
    "in-progress": "bg-yellow-500",
    completed: "bg-green-500",
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
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEnquiries.length > 0 ? (
                filteredEnquiries.map((enquiry) => (
                  <TableRow key={enquiry.id}>
                    <TableCell className="font-medium">{enquiry.id}</TableCell>
                    <TableCell>{enquiry.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{enquiry.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{enquiry.subject}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[enquiry.status as keyof typeof statusColors]}>
                        {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(enquiry.date).toLocaleDateString()}
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
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No enquiries found
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

