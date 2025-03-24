"use client"

import { useRouter } from "next/navigation"
import { DollarSign, FileCheck, ArrowRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"

interface BookkeeperSummaryProps {
  readyForInvoicingCount: number
  readyForInvoicingValue: number
  recentlyInvoicedCount: number
  recentlyInvoicedValue: number
}

export function BookkeeperSummary({
  readyForInvoicingCount,
  readyForInvoicingValue,
  recentlyInvoicedCount,
  recentlyInvoicedValue,
}: BookkeeperSummaryProps) {
  const router = useRouter()

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ready for Invoicing</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{readyForInvoicingCount}</div>
          <p className="text-xs text-muted-foreground">Total value: {formatCurrency(readyForInvoicingValue)}</p>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="w-full" onClick={() => router.push("/bookkeeper")}>
            <span>View all</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recently Invoiced</CardTitle>
          <FileCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{recentlyInvoicedCount}</div>
          <p className="text-xs text-muted-foreground">Total value: {formatCurrency(recentlyInvoicedValue)}</p>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="w-full" onClick={() => router.push("/quotes?tab=invoiced")}>
            <span>View all</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

