"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"

export default function NewJobPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const quoteId = searchParams.get("quote")

  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(false)
  const [customers, setCustomers] = useState<any[]>([])
  const [installers, setInstallers] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState("09:00")

  const [formData, setFormData] = useState({
    customer_id: "",
    quote_id: quoteId || "",
    status: "scheduled",
    notes: "",
    installer_id: "",
    installer_name: "",
    items: [] as any[],
  })

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoadingInitialData(true)
      try {
        // Fetch installers (users with installer role)
        const { data: installersData } = await supabase.from("profiles").select("id, full_name").eq("role", "installer")

        if (installersData) {
          setInstallers(installersData)
        }

        // If we have a quote ID, fetch the quote and customer
        if (quoteId) {
          const { data: quote } = await supabase
            .from("quotes")
            .select("*, customers(*), quote_items(*)")
            .eq("id", quoteId)
            .single()

          if (quote) {
            setFormData((prev) => ({
              ...prev,
              customer_id: quote.customer_id,
              notes: quote.notes || prev.notes,
              items: quote.quote_items.map((item: any) => ({
                product_id: item.product_id,
                description: item.description,
                quantity: item.quantity,
              })),
            }))

            // Only fetch this customer
            setCustomers([quote.customers])
          }
        } else {
          // Otherwise fetch all customers
          const { data: customersData } = await supabase.from("customers").select("*").order("full_name")

          if (customersData) {
            setCustomers(customersData)
          }
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
  }, [supabase, quoteId, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    if (name === "installer_id") {
      const installer = installers.find((i) => i.id === value)
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        installer_name: installer ? installer.full_name : "",
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!selectedDate) {
        throw new Error("Please select a scheduled date")
      }

      // Combine date and time
      const scheduledDate = new Date(selectedDate)
      const [hours, minutes] = selectedTime.split(":").map(Number)
      scheduledDate.setHours(hours, minutes)

      // Create job
      const { data: job, error: jobError } = await supabase
        .from("jobs")
        .insert([
          {
            customer_id: formData.customer_id,
            quote_id: formData.quote_id || null,
            status: formData.status,
            scheduled_date: scheduledDate.toISOString(),
            installer_id: formData.installer_id || null,
            installer_name: formData.installer_name || null,
            notes: formData.notes,
          },
        ])
        .select()
        .single()

      if (jobError) throw jobError

      // Create job items if we have any
      if (formData.items.length > 0) {
        const jobItems = formData.items.map((item) => ({
          job_id: job.id,
          product_id: item.product_id || null,
          description: item.description,
          quantity: item.quantity,
        }))

        const { error: itemsError } = await supabase.from("job_items").insert(jobItems)

        if (itemsError) throw itemsError
      }

      // If this job is from a quote, update the quote status to "approved"
      if (formData.quote_id) {
        await supabase.from("quotes").update({ status: "approved" }).eq("id", formData.quote_id)
      }

      toast({
        title: "Job scheduled",
        description: "The job has been successfully scheduled.",
      })

      router.push(`/jobs/${job.id}`)
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to schedule job",
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
    <div className="mx-auto max-w-2xl">
      <h2 className="mb-6 text-3xl font-bold tracking-tight">Schedule New Job</h2>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Job Information</CardTitle>
            <CardDescription>Schedule a new installation job</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customer_id">Customer</Label>
              <Select
                value={formData.customer_id}
                onValueChange={(value) => handleSelectChange("customer_id", value)}
                required
                disabled={!!quoteId}
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
                <Label>Scheduled Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Scheduled Time</Label>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="time"
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="installer_id">Assign Installer</Label>
              <Select
                value={formData.installer_id}
                onValueChange={(value) => handleSelectChange("installer_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an installer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {installers.map((installer) => (
                    <SelectItem key={installer.id} value={installer.id}>
                      {installer.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Installation instructions or special requirements"
              />
            </div>

            {formData.items.length > 0 && (
              <div className="space-y-2">
                <Label>Items to Install</Label>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="divide-x divide-border">
                        <th className="px-4 py-3.5 text-left text-sm font-semibold">Item</th>
                        <th className="px-4 py-3.5 text-right text-sm font-semibold">Quantity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {formData.items.map((item, index) => (
                        <tr key={index} className="divide-x divide-border">
                          <td className="whitespace-nowrap px-4 py-4">{item.description}</td>
                          <td className="whitespace-nowrap px-4 py-4 text-right">{item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Scheduling..." : "Schedule Job"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

