import { EnquiriesTable } from "@/components/enquiries-table"

export const metadata = {
  title: "Enquiries | Iris CRM",
}

export default async function EnquiriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Enquiries</h1>
        <a
          href="/enquiries/new"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          New Enquiry
        </a>
      </div>
      <EnquiriesTable />
    </div>
  )
}

