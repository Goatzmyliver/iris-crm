"use client"

import { CustomerForm } from "@/components/customers/customer-form"
import { createCustomer } from "../actions"

export default function NewCustomerPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Customer</h1>
        <p className="text-muted-foreground">Create a new customer record</p>
      </div>

      <div className="rounded-md border p-6">
        <CustomerForm action={createCustomer} />
      </div>
    </div>
  )
}
