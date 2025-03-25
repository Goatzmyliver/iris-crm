import { EnquiryForm } from "@/components/enquiry-form"

export const metadata = {
  title: "New Enquiry | Iris CRM",
}

export default function NewEnquiryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">New Enquiry</h1>
      <EnquiryForm />
    </div>
  )
}

