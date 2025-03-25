"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, Trash2, User, Phone, Mail, MapPin, FileText, Users } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import Link from "next/link"

type Customer = {
  id: number
  name: string
  email: string | null
  phone: string
  address: string | null
  notes: string | null
  created_at: string
  assigned_user_id: string | null
}

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [quotes, setQuotes] = useState<any[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [assignedUser, setAssignedUser] = useState<any>(null)

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        // Fetch customer
        const { data: customerData, error: customerError } = await supabase
          .from("customers")
          .select("*")
          .eq("id", params.id)
          .single()

        if (customerError) throw customerError

        setCustomer(customerData)

        // If customer has an assigned user, fetch the user details
        if (customerData.assigned_user_id) {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("id, name, email")
            .eq("id", customerData.assigned_user_id)
            .single()

          if (!userError) {
            setAssignedUser(userData)
          }
        }

        // Fetch quotes
        const { data: quotesData, error: quotesError } = await supabase
          .from("quotes")
          .select("*")
          .eq("customer_id", params.id)
          .order("created_at", { ascending: false })

        if (quotesError) throw quotesError

        setQuotes(quotesData || [])

        // Fetch jobs
        const { data: jobsData, error: jobsError } = await supabase
          .from("jobs")
          .select("*")
          .eq("customer_id", params.id)
          .order("created_at", { ascending: false })

        if (jobsError) throw jobsError

        setJobs(jobsData || [])
      } catch (error) {
        console.error("Error fetching customer data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomerData()
  }, [supabase, params.id])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[50vh]">
          <p>Loading customer data...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (!customer) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <h2 className="text-2xl font-bold mb-2">Customer Not Found</h2>
          <p className="mb-4">The customer you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button asChild>
            <Link href="/customers">Back to Customers</Link>
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/customers">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">{customer.name}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/customers/${params.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Customer since {new Date(customer.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{customer.phone}</p>
                  <p className="text-sm text-muted-foreground">Phone</p>
                </div>
              </div>

              {customer.email && (
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{customer.email}</p>
                    <p className="text-sm text-muted-foreground">Email</p>
                  </div>
                </div>
              )}

              {customer.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{customer.address}</p>
                    <p className="text-sm text-muted-foreground">Address</p>
                  </div>
                </div>
              )}

              {customer.notes && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Notes</p>
                      <p className="text-sm whitespace-pre-line">{customer.notes}</p>
                    </div>
                  </div>
                </>
              )}

              {assignedUser && (
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{assignedUser.name}</p>
                    <p className="text-sm text-muted-foreground">Assigned To</p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/quotes/new?customer=${customer.id}`}>Create New Quote</Link>
              </Button>
            </CardFooter>
          </Card>

          <div className="md:col-span-2">
            <Tabs defaultValue="quotes">
              <TabsList>
                <TabsTrigger value="quotes">Quotes</TabsTrigger>
                <TabsTrigger value="jobs">Jobs</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="quotes" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Quotes</CardTitle>
                    <CardDescription>View all quotes for this customer</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {quotes.length > 0 ? (
                      <div className="space-y-4">
                        {quotes.map((quote) => (
                          <div key={quote.id} className="flex items-center justify-between p-3 border rounded-md">
                            <div>
                              <p className="font-medium">{quote.id}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(quote.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {new Intl.NumberFormat("en-NZ", {
                                  style: "currency",
                                  currency: "NZD",
                                }).format(quote.total)}
                              </p>
                              <p className="text-sm text-muted-foreground capitalize">{quote.status}</p>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/quotes/${quote.id}`}>View</Link>
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground mb-4">No quotes found for this customer</p>
                        <Button asChild>
                          <Link href={`/quotes/new?customer=${customer.id}`}>Create New Quote</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="jobs" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Jobs</CardTitle>
                    <CardDescription>View all jobs for this customer</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {jobs.length > 0 ? (
                      <div className="space-y-4">
                        {jobs.map((job) => (
                          <div key={job.id} className="flex items-center justify-between p-3 border rounded-md">
                            <div>
                              <p className="font-medium">{job.id}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(job.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground capitalize">{job.status}</p>
                              {job.scheduled_date && (
                                <p className="text-sm">
                                  Scheduled: {new Date(job.scheduled_date).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/jobs/${job.id}`}>View</Link>
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">No jobs found for this customer</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer History</CardTitle>
                    <CardDescription>View activity history for this customer</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">Customer history will be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

