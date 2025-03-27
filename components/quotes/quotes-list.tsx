"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Edit, Eye, MoreHorizontal, Search, Trash, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"

interface Customer {
  id: string
  full_name: string
}

interface Quote {
  id: string
  quote_number: string
  customer_id: string
  customers: {
    full_name: string
  }
  total_amount: number
  status: string
  expiry_date: string
  created_at: string
}

interface QuotesListProps {
  initialCustomers: Customer[]
}

export function QuotesList({ initialCustomers }: QuotesListProps) {
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const router = useRouter()

  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [customers] = useState<Customer[]>(initialCustomers)

  useEffect(() => {
    fetchQuotes()
  }, [selectedCustomer, selectedStatus])

  const fetchQuotes = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from("quotes")
        .select(`
          *,
          customers (
            id,
            full_name
          )
        `)
        .order("created_at", { ascending: false })

      if (selectedCustomer !== "all") {
        query = query.eq("customer_id", selectedCustomer)
      }

      if (selectedStatus !== "all") {
        query = query.eq("status", selectedStatus)
      }

      if (searchQuery) {
        query = query.or(`quote_number.ilike.%${searchQuery}%,customers.full_name.ilike.%${searchQuery}%`)
      }

      const { data, error } = await query

      if (error) throw error
      setQuotes(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch quotes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    fetchQuotes()
  }

  const handleDelete = async (id: string) => {
    try {
      // First delete related quote items
      const { error: itemsError } = await supabase.from("quote_items").delete().eq("quote_id", id)

      if (itemsError) throw itemsError

      // Then delete the quote
      const { error } = await supabase.from("quotes").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Quote deleted",
        description: "The quote has been deleted successfully",
      })

      // Refresh the list
      fetchQuotes()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete quote",
        variant: "destructive",
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      case "sent":
        return <Badge className="bg-blue-500">Sent</Badge>
      case "accepted":
        return <Badge className="bg-green-500">Accepted</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      case "expired":
        return <Badge variant="secondary">Expired</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const convertToJob = async (quoteId: string) => {
    try {
      // Call a server function or API to convert quote to job
      const { error } = await supabase.functions.invoke("convert-quote-to-job", {
        body: { quoteId },
      })

      if (error) throw error

      toast({
        title: "Quote converted",
        description: "The quote has been converted to a job successfully",
      })

      // Refresh the list
      fetchQuotes()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to convert quote to job",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex w-full md:w-1/2">
              <Input
                placeholder="Search quotes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-r-none"
              />
              <Button variant="default" className="rounded-l-none" onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <div className="w-full md:w-1/4">
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/4">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quote #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No quotes found
                      </TableCell>
                    </TableRow>
                  ) : (
                    quotes.map((quote) => (
                      <TableRow key={quote.id}>
                        <TableCell className="font-medium">{quote.quote_number}</TableCell>
                        <TableCell>
                          {quote.customers ? (quote.customers as any).full_name : "Unknown Customer"}
                        </TableCell>
                        <TableCell>{format(new Date(quote.created_at), "MMM d, yyyy")}</TableCell>
                        <TableCell>{format(new Date(quote.expiry_date), "MMM d, yyyy")}</TableCell>
                        <TableCell className="text-right">{formatCurrency(quote.total_amount)}</TableCell>
                        <TableCell>{getStatusBadge(quote.status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/dashboard/quotes/${quote.id}`)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/dashboard/quotes/${quote.id}/preview`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                              </DropdownMenuItem>
                              {quote.status === "accepted" && (
                                <DropdownMenuItem onClick={() => convertToJob(quote.id)}>
                                  <FileText className="mr-2 h-4 w-4" />
                                  Convert to Job
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDelete(quote.id)}
                              >
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}

