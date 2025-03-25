import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface Customer {
  id: string
  name: string
  email?: string
  created_at: string
}

export function RecentCustomers({ customers = [] }: { customers: Customer[] }) {
  if (customers.length === 0) {
    return <p className="text-sm text-muted-foreground">No customers found.</p>
  }

  return (
    <div className="space-y-4">
      {customers.map((customer) => (
        <div key={customer.id} className="flex items-center gap-4">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {customer.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <Link href={`/customers/${customer.id}`} className="font-medium leading-none hover:underline">
              {customer.name}
            </Link>
            <p className="text-sm text-muted-foreground">{customer.email}</p>
          </div>
          <div className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(customer.created_at), { addSuffix: true })}
          </div>
        </div>
      ))}
    </div>
  )
}

