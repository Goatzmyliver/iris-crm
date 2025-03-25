"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import DashboardLayout from "@/components/dashboard-layout"

export default function SetupDatabase() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const supabase = createClientComponentClient()

  const createTables = async () => {
    setStatus("loading")
    setMessage("Setting up database tables...")

    try {
      // Create customers table
      const { error: customersError } = await supabase.rpc("create_customers_table")
      if (customersError) throw customersError

      // Create quotes table
      const { error: quotesError } = await supabase.rpc("create_quotes_table")
      if (quotesError) throw quotesError

      // Create quote_items table
      const { error: quoteItemsError } = await supabase.rpc("create_quote_items_table")
      if (quoteItemsError) throw quoteItemsError

      // Create jobs table
      const { error: jobsError } = await supabase.rpc("create_jobs_table")
      if (jobsError) throw jobsError

      // Create inventory_items table
      const { error: inventoryError } = await supabase.rpc("create_inventory_items_table")
      if (inventoryError) throw inventoryError

      // Create suppliers table
      const { error: suppliersError } = await supabase.rpc("create_suppliers_table")
      if (suppliersError) throw suppliersError

      setStatus("success")
      setMessage("Database tables created successfully!")
    } catch (err: any) {
      console.error("Error setting up database:", err)
      setStatus("error")
      setMessage(`Error: ${err.message || "Unknown error"}`)
    }
  }

  const createTestData = async () => {
    setStatus("loading")
    setMessage("Creating test data...")

    try {
      // Create test customer
      const { error: customerError } = await supabase.from("customers").insert({
        name: "Test Customer",
        email: "test@example.com",
        phone: "123-456-7890",
        address: "123 Test St, Test City",
      })

      if (customerError) throw customerError

      setStatus("success")
      setMessage("Test data created successfully!")
    } catch (err: any) {
      console.error("Error creating test data:", err)
      setStatus("error")
      setMessage(`Error: ${err.message || "Unknown error"}`)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Database Setup</h1>

        <Card>
          <CardHeader>
            <CardTitle>Set Up Database Tables</CardTitle>
            <CardDescription>Create the necessary tables in your Supabase database</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Before using the CRM, you need to set up the database tables. Click the button below to create all
              required tables.
            </p>

            <div className="flex flex-col gap-4">
              <Button onClick={createTables} disabled={status === "loading"}>
                {status === "loading" ? "Setting up..." : "Set Up Database Tables"}
              </Button>

              <Button onClick={createTestData} disabled={status === "loading"} variant="outline">
                Create Test Customer
              </Button>
            </div>

            {status !== "idle" && (
              <Alert variant={status === "error" ? "destructive" : status === "success" ? "default" : "default"}>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Note: You need to run the SQL scripts in your Supabase SQL Editor first. See instructions below.
            </p>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SQL Setup Instructions</CardTitle>
            <CardDescription>Run these SQL commands in your Supabase SQL Editor</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              To set up the database properly, you need to create stored procedures that will create the tables. Follow
              these steps:
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Go to your Supabase dashboard</li>
              <li>Click on "SQL Editor" in the left sidebar</li>
              <li>Create a new query</li>
              <li>Copy and paste the SQL code below</li>
              <li>Run the query</li>
              <li>Come back to this page and click "Set Up Database Tables"</li>
            </ol>

            <div className="mt-4 p-4 bg-gray-100 rounded-md overflow-auto max-h-96">
              <pre className="text-xs">
                {`-- Create stored procedures for table creation

-- Customers table
CREATE OR REPLACE FUNCTION create_customers_table()
RETURNS void AS $$
BEGIN
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  address TEXT,
  notes TEXT,
  assigned_user_id UUID REFERENCES auth.users(id)
);
END;
$$ LANGUAGE plpgsql;

-- Quotes table
CREATE OR REPLACE FUNCTION create_quotes_table()
RETURNS void AS $$
BEGIN
CREATE TABLE IF NOT EXISTS quotes (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  status TEXT NOT NULL DEFAULT 'draft',
  total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  notes TEXT,
  assigned_user_id UUID REFERENCES auth.users(id)
);
END;
$$ LANGUAGE plpgsql;

-- Quote items table
CREATE OR REPLACE FUNCTION create_quote_items_table()
RETURNS void AS $$
BEGIN
CREATE TABLE IF NOT EXISTS quote_items (
  id SERIAL PRIMARY KEY,
  quote_id TEXT NOT NULL REFERENCES quotes(id),
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  cost_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  markup DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL DEFAULT 0
);
END;
$$ LANGUAGE plpgsql;

-- Jobs table
CREATE OR REPLACE FUNCTION create_jobs_table()
RETURNS void AS $$
BEGIN
CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  quote_id TEXT REFERENCES quotes(id),
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  status TEXT NOT NULL DEFAULT 'scheduled',
  scheduled_date DATE,
  completed_date DATE,
  notes TEXT,
  assigned_user_id UUID REFERENCES auth.users(id)
);
END;
$$ LANGUAGE plpgsql;

-- Inventory items table
CREATE OR REPLACE FUNCTION create_inventory_items_table()
RETURNS void AS $$
BEGIN
CREATE TABLE IF NOT EXISTS inventory_items (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  cost_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  sell_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  stock_level INTEGER NOT NULL DEFAULT 0,
  supplier_id INTEGER REFERENCES suppliers(id)
);
END;
$$ LANGUAGE plpgsql;

-- Suppliers table
CREATE OR REPLACE FUNCTION create_suppliers_table()
RETURNS void AS $$
BEGIN
CREATE TABLE IF NOT EXISTS suppliers (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT NOT NULL,
  address TEXT,
  notes TEXT
);
END;
$$ LANGUAGE plpgsql;

-- Users table (for storing additional user info)
CREATE OR REPLACE FUNCTION create_users_table()
RETURNS void AS $$
BEGIN
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user'
);
END;
$$ LANGUAGE plpgsql;

-- Enquiries table
CREATE OR REPLACE FUNCTION create_enquiries_table()
RETURNS void AS $$
BEGIN
CREATE TABLE IF NOT EXISTS enquiries (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  address TEXT,
  enquiry_type TEXT NOT NULL,
  description TEXT,
  source TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  assigned_user_id UUID REFERENCES auth.users(id),
  notes TEXT
);
END;
$$ LANGUAGE plpgsql;`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

