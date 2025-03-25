import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { createServerComponentClient } from "@/lib/supabase"
import { CustomersTable } from "@/components/customers-table"

export default async function CustomersPage() {
  const supabase = createServerComponentClient()

  const { data: customers, error } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching customers:", error)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        <Button asChild>
          <Link href="/customers/new">
            <Plus className="mr-2 h-4 w-4" /> Add Customer
          </Link>
        </Button>
      </div>

      <CustomersTable customers={customers || []} />
    </div>
  )
}

