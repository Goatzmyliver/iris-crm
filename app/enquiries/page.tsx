import { Suspense } from "react"
import Link from "next/link"
import type { Metadata } from "next"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/data-table"
import { EnquiriesTableSkeleton } from "@/components/enquiries/enquiries-table-skeleton"
import { getEnquiries } from "@/lib/enquiries"
import { columns } from "@/components/enquiries/columns"

export const metadata: Metadata = {
  title: "Enquiries - Iris CRM",
  description: "Manage customer enquiries and leads",
}

export default async function EnquiriesPage() {
  const enquiries = await getEnquiries()

  // Group enquiries by status
  const newEnquiries = enquiries.filter((enquiry) => enquiry.status === "new")
  const inProgressEnquiries = enquiries.filter((enquiry) => enquiry.status === "in-progress")
  const completedEnquiries = enquiries.filter((enquiry) => enquiry.status === "completed")

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Enquiries</h1>
        <Button asChild>
          <Link href="/enquiries/new">
            <Plus className="mr-2 h-4 w-4" /> New Enquiry
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enquiries Overview</CardTitle>
          <CardDescription>Manage and track all customer enquiries</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="new">
                New{" "}
                <span className="ml-1 rounded-full bg-primary px-2 text-xs text-primary-foreground">
                  {newEnquiries.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <Suspense fallback={<EnquiriesTableSkeleton />}>
              <TabsContent value="all" className="space-y-4">
                <DataTable columns={columns} data={enquiries} />
              </TabsContent>
              <TabsContent value="new" className="space-y-4">
                <DataTable columns={columns} data={newEnquiries} />
              </TabsContent>
              <TabsContent value="in-progress" className="space-y-4">
                <DataTable columns={columns} data={inProgressEnquiries} />
              </TabsContent>
              <TabsContent value="completed" className="space-y-4">
                <DataTable columns={columns} data={completedEnquiries} />
              </TabsContent>
            </Suspense>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

