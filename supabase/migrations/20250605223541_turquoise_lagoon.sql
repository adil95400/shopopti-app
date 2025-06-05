/*
# B2B Marketplace Schema

1. New Tables
   - `b2b_suppliers`: Stores information about B2B suppliers
   - `b2b_products`: Products offered by B2B suppliers
   - `b2b_quote_requests`: Quote requests from users to suppliers

2. Security
   - Enable RLS on all tables
   - Public read access to suppliers and products
   - Authenticated users can manage their own quote requests

3. Sample Data
   - Added sample suppliers for testing
*/

-- Create B2B suppliers table
CREATE TABLE IF NOT EXISTS b2b_suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country text NOT NULL,
  category text NOT NULL,
  delivery_delay text,
  min_order integer DEFAULT 0,
  verified boolean DEFAULT false,
  rating numeric DEFAULT 0,
  description text,
  contact_email text,
  website text,
  logo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create B2B products table
CREATE TABLE IF NOT EXISTS b2b_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid REFERENCES b2b_suppliers(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  min_quantity integer DEFAULT 1,
  discount_tiers jsonb,
  stock integer DEFAULT 0,
  images text[],
  category text,
  specifications jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create B2B quote requests table
CREATE TABLE IF NOT EXISTS b2b_quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid REFERENCES b2b_suppliers(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_ids uuid[],
  quantity integer NOT NULL,
  message text,
  status text DEFAULT 'pending',
  contact_email text NOT NULL,
  contact_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_b2b_products_supplier ON b2b_products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_b2b_products_category ON b2b_products(category);
CREATE INDEX IF NOT EXISTS idx_b2b_quote_requests_supplier ON b2b_quote_requests(supplier_id);
CREATE INDEX IF NOT EXISTS idx_b2b_quote_requests_user ON b2b_quote_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_b2b_suppliers_country ON b2b_suppliers(country);
CREATE INDEX IF NOT EXISTS idx_b2b_suppliers_category ON b2b_suppliers(category);
CREATE INDEX IF NOT EXISTS idx_b2b_suppliers_verified ON b2b_suppliers(verified);

-- Enable Row Level Security
ALTER TABLE b2b_suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_quote_requests ENABLE ROW LEVEL SECURITY;

-- Create policies (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'b2b_suppliers' AND policyname = 'Public read access to b2b suppliers'
    ) THEN
        CREATE POLICY "Public read access to b2b suppliers"
        ON b2b_suppliers
        FOR SELECT
        TO public
        USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'b2b_products' AND policyname = 'Public read access to b2b products'
    ) THEN
        CREATE POLICY "Public read access to b2b products"
        ON b2b_products
        FOR SELECT
        TO public
        USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'b2b_quote_requests' AND policyname = 'Users manage their own quote requests'
    ) THEN
        CREATE POLICY "Users manage their own quote requests"
        ON b2b_quote_requests
        FOR ALL
        TO authenticated
        USING (user_id = auth.uid())
        WITH CHECK (user_id = auth.uid());
    END IF;
END
$$;

-- Insert sample data for testing (only if not already present)
INSERT INTO b2b_suppliers (name, country, category, delivery_delay, min_order, verified, rating, description, contact_email, website)
SELECT 'BigBuy', 'Spain', 'General', '5-12 days', 0, true, 4.9, 'One of Europe''s largest dropshipping suppliers with thousands of products.', 'info@bigbuy.eu', 'https://bigbuy.eu'
WHERE NOT EXISTS (SELECT 1 FROM b2b_suppliers WHERE name = 'BigBuy');

INSERT INTO b2b_suppliers (name, country, category, delivery_delay, min_order, verified, rating, description, contact_email, website)
SELECT 'Shopcom Dropshipping', 'Switzerland', 'General', '7-14 days', 100, true, 4.8, 'Swiss dropshipping provider with a wide range of products.', 'info@shopcom.ch', 'https://shopcom.ch'
WHERE NOT EXISTS (SELECT 1 FROM b2b_suppliers WHERE name = 'Shopcom Dropshipping');

INSERT INTO b2b_suppliers (name, country, category, delivery_delay, min_order, verified, rating, description, contact_email, website)
SELECT 'InnoCigs', 'Germany', 'Vape & E-cigarettes', '3-5 days', 50, true, 4.7, 'Specialized in vape products and e-cigarettes.', 'info@innocigs.de', 'https://innocigs.de'
WHERE NOT EXISTS (SELECT 1 FROM b2b_suppliers WHERE name = 'InnoCigs');

INSERT INTO b2b_suppliers (name, country, category, delivery_delay, min_order, verified, rating, description, contact_email, website)
SELECT 'Syntrox Germany', 'Germany', 'Electronics', '5-7 days', 200, true, 4.5, 'German electronics supplier with high-quality products.', 'info@syntrox.de', 'https://syntrox.de'
WHERE NOT EXISTS (SELECT 1 FROM b2b_suppliers WHERE name = 'Syntrox Germany');