"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/dashboard-layout"

export default function TestConnection() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const [customers, setCustomers] = useState<any[]>([])
  const supabase = createClientComponentClient()

  const testConnection = async () => {
    setStatus("loading")
    setMessage("Testing connection to Supabase...")

    try {
      // Test a simple query
      const { data, error } = await supabase.from("customers").select("id, name").limit(5)

      if (error) throw error

      setCustomers(data || [])
      setStatus("success")
      setMessage(`Connection successful! Found ${data?.length || 0} customers.`)
    } catch (err: any) {
      console.error("Connection error:", err)
      setStatus("error")
      setMessage(`Error: ${err.message || "Unknown error"}`)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Test Supabase Connection</h1>

        <Card>
          <CardHeader>
            <CardTitle>Connection Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testConnection}>Test Connection</Button>

            <div
              className={`p-4 rounded-md ${
                status === "loading"
                  ? "bg-blue-50 text-blue-700"
                  : status === "success"
                    ? "bg-green-50 text-green-700"
                    : status === "error"
                      ? "bg-red-50 text-red-700"
                      : ""
              }`}
            >
              {message}
            </div>

            {status === "success" && customers.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Customers found:</h3>
                <ul className="list-disc pl-5">
                  {customers.map((customer) => (
                    <li key={customer.id}>{customer.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

