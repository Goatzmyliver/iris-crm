"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Plus, Search, Filter, ArrowUpDown } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

// Mock data for enquiries
const MOCK_ENQUIRIES = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    phone: "021-555-1234",
    enquiry_type: "Flooring Installation",
    status: "new",
    created_at: "2025-03-20T09:30:00Z",
    assigned_user_id: "user-1",
    assigned_user: "Sarah Wilson",
  },
  {
    id: 2,
    name: "Emily Davis",
    email: "emily@example.com",
    phone: "022-555-5678",
    enquiry_type: "Carpet Cleaning",
    status: "in_progress",
    created_at: "2025-03-19T14:45:00Z",
    assigned_user_id: "user-2",
    assigned_user: "Mike Thompson",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "027-555-9012",
    enquiry_type: "Flooring Repair",
    status: "new",
    created_at: "2025-03-18T11:15:00Z",
    assigned_user_id: "user-1",
    assigned_user: "Sarah Wilson",
  },
  {
    id: 4,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "021-555-3456",
    enquiry_type: "Flooring Installation",
    status: "converted",
    created_at: "2025-03-17T16:20:00Z",
    assigned_user_id: null,
    assigned_user: null,
  },
  {
    id: 5,
    name: "Robert Wilson",
    email: "robert@example.com",
    phone: "022-555-7890",
    enquiry_type: "Consultation",
    status: "closed",
    created_at: "2025-03-16T10:00:00Z",
    assigned_user_id: "user-2",
    assigned_user: "Mike Thompson",
  },
]

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [assigneeFilter, setAssigneeFilter] = useState("all")
  const [sortField, setSortField] = useState("created_at")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        // In a real app, you would fetch actual data from Supabase
        // For now, we'll use mock data
        setEnquiries(MOCK_ENQUIRIES)
      } catch (error) {
        console.error("Error fetching enquiries:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEnquiries()
  }, [supabase])

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredAndSortedEnquiries = enquiries
    .filter((enquiry) => {
      const matchesSearch =
        enquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (enquiry.email && enquiry.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        enquiry.phone.includes(searchQuery)

      const matchesStatus = statusFilter === "all" || enquiry.status === statusFilter
      const matchesType = typeFilter === "all" || enquiry.enquiry_type === typeFilter
      const matchesAssignee =
        assigneeFilter === "all" ||
        (assigneeFilter === "unassigned" && !enquiry.assigned_user_id) ||
        enquiry.assigned_user_id === assigneeFilter

      return matchesSearch && matchesStatus && matchesType && matchesAssignee
    })
    .sort((a, b) => {
      if (sortField === "created_at") {
        return sortDirection === "asc"
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }

      if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1
      if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1
      return 0
    })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="secondary">New</Badge>
      case "in_progress":
        return <Badge variant="default">In Progress</Badge>
      case "converted":
        return <Badge variant="success">Converted</Badge>
      case "closed":
        return <Badge variant="outline">Closed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Get unique enquiry types for filter
  const enquiryTypes = Array.from(new Set(enquiries.map((e) => e.enquiry_type)))

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Enquiries</h1>
          <Button asChild>
            <Link href="/enquiries/new">
              <Plus className="mr-2 h-4 w-4" />
              New Enquiry
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Enquiry Management</CardTitle>
            <CardDescription>View and manage customer enquiries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search enquiries..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Enquiry Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {enquiryTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Assignees</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    <SelectItem value="user-1">Sarah Wilson</SelectItem>
                    <SelectItem value="user-2">Mike Thompson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">Loading...</div>
            ) : filteredAndSortedEnquiries.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                        <div className="flex items-center">
                          Name
                          {sortField === "name" && (
                            <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("enquiry_type")}>
                        <div className="flex items-center">
                          Type
                          {sortField === "enquiry_type" && (
                            <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                        <div className="flex items-center">
                          Status
                          {sortField === "status" && (
                            <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("created_at")}>
                        <div className="flex items-center">
                          Received
                          {sortField === "created_at" && (
                            <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedEnquiries.map((enquiry) => (
                      <TableRow key={enquiry.id}>
                        <TableCell className="font-medium">{enquiry.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{enquiry.phone}</span>
                            <span className="text-xs text-muted-foreground">{enquiry.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>{enquiry.enquiry_type}</TableCell>
                        <TableCell>{getStatusBadge(enquiry.status)}</TableCell>
                        <TableCell>{formatDistanceToNow(new Date(enquiry.created_at), { addSuffix: true })}</TableCell>
                        <TableCell>{enquiry.assigned_user || "Unassigned"}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/enquiries/${enquiry.id}`}>View</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-3 rounded-full bg-muted p-3">
                  <MessageSquare className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mb-1 text-lg font-semibold">No enquiries found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery || statusFilter !== "all" || typeFilter !== "all" || assigneeFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Get started by creating your first enquiry"}
                </p>
                {!searchQuery && statusFilter === "all" && typeFilter === "all" && assigneeFilter === "all" && (
                  <Button asChild>
                    <Link href="/enquiries/new">
                      <Plus className="mr-2 h-4 w-4" />
                      New Enquiry
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

