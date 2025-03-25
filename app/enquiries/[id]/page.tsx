import EnquiryDetail from "@/components/enquiry-detail"

export default async function EnquiryDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Enquiry Details</h1>
      <EnquiryDetail id={params.id} />
    </div>
  )
}

