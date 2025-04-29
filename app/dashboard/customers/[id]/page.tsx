import { CustomerForm } from "@/components/customers/customer-form"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"

export const metadata = {
  title: "Edit Customer - Iris CRM",
  description: "Edit customer details",
}

export default async function EditCustomerPage(props: any) {
  const id = props.params.id
  const supabase = createServerComponentClient({ cookies })

  // Fetch the customer
  const { data: customer } = await supabase.from("customers").select("*").eq("id", id).single()

  if (!customer) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Edit Customer</h2>
        <p className="text-muted-foreground">Update details for {customer.full_name}</p>
      </div>

      <CustomerForm customer={customer} />
    </div>
  )
}
