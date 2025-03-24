import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EnquiryDetailSkeleton } from "@/components/enquiries/enquiry-detail-skeleton"
import { EnquiryDetail } from "@/components/enquiries/enquiry-detail"
import { EnquiryActions } from "@/components/enquiries/enquiry-actions"
import { getEnquiryById } from "@/lib/enquiries"

export const metadata: Metadata = {
  title: "Enquiry Details - Iris CRM",
  description: "View and manage enquiry details",
}

export default async function EnquiryDetailPage({ params }: { params: { id: string } }) {
  const enquiry = await getEnquiryById(Number.parseInt(params.id))

  if (!enquiry) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/enquiries">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Enquiry Details</h1>
        </div>
        <EnquiryActions enquiry={enquiry} />
      </div>

      <Suspense fallback={<EnquiryDetailSkeleton />}>
        <Card>
          <CardHeader>
            <CardTitle>{enquiry.name}</CardTitle>
            <CardDescription>Created on {format(new Date(enquiry.createdAt), "PPP")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="details" className="space-y-4">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4">
                <EnquiryDetail enquiry={enquiry} />
              </TabsContent>
              <TabsContent value="notes" className="space-y-4">
                <p>Notes content will go here</p>
              </TabsContent>
              <TabsContent value="activity" className="space-y-4">
                <p>Activity log will go here</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </Suspense>
    </div>
  )
}

