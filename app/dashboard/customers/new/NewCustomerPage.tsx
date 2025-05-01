"use client"

import { CustomerForm } from "@/components/customers/customer-form"
import type { CustomerFormValues } from "@/types/schema"
import { handleCreateCustomer } from "../actions"

export default function NewCustomerPage() {
  async function onSubmit(data: CustomerFormValues) {
    await handleCreateCustomer(data)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Customer</h1>
        <p className="text-muted-foreground">Create a new customer record</p>
      </div>
      <div className="rounded-md border p-6">
        <CustomerForm onSubmit={onSubmit} />
      </div>
    </div>
  )
}
