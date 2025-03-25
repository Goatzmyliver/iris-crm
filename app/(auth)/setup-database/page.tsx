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

      // Create enquiries table
      await supabase.rpc("create_enquiries_table")

      // Create quotes table
      await supabase.rpc("create_quotes_table")

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
          <li>Enquiries</li>
          <li>Quotes</li>
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

-- Create enquiries table function
create or replace function create_enquiries_table()
returns void as $$
begin
  create table if not exists enquiries (
    id uuid primary key default uuid_generate_v4(),
    customer_id uuid references customers(id),
    subject text not null,
    message text,
    status text default 'new',
    source text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
  );
end;
$$ language plpgsql;

-- Create quotes table function
create or replace function create_quotes_table()
returns void as $$
begin
  create table if not exists quotes (
    id uuid primary key default uuid_generate_v4(),
    customer_id uuid references customers(id),
    enquiry_id uuid references enquiries(id),
    amount decimal(10,2) not null,
    status text default 'draft',
    valid_until date,
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

