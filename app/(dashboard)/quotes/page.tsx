"use client"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"

export default async function QuotesPage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  const supabase = createServerComponentClient({ cookies })
  const status = searchParams.status || ""

  let query = supabase.from("quotes").select("*, customers(full_name)")

  if (status) {
    query = query.eq("status", status)
  }

  const { data: quotes } = await query.order("created_at", {
    ascending: false,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quotes</h2>
        <Button asChild>
          <Link href="/quotes/new">
            <Plus className="mr-2 h-4 w-4" />
            New Quote
          </Link>
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <form className="flex-1 sm:max-w-xs">
          <Select
            name="status"
            defaultValue={status}
            onValueChange={(value) => {
              const url = new URL(window.location.href)
              if (value) {
                url.searchParams.set("status", value)
              } else {
                url.searchParams.delete("status")
              }
              window.location.href = url.toString()
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </form>
      </div>

      <div className="grid gap-4">
        {quotes?.map((quote: any) => (
          <Link key={quote.id} href={`/quotes/${quote.id}`}>
            <Card className="cursor-pointer transition-colors hover:bg-muted/50">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Quote #{quote.id}</CardTitle>
                    <CardDescription>{quote.customers?.full_name || "Unknown Customer"}</CardDescription>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        quote.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : quote.status === "sent"
                            ? "bg-blue-100 text-blue-800"
                            : quote.status === "draft"
                              ? "bg-gray-100 text-gray-800"
                              : quote.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Created: {new Date(quote.created_at).toLocaleDateString()}
                    </p>
                    <p className="mt-1 text-lg font-bold">${quote.total_amount.toFixed(2)}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {quotes?.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <h3 className="mt-4 text-lg font-semibold">No quotes found</h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                {status ? `No quotes with status "${status}"` : "You haven't created any quotes yet."}
              </p>
              <Button asChild>
                <Link href="/quotes/new">Create Quote</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

