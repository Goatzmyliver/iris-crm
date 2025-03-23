"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

type LineItem = {
  id: string
  description: string
  quantity: number
  unit_price: number
  total: number
}

interface QuoteLineItemsProps {
  items: LineItem[]
  onChange: (items: LineItem[]) => void
}

export default function QuoteLineItems({ items, onChange }: QuoteLineItemsProps) {
  const handleItemChange = (id: string, field: keyof LineItem, value: string | number) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }

        // Recalculate total if quantity or unit_price changes
        if (field === "quantity" || field === "unit_price") {
          const quantity = field === "quantity" ? Number(value) : item.quantity
          const unitPrice = field === "unit_price" ? Number(value) : item.unit_price
          updatedItem.total = quantity * unitPrice
        }

        return updatedItem
      }
      return item
    })

    onChange(updatedItems)
  }

  const handleRemoveItem = (id: string) => {
    // Don't remove if it's the only item
    if (items.length <= 1) return

    const updatedItems = items.filter((item) => item.id !== id)
    onChange(updatedItems)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground">
        <div className="col-span-5">Description</div>
        <div className="col-span-2">Quantity</div>
        <div className="col-span-2">Unit Price</div>
        <div className="col-span-2">Total</div>
        <div className="col-span-1"></div>
      </div>

      {items.map((item) => (
        <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
          <div className="col-span-5">
            <Input
              value={item.description}
              onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
              placeholder="Product or service description"
            />
          </div>
          <div className="col-span-2">
            <Input
              type="number"
              min="1"
              step="1"
              value={item.quantity}
              onChange={(e) => handleItemChange(item.id, "quantity", Number(e.target.value))}
            />
          </div>
          <div className="col-span-2">
            <Input
              type="number"
              min="0"
              step="0.01"
              value={item.unit_price}
              onChange={(e) => handleItemChange(item.id, "unit_price", Number(e.target.value))}
              className="text-right"
            />
          </div>
          <div className="col-span-2">
            <Input value={formatCurrency(item.total)} readOnly className="bg-muted text-right" />
          </div>
          <div className="col-span-1 flex justify-center">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveItem(item.id)}
              disabled={items.length <= 1}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove item</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

