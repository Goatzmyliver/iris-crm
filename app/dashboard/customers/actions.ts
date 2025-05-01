"use server"

import { createCustomer as createCustomerAction, updateCustomer as updateCustomerAction } from "@/lib/customers"
import { redirect } from "next/navigation"
import type { CustomerFormValues } from "@/types/schema"

export async function handleCreateCustomer(data: CustomerFormValues) {
  await createCustomerAction(data)
  redirect("/dashboard/customers")
}

export async function handleUpdateCustomer(id: string, data: CustomerFormValues) {
  await updateCustomerAction(id, data)
  redirect("/dashboard/customers")
}
