"use client"

import { useState } from "react"
import { CustomerForm } from "@/components/customers/customer-form"
import { handleUpdateCustomer } from "../../actions"
import type { CustomerFormValues } from "@/types/schema"

export function CustomerFormWrapper({
  customerId,
  customer,
}: {
  customerId: string
  customer: any
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function onSubmit(data: CustomerFormValues) {
    setIsSubmitting(true)
    try {
      await handleUpdateCustomer(customerId, data)
    } catch (error) {
      console.error("Failed to update customer:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return <CustomerForm customer={customer} onSubmit={onSubmit} isSubmitting={isSubmitting} />
}
