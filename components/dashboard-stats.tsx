import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, DollarSign } from "lucide-react"

interface StatsProps {
  stats?: {
    customersCount?: number
    activeLeads?: number
    dealsValue?: number
  }
}

export function DashboardStats({ stats = {} }: StatsProps) {
  const { customersCount = 0, activeLeads = 0, dealsValue = 0 } = stats

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{customersCount}</div>
          <p className="text-xs text-muted-foreground">Total customers in your CRM</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeLeads}</div>
          <p className="text-xs text-muted-foreground">Open leads requiring follow-up</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Deals Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${dealsValue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Total value of active deals</p>
        </CardContent>
      </Card>
    </div>
  )
}

