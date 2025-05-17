/*
  # Create suppliers table and related schemas

  1. New Tables
    - `suppliers` - Store supplier information including:
      - Basic info (name, email, website)
      - Verification status
      - Rating and performance metrics
      - Contact details
      - Created timestamp

  2. Security
    - Enable RLS
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text,
  website text,
  verified boolean DEFAULT false,
  rating numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access to suppliers"
  ON suppliers
  FOR SELECT
  TO public
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_suppliers_verified ON suppliers(verified);
CREATE INDEX IF NOT EXISTS idx_suppliers_rating ON suppliers(rating);