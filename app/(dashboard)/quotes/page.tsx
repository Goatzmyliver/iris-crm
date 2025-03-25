"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getQuotes } from "@/lib/data-client"
import { useSearchParams } from "next/navigation"
import { Plus } from "lucide-react"

export default function QuotesPage() {
  const searchParams = useSearchParams()
  const status = searchParams.get("status") || ""
  const [quotes, setQuotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const data = await getQuotes(status)
        setQuotes(data)
      } catch (error) {
        console.error("Error fetching quotes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [status])

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
          <select
            name="status"
            defaultValue={status}
            onChange={(e) => {
              const url = new URL(window.location.href)
              if (e.target.value) {
                url.searchParams.set("status", e.target.value)
              } else {
                url.searchParams.delete("status")
              }
              window.location.href = url.toString()
            }}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="expired">Expired</option>
          </select>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
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
      )}
    </div>
  )
}

