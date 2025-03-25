"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2, Calculator, FileText } from "lucide-react"

export default function NewQuotePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const enquiryId = searchParams.get("enquiry")
  const customerId = searchParams.get("customer")

  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(false)
  const [customers, setCustomers] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [showItemBreakdown, setShowItemBreakdown] = useState(true)
  const [markupPercentage, setMarkupPercentage] = useState(30)
  const [activeTab, setActiveTab] = useState<"product" | "custom">("product")

  const [formData, setFormData] = useState({
    customer_id: "",
    enquiry_id: enquiryId || "",
    expiry_date: "",
    notes: "",
    status: "draft",
    items: [{ product_id: "", description: "", quantity: 1, unit_price: 0, cost_price: 0 }],
  })

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoadingInitialData(true)
      try {
        // Fetch products
        const { data: productsData } = await supabase.from("products").select("*").order("name")

        if (productsData) {
          setProducts(productsData)
        }

        // If we have an enquiry ID, fetch the enquiry and customer
        if (enquiryId) {
          const { data: enquiry } = await supabase
            .from("enquiries")
            .select("*, customers(*)")
            .eq("id", enquiryId)
            .single()

          if (enquiry) {
            setFormData((prev) => ({
              ...prev,
              customer_id: enquiry.customer_id,
              notes: enquiry.description || prev.notes,
            }))

            // Set expiry date to 30 days from now
            const expiryDate = new Date()
            expiryDate.setDate(expiryDate.getDate() + 30)
            setFormData((prev) => ({
              ...prev,
              expiry_date: expiryDate.toISOString().split("T")[0],
            }))

            // Only fetch this customer
            setCustomers([enquiry.customers])
          }
        }
        // If we have a customer ID but no enquiry
        else if (customerId) {
          const { data: customer } = await supabase.from("customers").select("*").eq("id", customerId).single()

          if (customer) {
            setFormData((prev) => ({
              ...prev,
              customer_id: customer.id,
            }))

            // Set expiry date to 30 days from now
            const expiryDate = new Date()
            expiryDate.setDate(expiryDate.getDate() + 30)
            setFormData((prev) => ({
              ...prev,
              expiry_date: expiryDate.toISOString().split("T")[0],
            }))

            // Only fetch this customer
            setCustomers([customer])
          }
        }
        // Otherwise fetch all customers
        else {
          const { data: customersData } = await supabase.from("customers").select("*").order("full_name")

          if (customersData) {
            setCustomers(customersData)
          }

          // Set expiry date to 30 days from now
          const expiryDate = new Date()
          expiryDate.setDate(expiryDate.getDate() + 30)
          setFormData((prev) => ({
            ...prev,
            expiry_date: expiryDate.toISOString().split("T")[0],
          }))
        }
      } catch (error) {
        console.error("Error fetching initial data:", error)
        toast({
          title: "Error",
          description: "Failed to load initial data",
          variant: "destructive",
        })
      } finally {
        setIsLoadingInitialData(false)
      }
    }

    fetchInitialData()
  }, [supabase, enquiryId, customerId, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...formData.items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }

    // If product_id changed, update description, unit_price, and cost_price
    if (field === "product_id") {
      const product = products.find((p) => p.id === value)
      if (product) {
        updatedItems[index].description = product.name
        updatedItems[index].unit_price = calculateMarkupPrice(product.price, markupPercentage)
        updatedItems[index].cost_price = product.price
      }
    }

    // If cost_price changed, recalculate unit_price based on markup
    if (field === "cost_price") {
      updatedItems[index].unit_price = calculateMarkupPrice(value, markupPercentage)
    }

    setFormData((prev) => ({ ...prev, items: updatedItems }))
  }

  const calculateMarkupPrice = (cost: number, markup: number) => {
    return Number((cost * (1 + markup / 100)).toFixed(2))
  }

  const recalculateAllPrices = () => {
    const updatedItems = formData.items.map((item) => ({
      ...item,
      unit_price: calculateMarkupPrice(item.cost_price, markupPercentage),
    }))

    setFormData((prev) => ({ ...prev, items: updatedItems }))
  }

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { product_id: "", description: "", quantity: 1, unit_price: 0, cost_price: 0 }],
    }))
  }

  const removeItem = (index: number) => {
    const updatedItems = [...formData.items]
    updatedItems.splice(index, 1)
    setFormData((prev) => ({ ...prev, items: updatedItems }))
  }

  const calculateSubtotal = () => {
    return formData.items.reduce((total, item) => total + item.quantity * item.unit_price, 0)
  }

  const calculateCostTotal = () => {
    return formData.items.reduce((total, item) => total + item.quantity * item.cost_price, 0)
  }

  const calculateProfit = () => {
    return calculateSubtotal() - calculateCostTotal()
  }

  const calculateProfitMargin = () => {
    const subtotal = calculateSubtotal()
    if (subtotal === 0) return 0
    return (calculateProfit() / subtotal) * 100
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Calculate total amount
      const total_amount = calculateSubtotal()
      const cost_total = calculateCostTotal()
      const profit = calculateProfit()

      // Create quote
      const { data: quote, error: quoteError } = await supabase
        .from("quotes")
        .insert([
          {
            customer_id: formData.customer_id,
            enquiry_id: formData.enquiry_id || null,
            expiry_date: formData.expiry_date,
            notes: formData.notes,
            status: formData.status,
            total_amount,
            cost_total,
            profit,
            show_item_breakdown: showItemBreakdown,
          },
        ])
        .select()
        .single()

      if (quoteError) throw quoteError

      // Create quote items
      const quoteItems = formData.items.map((item) => ({
        quote_id: quote.id,
        product_id: item.product_id || null,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        cost_price: item.cost_price,
      }))

      const { error: itemsError } = await supabase.from("quote_items").insert(quoteItems)

      if (itemsError) throw itemsError

      // If this quote is from an enquiry, update the enquiry status to "quoted"
      if (formData.enquiry_id) {
        await supabase.from("enquiries").update({ status: "quoted" }).eq("id", formData.enquiry_id)
      }

      toast({
        title: "Quote created",
        description: "The quote has been successfully created.",
      })

      router.push(`/quotes/${quote.id}`)
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create quote",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingInitialData) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h2 className="mb-6 text-3xl font-bold tracking-tight">New Quote</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quote Information</CardTitle>
              <CardDescription>Create a new quote for a customer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer_id">Customer</Label>
                <Select
                  value={formData.customer_id}
                  onValueChange={(value) => handleSelectChange("customer_id", value)}
                  required
                  disabled={!!enquiryId || !!customerId}
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
              <div className="grid gap-4 sm:grid-cols-2">
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
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange("status", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Additional information about the quote"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="show-breakdown" checked={showItemBreakdown} onCheckedChange={setShowItemBreakdown} />
                <Label htmlFor="show-breakdown">Show item breakdown to customer</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quote Items</CardTitle>
              <CardDescription>Add products and services to the quote</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs value={activeTab} onValueChange={(value: "product" | "custom") => setActiveTab(value)}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="product">Select from Products</TabsTrigger>
                  <TabsTrigger value="custom">Custom Item</TabsTrigger>
                </TabsList>
              </Tabs>

              {formData.items.map((item, index) => (
                <div key={index} className="grid gap-4 rounded-lg border p-4">
                  <div className="grid gap-4 sm:grid-cols-12">
                    {activeTab === "product" ? (
                      <div className="sm:col-span-5">
                        <Label htmlFor={`product_${index}`}>Product</Label>
                        <Select
                          value={item.product_id}
                          onValueChange={(value) => handleItemChange(index, "product_id", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : null}

                    <div className={activeTab === "product" ? "sm:col-span-7" : "sm:col-span-12"}>
                      <Label htmlFor={`description_${index}`}>Description</Label>
                      <Input
                        id={`description_${index}`}
                        value={item.description}
                        onChange={(e) => handleItemChange(index, "description", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-12">
                    <div className="sm:col-span-3">
                      <Label htmlFor={`quantity_${index}`}>Quantity</Label>
                      <Input
                        id={`quantity_${index}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", Number.parseInt(e.target.value))}
                        required
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <Label htmlFor={`cost_${index}`}>Cost Price</Label>
                      <Input
                        id={`cost_${index}`}
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.cost_price}
                        onChange={(e) => handleItemChange(index, "cost_price", Number.parseFloat(e.target.value))}
                        required
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <Label htmlFor={`price_${index}`}>Selling Price</Label>
                      <Input
                        id={`price_${index}`}
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.unit_price}
                        onChange={(e) => handleItemChange(index, "unit_price", Number.parseFloat(e.target.value))}
                        required
                      />
                    </div>
                    <div className="sm:col-span-3 flex items-end">
                      <div className="w-full text-right font-medium pt-2">
                        ${(item.quantity * item.unit_price).toFixed(2)}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="ml-2"
                        onClick={() => removeItem(index)}
                        disabled={formData.items.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={addItem}>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Cost:</span>
                      <span className="font-medium">${calculateCostTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Profit:</span>
                      <span className="font-medium">${calculateProfit().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Profit Margin:</span>
                      <span className="font-medium">{calculateProfitMargin().toFixed(2)}%</span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between">
                      <span className="text-lg font-bold">Total:</span>
                      <span className="text-lg font-bold">${calculateSubtotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="markup" className="text-sm font-medium">
                        Markup Percentage
                      </Label>
                      <div className="flex items-center gap-2 mt-2">
                        <Input
                          id="markup"
                          type="number"
                          min="0"
                          max="100"
                          className="w-full"
                          value={markupPercentage}
                          onChange={(e) => setMarkupPercentage(Number(e.target.value))}
                        />
                        <span className="text-lg font-medium">%</span>
                      </div>
                    </div>
                    <Button type="button" variant="secondary" className="w-full" onClick={recalculateAllPrices}>
                      <Calculator className="h-4 w-4 mr-2" />
                      Apply Markup to All Items
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        // Generate a preview of the quote
                        toast({
                          title: "Quote Preview",
                          description: "Preview functionality will be implemented soon.",
                        })
                      }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Preview Quote
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-6">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Quote"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  )
}

