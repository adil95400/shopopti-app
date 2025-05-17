/*
  # Create suppliers table and policies

  1. New Tables
    - `suppliers` - Stores supplier information including:
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, optional)
      - `website` (text, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on suppliers table
    - Add policy for public read access

  3. Changes
    - Create indexes for efficient querying
*/

-- Create suppliers table if it doesn't exist
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text,
  website text,
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

-- Add verified and rating columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'suppliers' AND column_name = 'verified'
  ) THEN
    ALTER TABLE suppliers ADD COLUMN verified boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'suppliers' AND column_name = 'rating'
  ) THEN
    ALTER TABLE suppliers ADD COLUMN rating numeric DEFAULT 0;
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_suppliers_verified ON suppliers(verified);
CREATE INDEX IF NOT EXISTS idx_suppliers_rating ON suppliers(rating);