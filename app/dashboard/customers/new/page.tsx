"use client"

import { CustomerForm } from "@/components/customers/customer-form"
import { createCustomer } from "@/lib/customers"

export default function NewCustomerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Customer</h1>
        <p className="text-muted-foreground">Add a new customer to your database</p>
      </div>
      <div className="rounded-md border p-6">
        <CustomerForm
          onSubmit={async (data) => {
            "use server"
            await createCustomer(data)
          }}
        />
      </div>
    </div>
  )
}
