import EnquiriesTable from "@/components/enquiries-table"

export default async function EnquiriesPage() {
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Enquiries</h1>
      <EnquiriesTable />
    </div>
  )
}

