import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: { search?: string }
}) {
  const supabase = createServerComponentClient({ cookies })
  const search = searchParams.search || ""

  let query = supabase.from("customers").select("*")

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`)
  }

  const { data: customers } = await query.order("created_at", {
    ascending: false,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        <Button asChild>
          <Link href="/customers/new">
            <Plus className="mr-2 h-4 w-4" />
            New Customer
          </Link>
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <form className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              name="search"
              placeholder="Search customers..."
              defaultValue={search}
              className="w-full pl-8"
            />
          </div>
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {customers?.map((customer) => (
          <Link key={customer.id} href={`/customers/${customer.id}`}>
            <Card className="h-full cursor-pointer transition-colors hover:bg-muted/50">
              <CardHeader className="pb-2">
                <CardTitle>{customer.full_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p>{customer.email}</p>
                  <p>{customer.phone}</p>
                  <p className="mt-2 line-clamp-2 text-muted-foreground">{customer.address}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {customers?.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <h3 className="mt-4 text-lg font-semibold">No customers found</h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                {search ? `No customers match "${search}"` : "You haven't added any customers yet."}
              </p>
              <Button asChild>
                <Link href="/customers/new">Add Customer</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

