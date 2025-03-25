import CustomerForm from "@/components/customer-form"

export default function NewCustomerPage() {
  return (
    <div className="container max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Add New Customer</h1>
      <CustomerForm />
    </div>
  )
}

