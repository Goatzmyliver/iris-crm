import { notFound } from "next/navigation"
import { createServerComponentClient } from "@/lib/supabase"
import CustomerDetail from "@/components/customer-detail"

export default async function CustomerDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient()

  const { data: customer, error } = await supabase.from("customers").select("*").eq("id", params.id).single()

  if (error || !customer) {
    notFound()
  }

  // Fetch customer's enquiries
  const { data: enquiries } = await supabase
    .from("enquiries")
    .select("*")
    .eq("customer_id", params.id)
    .order("created_at", { ascending: false })

  // Fetch customer's quotes
  const { data: quotes } = await supabase
    .from("quotes")
    .select("*")
    .eq("customer_id", params.id)
    .order("created_at", { ascending: false })

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6">Customer Details</h1>
      <CustomerDetail customer={customer} enquiries={enquiries || []} quotes={quotes || []} />
    </div>
  )
}

