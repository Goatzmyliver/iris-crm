import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getProducts } from "@/lib/data"
import { Plus, Search } from "lucide-react"

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: { search?: string }
}) {
  const search = searchParams.search || ""
  const products = await getProducts(search)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
        <Button asChild>
          <Link href="/inventory/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
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
              placeholder="Search products..."
              defaultValue={search}
              className="w-full pl-8"
            />
          </div>
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products?.map((product) => (
          <Link key={product.id} href={`/inventory/${product.id}`}>
            <Card className="h-full cursor-pointer transition-colors hover:bg-muted/50">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>{product.sku}</CardDescription>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        product.stock_level > product.low_stock_threshold
                          ? "bg-green-100 text-green-800"
                          : product.stock_level > 0
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.stock_level > product.low_stock_threshold
                        ? "In Stock"
                        : product.stock_level > 0
                          ? "Low Stock"
                          : "Out of Stock"}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Stock: {product.stock_level} {product.unit}
                    </p>
                    <p className="mt-1 text-lg font-bold">${product.price.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {products?.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <h3 className="mt-4 text-lg font-semibold">No products found</h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                {search ? `No products match "${search}"` : "You haven't added any products yet."}
              </p>
              <Button asChild>
                <Link href="/inventory/new">Add Product</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

