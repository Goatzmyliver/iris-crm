"use server"

import { createCustomer, updateCustomer } from "@/lib/customers"
import type { CustomerFormValues } from "@/types/schema"

export async function handleCreateCustomer(data: CustomerFormValues) {
  return await createCustomer(data)
}

export async function handleUpdateCustomer(id: string, data: CustomerFormValues) {
  return await updateCustomer(id, data)
}
