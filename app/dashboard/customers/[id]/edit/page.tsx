import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getCustomer } from "@/lib/customers"
import { CustomerFormWrapper } from "./customer-form-wrapper"

// This is a Server Component
export default async function EditCustomerPage({
  params,
}: {
  params: { id: string }
}) {
  // Fetch customer data
  const customer = await getCustomer(params.id).catch(() => {
    return null
  })

  if (!customer) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Customer</h1>
        <p className="text-muted-foreground">Update customer information</p>
      </div>
      <div className="rounded-md border p-6">
        <Suspense fallback={<div>Loading form...</div>}>
          <CustomerFormWrapper customerId={params.id} customer={customer} />
        </Suspense>
      </div>
    </div>
  )
}
