import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getCustomer } from "@/lib/customers"
import { CustomerForm } from "@/components/customers/customer-form"
import { handleUpdateCustomer } from "../../actions"

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
// This is a Client Component
;("use client")

import { useState } from "react"
import type { CustomerFormValues } from "@/types/schema"

function CustomerFormWrapper({
  customerId,
  customer,
}: {
  customerId: string
  customer: any
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function onSubmit(data: CustomerFormValues) {
    setIsSubmitting(true)
    try {
      await handleUpdateCustomer(customerId, data)
    } catch (error) {
      console.error("Failed to update customer:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return <CustomerForm customer={customer} onSubmit={onSubmit} isSubmitting={isSubmitting} />
}
