import type { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NewEnquiryForm } from "@/components/enquiries/new-enquiry-form"

export const metadata: Metadata = {
  title: "New Enquiry - Iris CRM",
  description: "Create a new customer enquiry",
}

export default function NewEnquiryPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/enquiries">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">New Enquiry</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Enquiry</CardTitle>
          <CardDescription>Enter the details of the new enquiry</CardDescription>
        </CardHeader>
        <CardContent>
          <NewEnquiryForm />
        </CardContent>
      </Card>
    </div>
  )
}

