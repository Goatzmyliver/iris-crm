import { Suspense } from "react"
import { getCustomers } from "@/lib/customers"
import { CustomerList } from "@/components/customers/customer-list"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Customers | Iris CRM",
  description: "Manage your customers",
}

function CustomerListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[300px]" />
        <Skeleton className="h-10 w-[150px]" />
      </div>
      <div className="rounded-md border">
        <div className="h-[400px] w-full">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    </div>
  )
}

async function CustomerListContainer() {
  const customers = await getCustomers()

  return <CustomerList customers={customers} />
}

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground">Manage your customers and their information</p>
      </div>
      <Suspense fallback={<CustomerListSkeleton />}>
        <CustomerListContainer />
      </Suspense>
    </div>
  )
}
