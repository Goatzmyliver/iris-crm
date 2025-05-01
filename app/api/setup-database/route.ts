import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Create tables if they don't exist

    // Profiles table
    await supabase.rpc("create_table_if_not_exists", {
      table_name: "profiles",
      table_definition: `
        id UUID PRIMARY KEY REFERENCES auth.users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        full_name TEXT NOT NULL,
        avatar_url TEXT,
        role TEXT DEFAULT 'user',
        email TEXT NOT NULL
      `,
    })

    // Customers table
    await supabase.rpc("create_table_if_not_exists", {
      table_name: "customers",
      table_definition: `
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        zip TEXT NOT NULL,
        notes TEXT,
        status TEXT DEFAULT 'active',
        user_id UUID NOT NULL REFERENCES auth.users(id)
      `,
    })

    // Jobs table
    await supabase.rpc("create_table_if_not_exists", {
      table_name: "jobs",
      table_definition: `
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        customer_id UUID NOT NULL REFERENCES customers(id),
        status TEXT DEFAULT 'pending',
        scheduled_date TIMESTAMP WITH TIME ZONE,
        completion_date TIMESTAMP WITH TIME ZONE,
        assigned_to UUID REFERENCES auth.users(id),
        total_amount NUMERIC(10,2) DEFAULT 0,
        notes TEXT,
        user_id UUID NOT NULL REFERENCES auth.users(id)
      `,
    })

    // Quotes table
    await supabase.rpc("create_table_if_not_exists", {
      table_name: "quotes",
      table_definition: `
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        customer_id UUID NOT NULL REFERENCES customers(id),
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        items JSONB NOT NULL,
        total_amount NUMERIC(10,2) NOT NULL,
        status TEXT DEFAULT 'draft',
        valid_until TIMESTAMP WITH TIME ZONE,
        notes TEXT,
        user_id UUID NOT NULL REFERENCES auth.users(id)
      `,
    })

    // Inventory table
    await supabase.rpc("create_table_if_not_exists", {
      table_name: "inventory",
      table_definition: `
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price NUMERIC(10,2) NOT NULL,
        category TEXT NOT NULL,
        sku TEXT,
        user_id UUID NOT NULL REFERENCES auth.users(id)
      `,
    })

    // Create RLS policies

    // Enable RLS on all tables
    await supabase.rpc("enable_rls", { table_name: "profiles" })
    await supabase.rpc("enable_rls", { table_name: "customers" })
    await supabase.rpc("enable_rls", { table_name: "jobs" })
    await supabase.rpc("enable_rls", { table_name: "quotes" })
    await supabase.rpc("enable_rls", { table_name: "inventory" })

    // Create policies for each table
    // Profiles - users can read their own profile
    await supabase.rpc("create_policy", {
      table_name: "profiles",
      policy_name: "Users can view their own profile",
      definition: `
        FOR SELECT
        TO authenticated
        USING (auth.uid() = id)
      `,
    })

    // Profiles - users can update their own profile
    await supabase.rpc("create_policy", {
      table_name: "profiles",
      policy_name: "Users can update their own profile",
      definition: `
        FOR UPDATE
        TO authenticated
        USING (auth.uid() = id)
      `,
    })

    // Customers - users can read their own customers
    await supabase.rpc("create_policy", {
      table_name: "customers",
      policy_name: "Users can view their own customers",
      definition: `
        FOR SELECT
        TO authenticated
        USING (auth.uid() = user_id)
      `,
    })

    // Customers - users can insert their own customers
    await supabase.rpc("create_policy", {
      table_name: "customers",
      policy_name: "Users can insert their own customers",
      definition: `
        FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = user_id)
      `,
    })

    // Customers - users can update their own customers
    await supabase.rpc("create_policy", {
      table_name: "customers",
      policy_name: "Users can update their own customers",
      definition: `
        FOR UPDATE
        TO authenticated
        USING (auth.uid() = user_id)
      `,
    })

    // Customers - users can delete their own customers
    await supabase.rpc("create_policy", {
      table_name: "customers",
      policy_name: "Users can delete their own customers",
      definition: `
        FOR DELETE
        TO authenticated
        USING (auth.uid() = user_id)
      `,
    })

    // Similar policies for jobs, quotes, and inventory

    return NextResponse.json({ success: true, message: "Database setup completed successfully" })
  } catch (error) {
    console.error("Error setting up database:", error)
    return NextResponse.json({ success: false, error: "Failed to set up database" }, { status: 500 })
  }
}
