"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useSearchParams } from "next/navigation"
import { Plus, Search, Phone, Mail, ArrowRight } from "lucide-react"

export default function EnquiriesPage() {
  const searchParams = useSearchParams()
  const search = searchParams.get("search") || ""
  const status = searchParams.get("status") || "new"
  const [enquiries, setEnquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        let query = supabase.from("enquiries").select("*, customers(full_name, email, phone)")

        if (search) {
          query = query.or(
            `customers.full_name.ilike.%${search}%,customers.email.ilike.%${search}%,customers.phone.ilike.%${search}%,source.ilike.%${search}%`,
          )
        }

        if (status && status !== "all") {
          query = query.eq("status", status)
        }

        const { data, error } = await query.order("created_at", { ascending: false })

        if (error) throw error
        setEnquiries(data || [])
      } catch (error) {
        console.error("Error fetching enquiries:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase, search, status])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-500">New</Badge>
      case "contacted":
        return <Badge className="bg-yellow-500">Contacted</Badge>
      case "quoted":
        return <Badge className="bg-purple-500">Quoted</Badge>
      case "converted":
        return <Badge className="bg-green-500">Converted</Badge>
      case "lost":
        return (
          <Badge variant="outline" className="text-red-500 border-red-500">
            Lost
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Enquiries</h2>
        <Button asChild>
          <Link href="/enquiries/new">
            <Plus className="mr-2 h-4 w-4" />
            New Enquiry
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <form className="flex-1 w-full">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              name="search"
              placeholder="Search enquiries..."
              defaultValue={search}
              className="w-full pl-8"
            />
          </div>
        </form>

        <div className="flex-shrink-0 w-full sm:w-auto">
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
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="quoted">Quoted</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {enquiries?.map((enquiry) => (
            <Link key={enquiry.id} href={`/enquiries/${enquiry.id}`}>
              <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{enquiry.customers?.full_name || "Unknown Customer"}</CardTitle>
                      <CardDescription>
                        {new Date(enquiry.created_at).toLocaleDateString()} - {enquiry.source}
                      </CardDescription>
                    </div>
                    <div className="flex items-center">{getStatusBadge(enquiry.status)}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="mr-2 h-4 w-4" />
                        {enquiry.customers?.phone || "No phone"}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="mr-2 h-4 w-4" />
                        {enquiry.customers?.email || "No email"}
                      </div>
                      <p className="text-sm line-clamp-1">{enquiry.description}</p>
                    </div>
                    <div className="flex gap-2">
                      {enquiry.status !== "converted" && enquiry.status !== "lost" && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/quotes/new?enquiry=${enquiry.id}`}>
                            <ArrowRight className="mr-2 h-4 w-4" />
                            Create Quote
                          </Link>
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {enquiries?.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                <h3 className="mt-4 text-lg font-semibold">No enquiries found</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                  {search
                    ? `No enquiries match "${search}"`
                    : status !== "all"
                      ? `No enquiries with status "${status}"`
                      : "You haven't added any enquiries yet."}
                </p>
                <Button asChild>
                  <Link href="/enquiries/new">Add Enquiry</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

