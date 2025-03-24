"use client"

import { format } from "date-fns"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export type Enquiry = {
  id: number
  createdAt: string
  name: string
  email: string
  phone: string
  enquiryType: string
  status: string
  assignedUserId: string | null
  convertedToCustomerId: number | null
  convertedToQuoteId: string | null
}

export const columns: ColumnDef<Enquiry>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="w-[40px]">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div>
        <Link href={`/enquiries/${row.original.id}`} className="font-medium hover:underline">
          {row.getValue("name")}
        </Link>
      </div>
    ),
  },
  {
    accessorKey: "enquiryType",
    header: "Type",
    cell: ({ row }) => <div className="capitalize">{row.getValue("enquiryType")}</div>,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{format(new Date(row.getValue("createdAt")), "MMM d, yyyy")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string

      return (
        <Badge
          variant={
            status === "new"
              ? "default"
              : status === "in-progress"
                ? "secondary"
                : status === "completed"
                  ? "success"
                  : "outline"
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
    },
  },
  {
    id: "converted",
    header: "Converted",
    cell: ({ row }) => {
      const isConvertedToCustomer = row.original.convertedToCustomerId !== null
      const isConvertedToQuote = row.original.convertedToQuoteId !== null

      if (!isConvertedToCustomer && !isConvertedToQuote) {
        return <div className="text-muted-foreground">No</div>
      }

      return (
        <div className="flex gap-1">
          {isConvertedToCustomer && <Badge variant="outline">Customer</Badge>}
          {isConvertedToQuote && <Badge variant="outline">Quote</Badge>}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const enquiry = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/enquiries/${enquiry.id}`}>View details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/enquiries/${enquiry.id}/edit`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={enquiry.convertedToCustomerId !== null} asChild>
              <Link href={`/enquiries/${enquiry.id}/convert-to-customer`}>Convert to customer</Link>
            </DropdownMenuItem>
            <DropdownMenuItem disabled={enquiry.convertedToQuoteId !== null} asChild>
              <Link href={`/enquiries/${enquiry.id}/create-quote`}>Create quote</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

