import { notFound } from "next/navigation"
import Link from "next/link"
import { getCustomer } from "@/lib/customers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Mail, Phone, MapPin, FileText, Briefcase } from "lucide-react"

interface CustomerPageProps {
  params: {
    id: string
  }
}

export default async function CustomerPage({ params }: CustomerPageProps) {
  try {
    const customer = await getCustomer(params.id)

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{customer.name}</h1>
            <p className="text-muted-foreground">Customer details and related information</p>
          </div>
          <Button asChild>
            <Link href={`/dashboard/customers/${customer.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Customer
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Customer contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <Mail className="mr-2 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{customer.email}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="mr-2 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{customer.phone}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">
                    {customer.address}
                    <br />
                    {customer.city}, {customer.state} {customer.zip}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Customer Overview</CardTitle>
              <CardDescription>Status and notes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">Status</p>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    customer.status === "active"
                      ? "bg-green-100 text-green-800"
                      : customer.status === "inactive"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                </span>
              </div>
              <div>
                <p className="font-medium">Notes</p>
                <p className="text-sm text-muted-foreground">{customer.notes || "No notes available."}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="jobs">
          <TabsList>
            <TabsTrigger value="jobs">
              <Briefcase className="mr-2 h-4 w-4" />
              Jobs
            </TabsTrigger>
            <TabsTrigger value="quotes">
              <FileText className="mr-2 h-4 w-4" />
              Quotes
            </TabsTrigger>
          </TabsList>
          <TabsContent value="jobs" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Jobs</CardTitle>
                  <Button asChild size="sm">
                    <Link href={`/dashboard/jobs/new?customer=${customer.id}`}>Create Job</Link>
                  </Button>
                </div>
                <CardDescription>Jobs associated with this customer</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-6">No jobs found for this customer.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="quotes" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Quotes</CardTitle>
                  <Button asChild size="sm">
                    <Link href={`/dashboard/quotes/new?customer=${customer.id}`}>Create Quote</Link>
                  </Button>
                </div>
                <CardDescription>Quotes created for this customer</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-6">No quotes found for this customer.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  } catch (error) {
    notFound()
  }
}
