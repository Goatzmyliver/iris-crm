import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "-"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function generateUlid(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

export function getInitials(name: string): string {
  if (!name) return ""

  const parts = name.split(" ")
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

export function calculateInvoiceStatus(invoice: any): string {
  if (!invoice) return "pending"

  const dueDate = invoice.due_date ? new Date(invoice.due_date) : null
  const isPaid = invoice.amount_paid >= invoice.total_amount
  const isPartiallyPaid = invoice.amount_paid > 0 && invoice.amount_paid < invoice.total_amount
  const isOverdue = dueDate && dueDate < new Date() && !isPaid

  if (isPaid) return "paid"
  if (isOverdue) return "overdue"
  if (isPartiallyPaid) return "partial"

  return "pending"
}

