-- Create tables
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  email TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.customers (
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
  user_id UUID NOT NULL
);

CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  customer_id UUID NOT NULL REFERENCES public.customers(id),
  status TEXT DEFAULT 'pending',
  scheduled_date TIMESTAMP WITH TIME ZONE,
  completion_date TIMESTAMP WITH TIME ZONE,
  assigned_to UUID,
  total_amount NUMERIC(10,2) DEFAULT 0,
  notes TEXT,
  user_id UUID NOT NULL
);

CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  customer_id UUID NOT NULL REFERENCES public.customers(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  items JSONB NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'draft',
  valid_until TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  user_id UUID NOT NULL
);

CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  category TEXT NOT NULL,
  sku TEXT,
  user_id UUID NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Customers
CREATE POLICY "Users can view their own customers"
  ON public.customers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own customers"
  ON public.customers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own customers"
  ON public.customers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own customers"
  ON public.customers FOR DELETE
  USING (auth.uid() = user_id);

-- Jobs
CREATE POLICY "Users can view their own jobs"
  ON public.jobs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own jobs"
  ON public.jobs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own jobs"
  ON public.jobs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own jobs"
  ON public.jobs FOR DELETE
  USING (auth.uid() = user_id);

-- Quotes
CREATE POLICY "Users can view their own quotes"
  ON public.quotes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quotes"
  ON public.quotes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quotes"
  ON public.quotes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quotes"
  ON public.quotes FOR DELETE
  USING (auth.uid() = user_id);

-- Inventory
CREATE POLICY "Users can view their own inventory"
  ON public.inventory FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own inventory"
  ON public.inventory FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own inventory"
  ON public.inventory FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own inventory"
  ON public.inventory FOR DELETE
  USING (auth.uid() = user_id);

-- Create the specified user (this needs to be done through the Supabase dashboard)
-- After creating the user, run this to set up their profile:
DO $$
DECLARE
  admin_id UUID;
BEGIN
  -- Get the user ID for troy@carpetland.co.nz
  SELECT id INTO admin_id FROM auth.users WHERE email = 'troy@carpetland.co.nz';
  
  IF admin_id IS NOT NULL THEN
    -- Insert profile for the admin user
    INSERT INTO public.profiles (id, full_name, email, role)
    VALUES (admin_id, 'Troy Admin', 'troy@carpetland.co.nz', 'admin')
    ON CONFLICT (id) DO NOTHING;
    
    -- Add sample data
    -- Sample customers
    INSERT INTO public.customers (name, email, phone, address, city, state, zip, status, user_id)
    VALUES 
      ('John Smith', 'john@example.com', '(555) 123-4567', '123 Main St', 'Auckland', 'AKL', '1010', 'active', admin_id),
      ('Sarah Johnson', 'sarah@example.com', '(555) 987-6543', '456 Oak Ave', 'Wellington', 'WLG', '6011', 'active', admin_id),
      ('Michael Brown', 'michael@example.com', '(555) 456-7890', '789 Pine Rd', 'Christchurch', 'CHC', '8011', 'lead', admin_id);
    
    -- Sample jobs
    INSERT INTO public.jobs (title, description, customer_id, status, scheduled_date, total_amount, user_id)
    VALUES 
      ('Carpet Installation', 'Install new carpet in living room and hallway', 
       (SELECT id FROM public.customers WHERE name = 'John Smith' AND user_id = admin_id LIMIT 1),
       'scheduled', NOW() + INTERVAL '2 days', 1200.00, admin_id),
      ('Flooring Repair', 'Repair damaged hardwood flooring in kitchen', 
       (SELECT id FROM public.customers WHERE name = 'Sarah Johnson' AND user_id = admin_id LIMIT 1),
       'in-progress', NOW() + INTERVAL '1 day', 850.00, admin_id);
    
    -- Sample inventory items
    INSERT INTO public.inventory (name, description, quantity, unit_price, category, sku, user_id)
    VALUES 
      ('Plush Carpet - Beige', 'High-quality plush carpet, beige color', 500, 45.99, 'Carpet', 'CPT-001', admin_id),
      ('Hardwood Flooring - Oak', 'Premium oak hardwood flooring', 300, 89.99, 'Hardwood', 'HWD-002', admin_id),
      ('Vinyl Flooring - Stone Pattern', 'Waterproof vinyl flooring with stone pattern', 400, 35.50, 'Vinyl', 'VNL-003', admin_id);
  END IF;
END $$;
