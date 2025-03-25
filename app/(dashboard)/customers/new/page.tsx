import { CustomerForm } from "@/components/customer-form"

export default function NewCustomerPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Add New Customer</h2>
      <CustomerForm />
    </div>
  )
}

