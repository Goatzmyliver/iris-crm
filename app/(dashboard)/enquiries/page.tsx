import { EnquiryDetail } from "@/components/enquiry-detail"

export const metadata = {
  title: "Enquiry Details | Iris CRM",
}

export default async function EnquiryDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Enquiry Details</h1>
        <a
          href="/enquiries"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          Back to Enquiries
        </a>
      </div>
      <EnquiryDetail id={params.id} />
    </div>
  )
}

