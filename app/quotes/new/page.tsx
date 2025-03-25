"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus, Save, Send } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import Link from "next/link"
import QuoteLineItems, { type LineItem } from "@/components/quote-line-items"
import { formatCurrency } from "@/lib/utils"

// Types for our form
type Customer = {
  id: number
  name: string
  email: string
  phone: string
  address: string
}

export default function NewQuotePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null)
  const [users, setUsers] = useState<any[]>([])
  const [quoteData, setQuoteData] = useState({
    notes: "",
    customer_notes: "",
    assigned_user_id: "",
  })
  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      id: uuidv4(),
      description: "",
      units: 1,
      cost_price: 0,
      markup: 0,
      total: 0,
    },
  ])
  const [activeTab, setActiveTab] = useState("details")
  const router = useRouter()
  const supabase = createClientComponentClient()

  // Calculate totals
  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0)
  const baseCost = lineItems.reduce((sum, item) => sum + item.cost_price * item.units, 0)
  const totalMarkup = subtotal - baseCost
  const taxRate = 0.15 // 15% GST
  const taxAmount = subtotal * taxRate
  const total = subtotal + taxAmount

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch customers
        const { data: customersData, error: customersError } = await supabase
          .from("customers")
          .select("id, name, email, phone, address")

        if (customersError) throw customersError

        setCustomers(customersData || [])

        // Fetch users
        const { data: usersData, error: usersError } = await supabase.from("users").select("id, name, email")

        if (usersError) throw usersError

        setUsers(usersData || [])
      } catch (err) {
        console.error("Error fetching data:", err)
      }
    }

    fetchData()
  }, [supabase])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setQuoteData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCustomerChange = (value: string) => {
    setSelectedCustomerId(Number(value))
  }

  const handleLineItemChange = (updatedItems: LineItem[]) => {
    setLineItems(updatedItems)
  }

  const handleAddLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: uuidv4(),
        description: "",
        units: 1,
        cost_price: 0,
        markup: 0,
        total: 0,
      },
    ])
  }

  const handleSubmit = async (status: "draft" | "sent") => {
    if (!selectedCustomerId) {
      setError("Please select a customer")
      return
    }

    if (lineItems.length === 0 || lineItems.some((item) => !item.description)) {
      setError("Please add at least one line item with a description")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Generate a quote ID with a prefix and sequential number
      const quoteId = `Q-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`

      // Get the current user if no assignment is made
      let assignedUserId = quoteData.assigned_user_id
      if (!assignedUserId) {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        assignedUserId = user?.id || null
      }

      // Insert the quote
      const { error: quoteError } = await supabase.from("quotes").insert({
        id: quoteId,
        customer_id: selectedCustomerId,
        status: status,
        total: total,
        notes: quoteData.notes,
        assigned_user_id: assignedUserId,
      })

      if (quoteError) throw quoteError

      // Insert the line items
      const lineItemsToInsert = lineItems.map((item) => ({
        quote_id: quoteId,
        description: item.description,
        quantity: item.units,
        cost_price: item.cost_price,
        markup: item.markup,
        total: item.total,
      }))

      const { error: lineItemsError } = await supabase.from("quote_items").insert(lineItemsToInsert)

      if (lineItemsError) throw lineItemsError

      // Redirect to the quote detail page
      router.push(`/quotes/${quoteId}`)
    } catch (err: any) {
      console.error("Error creating quote:", err)
      setError(err.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/quotes">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Create New Quote</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="details">Quote Details</TabsTrigger>
            <TabsTrigger value="items">Line Items</TabsTrigger>
          </TabsList>

          <div className="mt-4">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Quote Information</CardTitle>
                  <CardDescription>Enter the basic information for this quote</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="customer">Customer</Label>
                    <Select onValueChange={handleCustomerChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id.toString()}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="text-sm text-muted-foreground mt-1">
                      <Link href="/customers/new" className="text-primary hover:underline">
                        + Add a new customer
                      </Link>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="assigned_user">Assign To</Label>
                    <Select
                      value={quoteData.assigned_user_id}
                      onValueChange={(value) => setQuoteData((prev) => ({ ...prev, assigned_user_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="notes">Internal Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={quoteData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Notes visible only to your team"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="customer_notes">Customer Notes</Label>
                    <Textarea
                      id="customer_notes"
                      name="customer_notes"
                      value={quoteData.customer_notes}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Notes visible to the customer on the quote"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" asChild>
                    <Link href="/quotes">Cancel</Link>
                  </Button>
                  <Button onClick={() => setActiveTab("items")}>Continue to Line Items</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="items">
              <Card>
                <CardHeader>
                  <CardTitle>Quote Line Items</CardTitle>
                  <CardDescription>Add products and services to this quote</CardDescription>
                </CardHeader>
                <CardContent>
                  <QuoteLineItems items={lineItems} onChange={handleLineItemChange} />

                  <Button variant="outline" className="mt-4 w-full" onClick={handleAddLineItem}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Line Item
                  </Button>

                  <div className="mt-6 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Markup</span>
                      <span className="text-green-600 font-medium">{formatCurrency(totalMarkup)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>GST (15%)</span>
                      <span>{formatCurrency(taxAmount)}</span>
                    </div>
                    <div className="flex justify-between font-medium text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab("details")}>
                    Back to Details
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleSubmit("draft")} disabled={loading}>
                      <Save className="mr-2 h-4 w-4" />
                      Save as Draft
                    </Button>
                    <Button onClick={() => handleSubmit("sent")} disabled={loading}>
                      <Send className="mr-2 h-4 w-4" />
                      Create & Send
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

