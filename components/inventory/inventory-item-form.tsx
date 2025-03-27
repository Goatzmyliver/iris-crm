"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface InventoryCategory {
  id: string
  name: string
}

interface InventoryItem {
  id: string
  name: string
  sku: string
  description: string
  category_id: string
  cost_price: number
  sell_price: number
  stock_level: number
  min_stock_level: number
}

interface InventoryItemFormProps {
  categories: InventoryCategory[]
  item?: InventoryItem
}

export function InventoryItemForm({ categories, item }: InventoryItemFormProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState<Omit<InventoryItem, "id" | "created_at">>({
    name: item?.name || "",
    sku: item?.sku || "",
    description: item?.description || "",
    category_id: item?.category_id || "",
    cost_price: item?.cost_price || 0,
    sell_price: item?.sell_price || 0,
    stock_level: item?.stock_level || 0,
    min_stock_level: item?.min_stock_level || 0,
  })

  const [markup, setMarkup] = useState<number>(
    item ? Math.round(((item.sell_price - item.cost_price) / item.cost_price) * 100) : 30,
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // If cost price changes, update sell price based on markup
    if (name === "cost_price") {
      const costPrice = Number.parseFloat(value) || 0
      const newSellPrice = costPrice * (1 + markup / 100)
      setFormData((prev) => ({ ...prev, sell_price: Number(newSellPrice.toFixed(2)) }))
    }
  }

  const handleMarkupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMarkup = Number.parseInt(e.target.value) || 0
    setMarkup(newMarkup)

    // Update sell price based on new markup
    const costPrice = formData.cost_price
    const newSellPrice = costPrice * (1 + newMarkup / 100)
    setFormData((prev) => ({ ...prev, sell_price: Number(newSellPrice.toFixed(2)) }))
  }

  const handleSellPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSellPrice = Number.parseFloat(e.target.value) || 0
    setFormData((prev) => ({ ...prev, sell_price: newSellPrice }))

    // Update markup based on new sell price
    const costPrice = formData.cost_price
    if (costPrice > 0) {
      const newMarkup = Math.round(((newSellPrice - costPrice) / costPrice) * 100)
      setMarkup(newMarkup)
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (item) {
        // Update existing item
        const { error } = await supabase.from("inventory_items").update(formData).eq("id", item.id)

        if (error) throw error

        toast({
          title: "Item updated",
          description: "The inventory item has been updated successfully",
        })
      } else {
        // Create new item
        const { error } = await supabase.from("inventory_items").insert(formData)

        if (error) throw error

        toast({
          title: "Item created",
          description: "The inventory item has been created successfully",
        })
      }

      router.push("/dashboard/inventory")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save inventory item",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" name="sku" value={formData.sku} onChange={handleChange} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category_id">Category</Label>
            <Select value={formData.category_id} onValueChange={(value) => handleSelectChange("category_id", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost_price">Cost Price</Label>
              <Input
                id="cost_price"
                name="cost_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.cost_price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="markup">Markup (%)</Label>
              <Input id="markup" name="markup" type="number" min="0" value={markup} onChange={handleMarkupChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sell_price">Sell Price</Label>
              <Input
                id="sell_price"
                name="sell_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.sell_price}
                onChange={handleSellPriceChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock_level">Current Stock Level</Label>
              <Input
                id="stock_level"
                name="stock_level"
                type="number"
                min="0"
                value={formData.stock_level}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="min_stock_level">Minimum Stock Level</Label>
              <Input
                id="min_stock_level"
                name="min_stock_level"
                type="number"
                min="0"
                value={formData.min_stock_level}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/inventory")}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : item ? "Update Item" : "Create Item"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

