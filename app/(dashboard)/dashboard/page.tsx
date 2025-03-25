import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentCustomers } from "@/components/recent-customers"
import { RecentLeads } from "@/components/recent-leads"
import { createServerComponentClient } from "@/lib/supabase"

export default async function DashboardPage() {
  const supabase = createServerComponentClient()

  // Fetch stats
  const { data: customersCount } = await supabase.from("customers").select("*", { count: "exact", head: true })

  const { data: leadsCount } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true })
    .eq("status", "open")

  const { data: dealsValue } = await supabase.from("deals").select("amount").eq("status", "active")

  const totalDealsValue = dealsValue?.reduce((sum, deal) => sum + (Number.parseFloat(deal.amount) || 0), 0) || 0

  // Fetch recent customers
  const { data: recentCustomers } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  // Fetch recent leads
  const { data: recentLeads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <DashboardStats
        stats={{
          customersCount: customersCount?.length || 0,
          activeLeads: leadsCount?.length || 0,
          dealsValue: totalDealsValue,
        }}
      />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Customers</CardTitle>
                <CardDescription>Your most recently added customers</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentCustomers customers={recentCustomers || []} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Leads</CardTitle>
                <CardDescription>Your most recently added leads</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentLeads leads={recentLeads || []} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Customers</CardTitle>
              <CardDescription>Manage and view all your customers</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This section will display a comprehensive list of all your customers.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="leads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Leads</CardTitle>
              <CardDescription>Manage and view all your leads</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This section will display a comprehensive list of all your leads.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

