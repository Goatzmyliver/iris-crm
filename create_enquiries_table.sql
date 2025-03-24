-- Create stored procedure for the enquiries table
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

