"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function NewEnquiryPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("new")
  const [formData, setFormData] = useState({
    // Customer data
    full_name: "",
    email: "",
    phone: "",
    address: "",

    // Enquiry data
    source: "website",
    description: "",
    product_interest: "carpet",
    room_type: "",
    approximate_size: "",
    budget_range: "",
    preferred_contact_method: "phone",
    preferred_contact_time: "",
    notes: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // First, check if customer already exists
      let customerId

      if (activeTab === "existing") {
        customerId = formData.full_name // In this case, full_name holds the customer ID
      } else {
        // Create new customer
        const { data: customer, error: customerError } = await supabase
          .from("customers")
          .insert({
            full_name: formData.full_name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
          })
          .select()
          .single()

        if (customerError) throw customerError
        customerId = customer.id
      }

      // Create enquiry
      const { error: enquiryError } = await supabase.from("enquiries").insert({
        customer_id: customerId,
        source: formData.source,
        description: formData.description,
        product_interest: formData.product_interest,
        room_type: formData.room_type,
        approximate_size: formData.approximate_size,
        budget_range: formData.budget_range,
        preferred_contact_method: formData.preferred_contact_method,
        preferred_contact_time: formData.preferred_contact_time,
        notes: formData.notes,
        status: "new",
      })

      if (enquiryError) throw enquiryError

      toast({
        title: "Enquiry created",
        description: "The enquiry has been successfully created.",
      })

      router.push("/enquiries")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create enquiry",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const [customers, setCustomers] = useState<any[]>([])
  const [customerSearchTerm, setCustomerSearchTerm] = useState("")

  const searchCustomers = async (term: string) => {
    if (term.length < 2) {
      setCustomers([])
      return
    }

    const { data } = await supabase
      .from("customers")
      .select("id, full_name, email, phone")
      .or(`full_name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`)
      .limit(5)

    setCustomers(data || [])
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="mb-6 text-3xl font-bold tracking-tight">New Enquiry</h2>

      <Tabs defaultValue="new" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="new">New Customer</TabsTrigger>
          <TabsTrigger value="existing">Existing Customer</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          <TabsContent value="new">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
                <CardDescription>Enter the new customer's details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} required />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" name="address" value={formData.address} onChange={handleChange} rows={3} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="existing">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Select Customer</CardTitle>
                <CardDescription>Find an existing customer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer_search">Search Customers</Label>
                  <Input
                    id="customer_search"
                    placeholder="Search by name, email or phone"
                    value={customerSearchTerm}
                    onChange={(e) => {
                      setCustomerSearchTerm(e.target.value)
                      searchCustomers(e.target.value)
                    }}
                  />
                </div>

                {customers.length > 0 && (
                  <div className="border rounded-md divide-y">
                    {customers.map((customer) => (
                      <div
                        key={customer.id}
                        className="p-3 cursor-pointer hover:bg-muted flex justify-between items-center"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, full_name: customer.id }))
                          setCustomerSearchTerm(`${customer.full_name} (${customer.phone})`)
                        }}
                      >
                        <div>
                          <p className="font-medium">{customer.full_name}</p>
                          <p className="text-sm text-muted-foreground">{customer.email}</p>
                        </div>
                        <p className="text-sm">{customer.phone}</p>
                      </div>
                    ))}
                  </div>
                )}

                {customerSearchTerm && customers.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No customers found. Try a different search or create a new customer.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <Card>
            <CardHeader>
              <CardTitle>Enquiry Details</CardTitle>
              <CardDescription>Information about the customer's enquiry</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="source">Enquiry Source</Label>
                  <Select value={formData.source} onValueChange={(value) => handleSelectChange("source", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="walk_in">Walk-in</SelectItem>
                      <SelectItem value="social_media">Social Media</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product_interest">Product Interest</Label>
                  <Select
                    value={formData.product_interest}
                    onValueChange={(value) => handleSelectChange("product_interest", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="carpet">Carpet</SelectItem>
                      <SelectItem value="vinyl">Vinyl</SelectItem>
                      <SelectItem value="laminate">Laminate</SelectItem>
                      <SelectItem value="multiple">Multiple Products</SelectItem>
                      <SelectItem value="unsure">Unsure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Enquiry Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Brief description of what the customer is looking for"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="room_type">Room Type</Label>
                  <Input
                    id="room_type"
                    name="room_type"
                    value={formData.room_type}
                    onChange={handleChange}
                    placeholder="Living room, bedroom, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="approximate_size">Approximate Size</Label>
                  <Input
                    id="approximate_size"
                    name="approximate_size"
                    value={formData.approximate_size}
                    onChange={handleChange}
                    placeholder="e.g., 20m²"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="budget_range">Budget Range</Label>
                  <Input
                    id="budget_range"
                    name="budget_range"
                    value={formData.budget_range}
                    onChange={handleChange}
                    placeholder="e.g., $1000-2000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferred_contact_method">Preferred Contact Method</Label>
                  <Select
                    value={formData.preferred_contact_method}
                    onValueChange={(value) => handleSelectChange("preferred_contact_method", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferred_contact_time">Preferred Contact Time</Label>
                <Input
                  id="preferred_contact_time"
                  name="preferred_contact_time"
                  value={formData.preferred_contact_time}
                  onChange={handleChange}
                  placeholder="e.g., Weekday afternoons"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Any other relevant information"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || (activeTab === "existing" && !formData.full_name)}>
                {isLoading ? "Creating..." : "Create Enquiry"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Tabs>
    </div>
  )
}

