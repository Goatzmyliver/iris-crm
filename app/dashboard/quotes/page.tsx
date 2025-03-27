import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { QuotesList } from "@/components/quotes/quotes-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export const metadata = {
  title: "Quotes - Iris CRM",
  description: "Manage your quotes",
}

export default async function QuotesPage() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch customers for filtering
  const { data: customers } = await supabase
    .from("customers")
    .select("id, full_name")
    .order("full_name", { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Quotes</h2>
          <p className="text-muted-foreground">Create and manage quotes for your customers</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/quotes/new">
            <Plus className="mr-2 h-4 w-4" /> New Quote
          </Link>
        </Button>
      </div>

      <QuotesList initialCustomers={customers || []} />
    </div>
  )
}

