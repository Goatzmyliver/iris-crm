import { InventoryItemForm } from "@/components/inventory/inventory-item-form"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export const metadata = {
  title: "Add Inventory Item - Iris CRM",
  description: "Add a new inventory item",
}

export default async function NewInventoryItemPage() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch categories for the dropdown
  const { data: categories } = await supabase
    .from("inventory_categories")
    .select("*")
    .order("name", { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Add Inventory Item</h2>
        <p className="text-muted-foreground">Create a new inventory item for your business</p>
      </div>

      <InventoryItemForm categories={categories || []} />
    </div>
  )
}

