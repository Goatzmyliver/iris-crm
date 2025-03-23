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
import QuoteLineItems from "@/components/quote-line-items"
import { formatCurrency } from "@/lib/utils"

// Types for our form
type Customer = {
  id: number
  name: string
  email: string
  phone: string
  address: string
}

// Update the LineItem type to include cost_price and markup
type LineItem = {
  id: string
  description: string
  quantity: number
  cost_price: number
  markup: number
  unit_price: number
  total: number
}

export default function NewQuotePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null)
  const [quoteData, setQuoteData] = useState({
    notes: "",
    customer_notes: "",
  })
  // Update the initial line item state to include the new fields
  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      id: uuidv4(),
      description: "",
      quantity: 1,
      cost_price: 0,
      markup: 0,
      unit_price: 0,
      total: 0,
    },
  ])
  const [activeTab, setActiveTab] = useState("details")
  const router = useRouter()
  const supabase = createClientComponentClient()

  // Calculate totals
  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0)
  const taxRate = 0.15 // 15% GST
  const taxAmount = subtotal * taxRate
  const total = subtotal + taxAmount

  // Update the useEffect to log customers for debugging
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data, error } = await supabase.from("customers").select("id, name, email, phone, address")

        if (error) throw error

        console.log("Fetched customers:", data) // Add this line for debugging
        setCustomers(data || [])
      } catch (err: any) {
        console.error("Error fetching customers:", err)
      }
    }

    fetchCustomers()
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

  // Update the handleAddLineItem function to include the new fields
  const handleAddLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: uuidv4(),
        description: "",
        quantity: 1,
        cost_price: 0,
        markup: 0,
        unit_price: 0,
        total: 0,
      },
    ])
  }

  // Fix the customer selection issue by updating the handleSubmit function
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

      // Insert the quote
      const { error: quoteError } = await supabase.from("quotes").insert({
        id: quoteId,
        customer_id: selectedCustomerId,
        status: status,
        total: total,
        notes: quoteData.notes,
      })

      if (quoteError) throw quoteError

      // Insert the line items
      const lineItemsToInsert = lineItems.map((item) => ({
        quote_id: quoteId,
        description: item.description,
        quantity: item.quantity,
        cost_price: item.cost_price,
        markup: item.markup,
        unit_price: item.unit_price,
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

