"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function SetupDatabase() {
  const [isSetupComplete, setIsSetupComplete] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        const { data, error } = await supabase.rpc("setup_database")

        if (error) {
          console.error("Error setting up database:", error)
        } else {
          console.log("Database setup complete:", data)
          setIsSetupComplete(true)
        }
      } catch (error) {
        console.error("Unexpected error during database setup:", error)
      }
    }

    setupDatabase()
  }, [supabase])

  return (
    <div>
      <h2>Database Setup</h2>
      {isSetupComplete ? <p>Database setup complete!</p> : <p>Setting up the database...</p>}
      <pre>
        {`
-- Enable the pgvector extension to work with embedding vectors
CREATE EXTENSION IF NOT EXISTS vector;

-- Enable the supabase_search extension to work with search
CREATE EXTENSION IF NOT EXISTS supabase_search;

-- Enable the tsm_system_rows extension for similarity score calculations
CREATE EXTENSION IF NOT EXISTS tsm_system_rows;

-- Function to calculate the similarity score between two vectors
CREATE OR REPLACE FUNCTION match_profiles(
  query_embedding vector(1536),
  similarity_threshold float4,
  match_count int
)
RETURNS TABLE (
  id uuid,
  similarity float4
) AS $$
#variable_conflict use_column
BEGIN
  RETURN QUERY
  SELECT
    profiles.id,
    1 - (profiles.embedding <=> query_embedding) AS similarity
  FROM profiles
  WHERE 1 - (profiles.embedding <=> query_embedding) > similarity_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update the 'updated_at' column when a row is updated
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update the 'updated_at' column
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  address TEXT,
  city TEXT,
  region TEXT,
  postal_code TEXT,
  country TEXT,
  industry TEXT,
  company_size TEXT,
  revenue TEXT,
  stage TEXT,
  lead_source TEXT,
  owner_id UUID REFERENCES auth.users(id),
  notes TEXT
);

-- Quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id TEXT PRIMARY KEY DEFAULT generate_ulid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  customer_id INTEGER REFERENCES customers(id),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  total_amount DECIMAL,
  discount DECIMAL,
  tax DECIMAL,
  expiry_date DATE,
  owner_id UUID REFERENCES auth.users(id),
  notes TEXT
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY DEFAULT generate_ulid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  customer_id INTEGER REFERENCES customers(id),
  quote_id TEXT REFERENCES quotes(id),
  invoice_date DATE NOT NULL,
  due_date DATE,
  total_amount DECIMAL NOT NULL,
  amount_paid DECIMAL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  owner_id UUID REFERENCES auth.users(id),
  notes TEXT
);

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
    notes TEXT,
    converted_to_customer_id INTEGER REFERENCES customers(id),
    converted_to_quote_id TEXT REFERENCES quotes(id)
  );

  -- Add indexes for better performance
  CREATE INDEX IF NOT EXISTS enquiries_status_idx ON enquiries(status);
  CREATE INDEX IF NOT EXISTS enquiries_assigned_user_id_idx ON enquiries(assigned_user_id);
  CREATE INDEX IF NOT EXISTS enquiries_created_at_idx ON enquiries(created_at);
END;
$$ LANGUAGE plpgsql;
        `}
      </pre>
    </div>
  )
}

