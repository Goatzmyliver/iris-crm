"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import Link from "next/link"

type EnquiryFormData = {
  name: string
  email: string
  phone: string
  address: string
  enquiry_type: string
  description: string
  source: string
  assigned_user_id: string
  notes: string
}

export default function NewEnquiryPage() {
  const [users, setUsers] = useState<any[]>([])
  const [formData, setFormData] = useState<EnquiryFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    enquiry_type: "",
    description: "",
    source: "",
    assigned_user_id: "",
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase.from("users").select("id, name, email")

        if (error) throw error

        setUsers(data || [])
      } catch (err) {
        console.error("Error fetching users:", err)
      }
    }

    fetchUsers()
  }, [supabase])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate required fields
      if (!formData.name || !formData.phone || !formData.enquiry_type) {
        throw new Error("Name, phone number, and enquiry type are required")
      }

      // In a real implementation, this would insert into the database
      // For now, we'll just simulate success
      console.log("Submitting enquiry:", formData)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      router.push("/enquiries")
    } catch (err: any) {
      console.error("Error adding enquiry:", err)
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
            <Link href="/enquiries">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">New Enquiry</h1>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Enquiry Information</CardTitle>
              <CardDescription>Record a new customer enquiry</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" name="address" value={formData.address} onChange={handleChange} />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="enquiry_type">Enquiry Type *</Label>
                  <Select
                    value={formData.enquiry_type}
                    onValueChange={(value) => handleSelectChange("enquiry_type", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select enquiry type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Flooring Installation">Flooring Installation</SelectItem>
                      <SelectItem value="Carpet Cleaning">Carpet Cleaning</SelectItem>
                      <SelectItem value="Flooring Repair">Flooring Repair</SelectItem>
                      <SelectItem value="Consultation">Consultation</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="source">Enquiry Source</Label>
                  <Select value={formData.source} onValueChange={(value) => handleSelectChange("source", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="How did they find us?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Website">Website</SelectItem>
                      <SelectItem value="Phone">Phone</SelectItem>
                      <SelectItem value="Email">Email</SelectItem>
                      <SelectItem value="Referral">Referral</SelectItem>
                      <SelectItem value="Google">Google</SelectItem>
                      <SelectItem value="Social Media">Social Media</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Enquiry Details *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="What is the customer enquiring about?"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assigned_user">Assign To</Label>
                <Select
                  value={formData.assigned_user_id}
                  onValueChange={(value) => handleSelectChange("assigned_user_id", value)}
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

              <div className="space-y-2">
                <Label htmlFor="notes">Internal Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Any additional notes (not visible to customer)"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" asChild>
                <Link href="/enquiries">Cancel</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Enquiry
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}

