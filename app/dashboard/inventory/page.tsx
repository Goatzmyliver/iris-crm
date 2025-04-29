import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { InventoryList } from "@/components/inventory/inventory-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export const metadata = {
  title: "Inventory - Iris CRM",
  description: "Manage your inventory items",
}

export default async function InventoryPage() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch inventory categories for filtering
  const { data: categories } = await supabase
    .from("inventory_categories")
    .select("*")
    .order("name", { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Inventory</h2>
          <p className="text-muted-foreground">Manage your inventory items and stock levels</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/inventory/new">
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Link>
        </Button>
      </div>

      <InventoryList initialCategories={categories || []} />
    </div>
  )
}
