/*
  # Create external_suppliers table

  1. New Tables
    - `external_suppliers` - Store external supplier API connections
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `type` (text, required) - bigbuy, eprolo, cdiscount, autods
      - `api_key` (text, required)
      - `api_secret` (text, optional)
      - `base_url` (text, required)
      - `status` (text, required) - active, inactive, error
      - `last_sync` (timestamp, optional)
      - `created_at` (timestamp)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS
    - Add policies for authenticated users to manage their own suppliers

  3. Changes
    - Creates a new table for storing external supplier API connections
    - Adds necessary indexes and constraints
*/

CREATE TABLE IF NOT EXISTS external_suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('bigbuy', 'eprolo', 'cdiscount', 'autods')),
  api_key text NOT NULL,
  api_secret text,
  base_url text NOT NULL,
  status text NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'error')),
  last_sync timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_external_suppliers_user_id ON external_suppliers(user_id);
CREATE INDEX IF NOT EXISTS idx_external_suppliers_type ON external_suppliers(type);
CREATE INDEX IF NOT EXISTS idx_external_suppliers_status ON external_suppliers(status);

-- Enable RLS
ALTER TABLE external_suppliers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own external suppliers"
  ON external_suppliers
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own external suppliers"
  ON external_suppliers
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own external suppliers"
  ON external_suppliers
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own external suppliers"
  ON external_suppliers
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create product_imports table to track imports
CREATE TABLE IF NOT EXISTS product_imports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL,
  external_id text NOT NULL,
  shopify_product_id text,
  supplier_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
  metadata jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_product_imports_product_id ON product_imports(product_id);
CREATE INDEX IF NOT EXISTS idx_product_imports_supplier_id ON product_imports(supplier_id);
CREATE INDEX IF NOT EXISTS idx_product_imports_user_id ON product_imports(user_id);
CREATE INDEX IF NOT EXISTS idx_product_imports_status ON product_imports(status);

-- Enable RLS
ALTER TABLE product_imports ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own product imports"
  ON product_imports
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own product imports"
  ON product_imports
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own product imports"
  ON product_imports
  FOR UPDATE
  USING (auth.uid() = user_id);