import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function RecentCustomers() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Customers</CardTitle>
        <CardDescription>You have no recent customers.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
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
        </div>
      </CardContent>
    </Card>
  )
}

