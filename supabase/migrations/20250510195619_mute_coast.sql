/*
  # Add suppliers table

  1. New Tables
    - `suppliers` - Store supplier information
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text)
      - `website` (text)
      - `verified` (boolean)
      - `rating` (numeric)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS
    - Add public read access policy

  3. Indexes
    - Create indexes on verified and rating columns
*/

-- Create suppliers table if it doesn't exist
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text,
  website text,
  verified boolean DEFAULT false,
  rating numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS if not already enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'suppliers' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop existing policy if it exists and create new one
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Public read access to suppliers" ON suppliers;
  
  CREATE POLICY "Public read access to suppliers"
    ON suppliers
    FOR SELECT
    TO public
    USING (true);
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_suppliers_verified ON suppliers(verified);
CREATE INDEX IF NOT EXISTS idx_suppliers_rating ON suppliers(rating);