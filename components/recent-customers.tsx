import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface Customer {
  id: number
  name: string
  email: string | null
  phone: string
  stage: string | null
  created_at: string
}

export default function RecentCustomers({ customers }: { customers: Customer[] }) {
  const getStageColor = (stage: string | null) => {
    switch (stage) {
      case "lead":
        return "bg-blue-500"
      case "prospect":
        return "bg-purple-500"
      case "qualified":
        return "bg-yellow-500"
      case "proposal":
        return "bg-orange-500"
      case "won":
        return "bg-green-500"
      case "lost":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Customers</CardTitle>
        <CardDescription>
          {customers.length === 0 ? "You have no recent customers." : `You have ${customers.length} recent customers.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {customers.length === 0 ? (
            <div className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/placeholder.svg" alt="Avatar" />
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">No customers found</p>
                <p className="text-sm text-muted-foreground">example@example.com</p>
              </div>
              <div className="ml-auto font-medium">-</div>
            </div>
          ) : (
            customers.map((customer) => (
              <div key={customer.id} className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/placeholder.svg" alt={customer.name} />
                  <AvatarFallback>
                    {customer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <Link href={`/customers/${customer.id}`} className="text-sm font-medium leading-none hover:underline">
                    {customer.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">{customer.email || customer.phone}</p>
                </div>
                <div className="ml-auto">
                  {customer.stage ? (
                    <Badge className={getStageColor(customer.stage)}>
                      {customer.stage.charAt(0).toUpperCase() + customer.stage.slice(1)}
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(customer.created_at), { addSuffix: true })}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

