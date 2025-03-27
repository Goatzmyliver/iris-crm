"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash, Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { format, addDays } from "date-fns"
import { v4 as uuidv4 } from "uuid"

interface Customer {
  id: string
  full_name: string
  email?: string
  phone?: string
  address?: string
}

interface InventoryItem {
  id: string
  name: string
  sku: string
  description: string
  category_id: string
  cost_price: number
  sell_price: number
  stock_level: number
}

interface QuoteItem {
  id: string
  quote_id?: string
  inventory_item_id?: string
  name: string
  description: string
  quantity: number
  unit_price: number
  total_price: number
  is_visible_to_customer: boolean
  is_custom_item: boolean
}

interface Quote {
  id: string
  quote_number: string
  customer_id: string
  status: string
  expiry_date: string
  notes: string
  terms_and_conditions: string
  total_amount: number
  quote_items: QuoteItem[]
}

interface QuoteFormProps {
  customers: Customer[]
  quote?: Quote
}

export function QuoteForm({ customers, quote }: QuoteFormProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isInventoryDialogOpen, setIsInventoryDialogOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    customer_id: quote?.customer_id || "",
    status: quote?.status || "draft",
    expiry_date: quote?.expiry_date || format(addDays(new Date(), 30), "yyyy-MM-dd"),
    notes: quote?.notes || "",
    terms_and_conditions: quote?.terms_and_conditions || "Standard terms and conditions apply.",
  })

  // Quote items state
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>(quote?.quote_items || [])

  // Selected customer
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  useEffect(() => {
    // If we have a customer_id, find the customer details
    if (formData.customer_id) {
      const customer = customers.find((c) => c.id === formData.customer_id) || null
      setSelectedCustomer(customer)
    }
  }, [formData.customer_id, customers])

  // Fetch inventory items for the dialog
  const fetchInventoryItems = async (search = "") => {
    try {
      let query = supabase.from("inventory_items").select("*").order("name")

      if (search) {
        query = query.ilike("name", `%${search}%`)
      }

      const { data, error } = await query

      if (error) throw error
      setInventoryItems(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch inventory items",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    // Initial fetch of inventory items
    fetchInventoryItems()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSearchInventory = () => {
    fetchInventoryItems(searchQuery)
  }

  const addInventoryItemToQuote = (item: InventoryItem) => {
    const newQuoteItem: QuoteItem = {
      id: uuidv4(),
      inventory_item_id: item.id,
      name: item.name,
      description: item.description,
      quantity: 1,
      unit_price: item.sell_price,
      total_price: item.sell_price,
      is_visible_to_customer: true,
      is_custom_item: false,
    }

    setQuoteItems([...quoteItems, newQuoteItem])
    setIsInventoryDialogOpen(false)
  }

  const addCustomItem = () => {
    const newQuoteItem: QuoteItem = {
      id: uuidv4(),
      name: "Custom Item",
      description: "",
      quantity: 1,
      unit_price: 0,
      total_price: 0,
      is_visible_to_customer: true,
      is_custom_item: true,
    }

    setQuoteItems([...quoteItems, newQuoteItem])
  }

  const updateQuoteItem = (id: string, field: keyof QuoteItem, value: any) => {
    setQuoteItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }

          // Recalculate total price if quantity or unit price changes
          if (field === "quantity" || field === "unit_price") {
            updatedItem.total_price = updatedItem.quantity * updatedItem.unit_price
          }

          return updatedItem
        }
        return item
      }),
    )
  }

  const removeQuoteItem = (id: string) => {
    setQuoteItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const calculateTotalAmount = () => {
    return quoteItems.reduce((sum, item) => sum + item.total_price, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const totalAmount = calculateTotalAmount()

      if (quote) {
        // Update existing quote
        const { error } = await supabase
          .from("quotes")
          .update({
            ...formData,
            total_amount: totalAmount,
          })
          .eq("id", quote.id)

        if (error) throw error

        // Delete existing quote items
        const { error: deleteError } = await supabase.from("quote_items").delete().eq("quote_id", quote.id)

        if (deleteError) throw deleteError

        // Insert updated quote items
        const quoteItemsToInsert = quoteItems.map((item) => ({
          quote_id: quote.id,
          inventory_item_id: item.inventory_item_id,
          name: item.name,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price,
          is_visible_to_customer: item.is_visible_to_customer,
          is_custom_item: item.is_custom_item,
        }))

        const { error: insertError } = await supabase.from("quote_items").insert(quoteItemsToInsert)

        if (insertError) throw insertError

        toast({
          title: "Quote updated",
          description: "The quote has been updated successfully",
        })
      } else {
        // Generate quote number
        const quoteNumber = `Q-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, "0")}`

        // Create new quote
        const { data: newQuote, error } = await supabase
          .from("quotes")
          .insert({
            ...formData,
            quote_number: quoteNumber,
            total_amount: totalAmount,
          })
          .select()

        if (error) throw error

        // Insert quote items
        const quoteItemsToInsert = quoteItems.map((item) => ({
          quote_id: newQuote[0].id,
          inventory_item_id: item.inventory_item_id,
          name: item.name,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price,
          is_visible_to_customer: item.is_visible_to_customer,
          is_custom_item: item.is_custom_item,
        }))

        const { error: insertError } = await supabase.from("quote_items").insert(quoteItemsToInsert)

        if (insertError) throw insertError

        toast({
          title: "Quote created",
          description: "The quote has been created successfully",
        })
      }

      router.push("/dashboard/quotes")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save quote",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Customer Information</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer_id">Customer</Label>
                    <Select
                      value={formData.customer_id}
                      onValueChange={(value) => handleSelectChange("customer_id", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedCustomer && (
                    <div className="space-y-2 p-4 bg-muted rounded-md">
                      <p>
                        <strong>Email:</strong> {selectedCustomer.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {selectedCustomer.phone}
                      </p>
                      <p>
                        <strong>Address:</strong> {selectedCustomer.address}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Quote Details</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiry_date">Expiry Date</Label>
                    <Input
                      id="expiry_date"
                      name="expiry_date"
                      type="date"
                      value={formData.expiry_date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Quote Items</h3>
              <div className="flex gap-2">
                <Dialog open={isInventoryDialogOpen} onOpenChange={setIsInventoryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Inventory Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Select Inventory Item</DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-2 mb-4">
                      <Input
                        placeholder="Search inventory..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Button onClick={handleSearchInventory}>
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="w-[80px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {inventoryItems.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                                No items found
                              </TableCell>
                            </TableRow>
                          ) : (
                            inventoryItems.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.sku}</TableCell>
                                <TableCell className="text-right">{formatCurrency(item.sell_price)}</TableCell>
                                <TableCell>
                                  <Button size="sm" onClick={() => addInventoryItemToQuote(item)}>
                                    Add
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" onClick={addCustomItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Custom Item
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Item</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right w-[100px]">Quantity</TableHead>
                    <TableHead className="text-right w-[150px]">Unit Price</TableHead>
                    <TableHead className="text-right w-[150px]">Total</TableHead>
                    <TableHead className="w-[100px]">Visible</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quoteItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No items added to this quote
                      </TableCell>
                    </TableRow>
                  ) : (
                    quoteItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Input
                            value={item.name}
                            onChange={(e) => updateQuoteItem(item.id, "name", e.target.value)}
                            className="w-full"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.description}
                            onChange={(e) => updateQuoteItem(item.id, "description", e.target.value)}
                            className="w-full"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuoteItem(item.id, "quantity", Number.parseInt(e.target.value) || 1)}
                            className="w-full text-right"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.unit_price}
                            onChange={(e) =>
                              updateQuoteItem(item.id, "unit_price", Number.parseFloat(e.target.value) || 0)
                            }
                            className="w-full text-right"
                          />
                        </TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(item.total_price)}</TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            checked={item.is_visible_to_customer}
                            onCheckedChange={(checked) => updateQuoteItem(item.id, "is_visible_to_customer", !!checked)}
                          />
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => removeQuoteItem(item.id)}>
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end mt-4">
              <div className="w-[300px] space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium">{formatCurrency(calculateTotalAmount())}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{formatCurrency(calculateTotalAmount())}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Additional notes for the customer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="terms_and_conditions">Terms and Conditions</Label>
                <Textarea
                  id="terms_and_conditions"
                  name="terms_and_conditions"
                  value={formData.terms_and_conditions}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/quotes")} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : quote ? "Update Quote" : "Create Quote"}
          </Button>
        </div>
      </div>
    </form>
  )
}

