"use client"

import { notFound } from "next/navigation"
import { getCustomer, updateCustomer } from "@/lib/customers"
import { CustomerForm } from "@/components/customers/customer-form"
import type { CustomerFormValues } from "@/types/schema"

interface EditCustomerPageProps {
  params: {
    id: string
  }
}

export default async function EditCustomerPage({ params }: EditCustomerPageProps) {
  try {
    const customer = await getCustomer(params.id)

    async function handleUpdateCustomer(data: CustomerFormValues) {
      "use server"
      await updateCustomer(params.id, data)
    }

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Customer</h1>
          <p className="text-muted-foreground">Update customer information</p>
        </div>
        <div className="rounded-md border p-6">
          <CustomerForm customer={customer} onSubmit={handleUpdateCustomer} />
        </div>
      </div>
    )
  } catch (error) {
    notFound()
  }
}
