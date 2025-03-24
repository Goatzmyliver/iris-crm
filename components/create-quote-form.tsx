"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

interface CreateQuoteFormProps {
  enquiry: any
  customer: any
}

export function CreateQuoteForm({ enquiry, customer }: CreateQuoteFormProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: `Quote for ${enquiry.name}`,
    description: enquiry.description || "",
    status: "draft",
    total_amount: "",
    discount: "",
    tax: "",
    expiry_date: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"), // 30 days from now
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
      // Validate required fields
      if (!formData.name) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // If no customer exists, create one first
      let customerId = customer?.id

      if (!customerId) {
        const { data: newCustomer, error: customerError } = await supabase
          .from("customers")
          .insert({
            name: enquiry.name,
            email: enquiry.email,
            phone: enquiry.phone,
            address: enquiry.address,
            owner_id: user?.id,
            stage: "lead",
            lead_source: enquiry.source,
            notes: enquiry.notes,
          })
          .select()

        if (customerError) {
          throw customerError
        }

        customerId = newCustomer[0].id

        // Update enquiry with customer reference
        await supabase
          .from("enquiries")
          .update({
            converted_to_customer_id: customerId,
            status: "converted",
          })
          .eq("id", enquiry.id)
      }

      // Insert quote
      const { data: quote, error: quoteError } = await supabase
        .from("quotes")
        .insert({
          ...formData,
          customer_id: customerId,
          owner_id: user?.id,
          total_amount: formData.total_amount ? Number.parseFloat(formData.total_amount) : null,
          discount: formData.discount ? Number.parseFloat(formData.discount) : null,
          tax: formData.tax ? Number.parseFloat(formData.tax) : null,
        })
        .select()

      if (quoteError) {
        throw quoteError
      }

      // Update enquiry with quote reference
      await supabase
        .from("enquiries")
        .update({
          converted_to_quote_id: quote[0].id,
        })
        .eq("id", enquiry.id)

      toast({
        title: "Quote created",
        description: "The quote has been created successfully",
      })

      // Redirect to quote page
      router.push(`/quotes/${quote[0].id}`)
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
          {customer ? (
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Customer Information</AlertTitle>
              <AlertDescription>This quote will be created for the existing customer: {customer.name}</AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Customer Creation</AlertTitle>
              <AlertDescription>A new customer will be created from the enquiry information</AlertDescription>
            </Alert>
          )}

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
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="grid gap-3">
              <Label htmlFor="total_amount">Total Amount</Label>
              <Input
                id="total_amount"
                name="total_amount"
                type="number"
                step="0.01"
                value={formData.total_amount}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="discount">Discount</Label>
              <Input
                id="discount"
                name="discount"
                type="number"
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
                step="0.01"
                value={formData.tax}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

