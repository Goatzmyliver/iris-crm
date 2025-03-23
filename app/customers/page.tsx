"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, UserPlus } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import Link from "next/link"

// Mock customer data
const MOCK_CUSTOMERS = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    phone: "021-555-1234",
    address: "123 Main St, Auckland",
    created_at: "2025-01-15",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "022-555-5678",
    address: "456 High St, Wellington",
    created_at: "2025-02-20",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "027-555-9012",
    address: "789 Park Ave, Christchurch",
    created_at: "2025-03-10",
  },
]

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // In a real app, you would fetch actual data from Supabase
        // For now, we'll use mock data
        setCustomers(MOCK_CUSTOMERS)
      } catch (error) {
        console.error("Error fetching customers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [supabase])

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery),
  )

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Customers</h1>
          <Button asChild>
            <Link href="/customers/new">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Customer
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Customer Management</CardTitle>
            <CardDescription>View and manage your customer database</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">Loading...</div>
            ) : filteredCustomers.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Added</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{customer.address}</TableCell>
                        <TableCell>{customer.created_at}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/customers/${customer.id}`}>View</Link>
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
                  <UserPlus className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mb-1 text-lg font-semibold">No customers found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery ? "Try a different search term" : "Get started by adding your first customer"}
                </p>
                {!searchQuery && (
                  <Button asChild>
                    <Link href="/customers/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Customer
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

