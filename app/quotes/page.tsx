"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { FileText, Plus, Search } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

// Mock quote data
const MOCK_QUOTES = [
  {
    id: "Q-2025-001",
    customer: "John Smith",
    total: 1250.0,
    status: "draft",
    created_at: "2025-03-15",
    assigned_user: "Sarah Wilson",
  },
  {
    id: "Q-2025-002",
    customer: "Sarah Johnson",
    total: 3450.75,
    status: "sent",
    created_at: "2025-03-10",
    assigned_user: "Mike Thompson",
  },
  {
    id: "Q-2025-003",
    customer: "Michael Brown",
    total: 2340.5,
    status: "approved",
    created_at: "2025-03-05",
    assigned_user: "Sarah Wilson",
  },
  {
    id: "Q-2025-004",
    customer: "Emily Davis",
    total: 1875.25,
    status: "converted",
    created_at: "2025-02-28",
    assigned_user: null,
  },
  {
    id: "Q-2025-005",
    customer: "Robert Wilson",
    total: 4250.0,
    status: "sent",
    created_at: "2025-02-20",
    assigned_user: "Mike Thompson",
  },
]

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        // In a real app, you would fetch actual data from Supabase
        // For now, we'll use mock data
        setQuotes(MOCK_QUOTES)
      } catch (error) {
        console.error("Error fetching quotes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuotes()
  }, [supabase])

  const filteredQuotes = quotes.filter((quote) => {
    const matchesSearch =
      quote.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || quote.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      case "sent":
        return <Badge variant="secondary">Sent</Badge>
      case "approved":
        return <Badge variant="success">Approved</Badge>
      case "converted":
        return <Badge variant="default">Converted to Job</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Quotes</h1>
          <Button asChild>
            <Link href="/quotes/new">
              <Plus className="mr-2 h-4 w-4" />
              New Quote
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quote Management</CardTitle>
            <CardDescription>Create, view, and manage your quotes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search quotes..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="converted">Converted to Job</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">Loading...</div>
            ) : filteredQuotes.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Quote #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuotes.map((quote) => (
                      <TableRow key={quote.id}>
                        <TableCell className="font-medium">{quote.id}</TableCell>
                        <TableCell>{quote.customer}</TableCell>
                        <TableCell>${quote.total.toFixed(2)}</TableCell>
                        <TableCell>{getStatusBadge(quote.status)}</TableCell>
                        <TableCell>{quote.created_at}</TableCell>
                        <TableCell>{quote.assigned_user || "Unassigned"}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/quotes/${quote.id}`}>View</Link>
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
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mb-1 text-lg font-semibold">No quotes found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Get started by creating your first quote"}
                </p>
                {!searchQuery && statusFilter === "all" && (
                  <Button asChild>
                    <Link href="/quotes/new">
                      <Plus className="mr-2 h-4 w-4" />
                      New Quote
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

