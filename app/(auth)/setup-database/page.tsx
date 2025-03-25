"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientComponentClient } from "@/lib/supabase"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function SetupDatabasePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()

  async function setupDatabase() {
    setIsLoading(true)

    try {
      // Create customers table
      await supabase.rpc("create_customers_table")

      // Create leads table
      await supabase.rpc("create_leads_table")

      // Create deals table
      await supabase.rpc("create_deals_table")

      toast.success("Database setup completed successfully!")
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Error setting up database:", error)
      toast.error("Failed to setup database. Please check console for details.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="mx-auto mt-8 w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Setup Database</CardTitle>
        <CardDescription className="text-center">Initialize your CRM database tables</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          This will create the following tables in your Supabase database:
        </p>
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
          <li>Customers</li>
          <li>Leads</li>
          <li>Deals</li>
        </ul>
        <p className="text-sm text-muted-foreground">
          Note: You need to create the following stored procedures in your Supabase SQL editor first:
        </p>
        <pre className="text-xs bg-muted p-2 rounded-md overflow-auto">
          {`-- Create customers table function
create or replace function create_customers_table()
returns void as $$
begin
  create table if not exists customers (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    email text,
    phone text,
    company text,
    address text,
    notes text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
  );
end;
$$ language plpgsql;

-- Create leads table function
create or replace function create_leads_table()
returns void as $$
begin
  create table if not exists leads (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text,
    customer_id uuid references customers(id),
    status text default 'new',
    source text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
  );
end;
$$ language plpgsql;

-- Create deals table function
create or replace function create_deals_table()
returns void as $$
begin
  create table if not exists deals (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    customer_id uuid references customers(id),
    lead_id uuid references leads(id),
    amount decimal(10,2) not null,
    status text default 'active',
    expected_close_date date,
    notes text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
  );
end;
$$ language plpgsql;`}
        </pre>
      </CardContent>
      <CardFooter>
        <Button onClick={setupDatabase} className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Setting up...
            </>
          ) : (
            "Setup Database"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

