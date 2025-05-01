import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { InvoicingList } from "@/components/invoicing/invoicing-list"

export const metadata = {
  title: "Ready for Invoicing - Iris CRM",
  description: "Jobs ready for invoicing",
}

export default async function InvoicingPage() {
  const supabase = createServerComponentClient({ cookies })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Ready for Invoicing</h2>
        <p className="text-muted-foreground">Jobs that are completed and ready to be invoiced</p>
      </div>

      <InvoicingList />
    </div>
  )
}
