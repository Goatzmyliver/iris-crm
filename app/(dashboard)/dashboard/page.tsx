import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerComponentClient } from "@/lib/supabase"
import { Users, FileText, DollarSign, Briefcase } from "lucide-react"

export default async function DashboardPage() {
  const supabase = createServerComponentClient()

  // Get user info
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Welcome to IRIS CRM</CardTitle>
          <CardDescription>
            Hello, {user?.user_metadata?.name || user?.email || "there"}! Your CRM system is ready to use.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            This is your dashboard where you can manage customers, enquiries, quotes, and more. Use the navigation menu
            on the left to access different sections of the CRM.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Manage your customer database</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enquiries</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Track customer enquiries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quotes</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0</div>
            <p className="text-xs text-muted-foreground">Manage customer quotes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Track ongoing jobs</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

