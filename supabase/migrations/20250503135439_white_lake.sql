/*
  # Create suppliers and marketplaces tables

  1. New Tables
    - `suppliers`
      - Basic supplier information
      - Rating and verification status
    - `supplier_products`
      - Products from suppliers
      - Pricing and inventory information
    - `marketplaces`
      - Available marketplaces
      - Connection status and requirements
    - `marketplace_products`
      - Products published to marketplaces
      - Performance tracking

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country text NOT NULL,
  categories text[] NOT NULL,
  products_count integer DEFAULT 0,
  rating numeric(3,2) DEFAULT 0,
  processing_time text,
  shipping_time text,
  minimum_order integer DEFAULT 1,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create supplier_products table
CREATE TABLE IF NOT EXISTS supplier_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid REFERENCES suppliers(id),
  title text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  msrp numeric(10,2),
  images text[] NOT NULL,
  variants jsonb DEFAULT '[]'::jsonb,
  shipping jsonb,
  moq integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create marketplaces table
CREATE TABLE IF NOT EXISTS marketplaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country text NOT NULL,
  logo text,
  status text DEFAULT 'inactive',
  commission numeric(5,2) DEFAULT 0,
  requirements jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create marketplace_products table
CREATE TABLE IF NOT EXISTS marketplace_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  marketplace_id uuid REFERENCES marketplaces(id),
  product_id uuid REFERENCES products(id),
  status text DEFAULT 'pending',
  listing_url text,
  price numeric(10,2) NOT NULL,
  stock integer DEFAULT 0,
  sales integer DEFAULT 0,
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_products ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to suppliers" ON suppliers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access to supplier products" ON supplier_products
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access to marketplaces" ON marketplaces
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage their marketplace products" ON marketplace_products
  FOR ALL TO authenticated USING (
    product_id IN (
      SELECT id FROM products WHERE user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX idx_supplier_products_supplier ON supplier_products(supplier_id);
CREATE INDEX idx_marketplace_products_marketplace ON marketplace_products(marketplace_id);
CREATE INDEX idx_marketplace_products_product ON marketplace_products(product_id);