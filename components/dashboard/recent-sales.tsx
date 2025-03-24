import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Customer = {
  id: number
  name: string
  email: string
  amount: number
}

export function RecentSales({ customers }: { customers: Customer[] }) {
  return (
    <div className="space-y-8">
      {customers.slice(0, 5).map((customer) => (
        <div key={customer.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`/avatars/${(customer.id % 5) + 1}.png`} alt="Avatar" />
            <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{customer.name}</p>
            <p className="text-sm text-muted-foreground">{customer.email}</p>
          </div>
          <div className="ml-auto font-medium">+${customer.amount.toFixed(2)}</div>
        </div>
      ))}
    </div>
  )
}

