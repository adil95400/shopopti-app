/*
  # Fix store_connections table and add missing foreign key to products

  1. Changes
    - Add foreign key constraint to products table for supplier_id
    - Ensure store_connections table exists with proper structure
    - Add RLS policies for store_connections

  2. Security
    - Enable RLS on store_connections
    - Add policies for authenticated users
*/

-- Fix products table foreign key reference
ALTER TABLE IF EXISTS public.products
ADD CONSTRAINT products_supplier_id_fkey
FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id)
ON DELETE SET NULL;

-- Ensure store_connections table exists with proper structure
CREATE TABLE IF NOT EXISTS public.store_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  platform TEXT NOT NULL,
  store_url TEXT NOT NULL,
  api_key TEXT NOT NULL,
  api_secret TEXT,
  scopes TEXT[],
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  last_sync TIMESTAMPTZ
);

-- Enable RLS on store_connections
ALTER TABLE public.store_connections ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to manage their own connections
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'store_connections' AND policyname = 'User store access'
  ) THEN
    CREATE POLICY "User store access" ON public.store_connections
      FOR ALL TO authenticated
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
END
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_store_connections_user_id ON public.store_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_store_connections_status ON public.store_connections(status);