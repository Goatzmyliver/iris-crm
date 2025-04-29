import { InventoryItemForm } from "@/components/inventory/inventory-item-form"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"

export const metadata = {
  title: "Edit Inventory Item - Iris CRM",
  description: "Edit an inventory item",
}

type Props = {
  params: {
    id: string
  }
}

export default async function EditInventoryItemPage(props: Props) {
  const { id } = props.params
  const supabase = createServerComponentClient({ cookies })

  // Fetch the inventory item
  const { data: item } = await supabase.from("inventory_items").select("*").eq("id", id).single()

  if (!item) {
    notFound()
  }

  // Fetch categories for the dropdown
  const { data: categories } = await supabase
    .from("inventory_categories")
    .select("*")
    .order("name", { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Edit Inventory Item</h2>
        <p className="text-muted-foreground">Update details for {item.name}</p>
      </div>

      <InventoryItemForm categories={categories || []} item={item} />
    </div>
  )
}
