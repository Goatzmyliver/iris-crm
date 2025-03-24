import type { Metadata } from "next"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { EnquiriesTable } from "@/components/enquiries-table"

export const metadata: Metadata = {
  title: "Enquiries | Iris CRM",
  description: "Manage your enquiries and convert them to customers",
}

export default async function EnquiriesPage() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch enquiries
  const { data: enquiries } = await supabase.from("enquiries").select("*").order("created_at", { ascending: false })

  return (
    <DashboardShell>
      <DashboardHeader heading="Enquiries" description="Manage your enquiries and convert them to customers">
        <Button asChild>
          <Link href="/enquiries/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Enquiry
          </Link>
        </Button>
      </DashboardHeader>
      <EnquiriesTable enquiries={enquiries || []} />
    </DashboardShell>
  )
}

