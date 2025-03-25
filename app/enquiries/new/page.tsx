import EnquiryForm from "@/components/enquiry-form"

export default async function NewEnquiryPage() {
  return (
    <div className="container py-10 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Enquiry</h1>
      <EnquiryForm />
    </div>
  )
}

