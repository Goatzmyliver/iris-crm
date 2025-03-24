"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { format, addDays } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, Plus, Trash } from "lucide-react"

interface Customer {
  id: number
  name: string
}

interface NewQuoteFormProps {
  selectedCustomer: any
  customers: Customer[]
}

interface QuoteItem {
  id: string
  description: string
  quantity: number
  unit_price: number
  total: number
}

export function NewQuoteForm({ selectedCustomer, customers }: NewQuoteFormProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: selectedCustomer ? `Quote for ${selectedCustomer.name}` : "",
    description: "",
    status: "draft",
    customer_id: selectedCustomer ? selectedCustomer.id : "",
    expiry_date: format(addDays(new Date(), 30), "yyyy-MM-dd"), // 30 days from now
    notes: "",
    discount: "0",
    tax: "0",
  })

  const [items, setItems] = useState<QuoteItem[]>([
    {
      id: `item-${Date.now()}`,
      description: "",
      quantity: 1,
      unit_price: 0,
      total: 0,
    },
  ])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleItemChange = (id: string, field: keyof QuoteItem, value: string | number) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }

          // Recalculate total if quantity or unit_price changes
          if (field === "quantity" || field === "unit_price") {
            updatedItem.total = updatedItem.quantity * updatedItem.unit_price
          }

          return updatedItem
        }
        return item
      }),
    )
  }

  const addItem = () => {
    setItems([
      ...items,
      {
        id: `item-${Date.now()}`,
        description: "",
        quantity: 1,
        unit_price: 0,
        total: 0,
      },
    ])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id))
    } else {
      toast({
        title: "Cannot remove item",
        description: "A quote must have at least one item",
        variant: "destructive",
      })
    }
  }

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0)
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const discount = Number.parseFloat(formData.discount) || 0
    const tax = Number.parseFloat(formData.tax) || 0

    return subtotal - discount + tax
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate required fields
      if (!formData.name || !formData.customer_id) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Validate items
      if (items.some((item) => !item.description)) {
        toast({
          title: "Error",
          description: "Please fill in all item descriptions",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // Insert quote
      const { data, error } = await supabase
        .from("quotes")
        .insert({
          name: formData.name,
          description: formData.description,
          status: formData.status,
          customer_id: formData.customer_id,
          expiry_date: formData.expiry_date,
          notes: formData.notes,
          total_amount: calculateTotal(),
          discount: Number.parseFloat(formData.discount) || 0,
          tax: Number.parseFloat(formData.tax) || 0,
          items: items,
          owner_id: user?.id,
        })
        .select()

      if (error) {
        throw error
      }

      toast({
        title: "Quote created",
        description: "The quote has been created successfully",
      })

      // Redirect to quote page
      router.push(`/quotes/${data[0].id}`)
      router.refresh()
    } catch (error) {
      console.error("Error creating quote:", error)
      toast({
        title: "Error",
        description: "There was an error creating the quote",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="grid gap-6 pt-6">
          {!selectedCustomer && (
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Select a customer</AlertTitle>
              <AlertDescription>Select an existing customer or create a new one for this quote</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-3">
            <Label htmlFor="customer_id">
              Customer <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.customer_id.toString()}
              onValueChange={(value) => handleSelectChange("customer_id", value)}
            >
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
            <div className="text-sm text-muted-foreground">
              <Button
                type="button"
                variant="link"
                className="h-auto p-0 text-sm"
                onClick={() => router.push("/customers/new")}
              >
                Create a new customer
              </Button>
            </div>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="name">
              Quote Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Quote for Project X"
              required
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter details about the quote"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="grid gap-3">
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

            <div className="grid gap-3">
              <Label htmlFor="expiry_date">Expiry Date</Label>
              <Input
                id="expiry_date"
                name="expiry_date"
                type="date"
                value={formData.expiry_date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-4">Quote Items</h3>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-start">
                  <div className="col-span-5">
                    <Label htmlFor={`item-${index}-description`} className="sr-only">
                      Description
                    </Label>
                    <Input
                      id={`item-${index}-description`}
                      placeholder="Item description"
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`item-${index}-quantity`} className="sr-only">
                      Quantity
                    </Label>
                    <Input
                      id={`item-${index}-quantity`}
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(item.id, "quantity", Number.parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`item-${index}-unit-price`} className="sr-only">
                      Unit Price
                    </Label>
                    <Input
                      id={`item-${index}-unit-price`}
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Price"
                      value={item.unit_price}
                      onChange={(e) => handleItemChange(item.id, "unit_price", Number.parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`item-${index}-total`} className="sr-only">
                      Total
                    </Label>
                    <Input id={`item-${index}-total`} type="number" readOnly value={item.total.toFixed(2)} />
                  </div>
                  <div className="col-span-1">
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Remove item</span>
                    </Button>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addItem} className="mt-2">
                <Plus className="h-4 w-4 mr-2" /> Add Item
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="grid gap-3">
              <Label htmlFor="discount">Discount</Label>
              <Input
                id="discount"
                name="discount"
                type="number"
                min="0"
                step="0.01"
                value={formData.discount}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="tax">Tax</Label>
              <Input
                id="tax"
                name="tax"
                type="number"
                min="0"
                step="0.01"
                value={formData.tax}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex justify-end space-y-2">
            <div className="text-right">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount:</span>
                <span className="font-medium">-${(Number.parseFloat(formData.discount) || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span className="font-medium">${(Number.parseFloat(formData.tax) || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Enter notes about the quote"
              rows={4}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Quote"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

