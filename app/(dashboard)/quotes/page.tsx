import type { Metadata } from "next"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { QuotesTable } from "@/components/quotes-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Quotes | Iris CRM",
  description: "Manage your quotes and proposals",
}

export default async function QuotesPage() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch quotes with customer information
  const { data: quotes } = await supabase
    .from("quotes")
    .select(`
      *,
      customers (
        id,
        name,
        email
      )
    `)
    .order("created_at", { ascending: false })

  // Group quotes by status
  const draftQuotes = quotes?.filter((quote) => quote.status === "draft") || []
  const sentQuotes = quotes?.filter((quote) => quote.status === "sent") || []
  const acceptedQuotes = quotes?.filter((quote) => quote.status === "accepted") || []
  const readyForInvoicingQuotes = quotes?.filter((quote) => quote.status === "ready_for_invoicing") || []
  const invoicedQuotes = quotes?.filter((quote) => quote.status === "invoiced") || []
  const rejectedQuotes = quotes?.filter((quote) => quote.status === "rejected") || []

  return (
    <DashboardShell>
      <DashboardHeader heading="Quotes" description="Manage your quotes and proposals">
        <Button asChild>
          <Link href="/quotes/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Quote
          </Link>
        </Button>
      </DashboardHeader>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Quotes</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="ready_for_invoicing">Ready for Invoicing</TabsTrigger>
          <TabsTrigger value="invoiced">Invoiced in MYOB</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <QuotesTable quotes={quotes || []} />
        </TabsContent>
        <TabsContent value="draft">
          <QuotesTable quotes={draftQuotes} />
        </TabsContent>
        <TabsContent value="sent">
          <QuotesTable quotes={sentQuotes} />
        </TabsContent>
        <TabsContent value="accepted">
          <QuotesTable quotes={acceptedQuotes} />
        </TabsContent>
        <TabsContent value="ready_for_invoicing">
          <QuotesTable quotes={readyForInvoicingQuotes} />
        </TabsContent>
        <TabsContent value="invoiced">
          <QuotesTable quotes={invoicedQuotes} />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

