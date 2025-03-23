"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

// Update the LineItem type to include cost_price and markup
type LineItem = {
  id: string
  description: string
  quantity: number
  cost_price: number
  markup: number
  unit_price: number
  total: number
}

interface QuoteLineItemsProps {
  items: LineItem[]
  onChange: (items: LineItem[]) => void
}

export default function QuoteLineItems({ items, onChange }: QuoteLineItemsProps) {
  // Update the handleItemChange function to handle cost_price and markup calculations
  const handleItemChange = (id: string, field: keyof LineItem, value: string | number) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }

        // Recalculate unit_price if cost_price or markup changes
        if (field === "cost_price" || field === "markup") {
          const costPrice = field === "cost_price" ? Number(value) : item.cost_price
          const markup = field === "markup" ? Number(value) : item.markup
          updatedItem.unit_price = costPrice * (1 + markup / 100)
        }

        // Recalculate total if quantity, cost_price, markup, or unit_price changes
        if (field === "quantity" || field === "cost_price" || field === "markup" || field === "unit_price") {
          const quantity = field === "quantity" ? Number(value) : item.quantity
          const unitPrice = updatedItem.unit_price // Use the potentially updated unit_price
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

  // Update the grid layout and add the new columns
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-16 gap-2 text-sm font-medium text-muted-foreground">
        <div className="col-span-4">Description</div>
        <div className="col-span-2">Quantity</div>
        <div className="col-span-2">Cost Price</div>
        <div className="col-span-2">Markup %</div>
        <div className="col-span-2">Unit Price</div>
        <div className="col-span-3">Total</div>
        <div className="col-span-1"></div>
      </div>

      {items.map((item) => (
        <div key={item.id} className="grid grid-cols-16 gap-2 items-center">
          <div className="col-span-4">
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
              onChange={(e) => handleItemChange(item.id, "quantity", Number.parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="col-span-2">
            <Input
              type="number"
              min="0"
              step="0.01"
              value={item.cost_price || ""}
              onChange={(e) => handleItemChange(item.id, "cost_price", Number.parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="col-span-2">
            <Input
              type="number"
              min="0"
              step="1"
              value={item.markup || ""}
              onChange={(e) => handleItemChange(item.id, "markup", Number.parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="col-span-2">
            <Input
              type="number"
              min="0"
              step="0.01"
              value={item.unit_price || ""}
              onChange={(e) => handleItemChange(item.id, "unit_price", Number.parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="col-span-3">
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

