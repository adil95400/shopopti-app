/*
  # Create core tables and policies

  1. New Tables
    - `products` - Base product information
    - `marketplaces` - Available marketplaces
    - `suppliers` - Supplier information
    - `supplier_categories` - Product categories
    - `supplier_ratings` - Supplier ratings and reviews
    - `supplier_orders` - Orders from suppliers
    - `marketplace_analytics` - Analytics data

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create suppliers table first since it's referenced by other tables
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  website text,
  verified boolean DEFAULT false,
  rating numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  title text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
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

-- Create supplier_categories table
CREATE TABLE IF NOT EXISTS supplier_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  parent_id uuid REFERENCES supplier_categories(id),
  created_at timestamptz DEFAULT now()
);

-- Create supplier_ratings table
CREATE TABLE IF NOT EXISTS supplier_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid REFERENCES suppliers(id),
  user_id uuid REFERENCES auth.users(id),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review text,
  created_at timestamptz DEFAULT now()
);

-- Create supplier_orders table
CREATE TABLE IF NOT EXISTS supplier_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid REFERENCES suppliers(id),
  user_id uuid REFERENCES auth.users(id),
  status text NOT NULL DEFAULT 'pending',
  total_amount numeric(10,2) NOT NULL,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  shipping_address jsonb NOT NULL,
  tracking_number text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create marketplace_analytics table
CREATE TABLE IF NOT EXISTS marketplace_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  marketplace_id uuid REFERENCES marketplaces(id),
  product_id uuid REFERENCES products(id),
  views integer DEFAULT 0,
  clicks integer DEFAULT 0,
  conversions integer DEFAULT 0,
  revenue numeric(10,2) DEFAULT 0,
  date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies with unique names
CREATE POLICY "manage_own_products_20250510" ON products
  FOR ALL TO authenticated USING (user_id = auth.uid());

CREATE POLICY "read_marketplaces_20250510" ON marketplaces
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "read_suppliers_20250510" ON suppliers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "read_supplier_categories_20250510" ON supplier_categories
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "manage_supplier_ratings_20250510" ON supplier_ratings
  FOR ALL TO authenticated USING (user_id = auth.uid());

CREATE POLICY "manage_supplier_orders_20250510" ON supplier_orders
  FOR ALL TO authenticated USING (user_id = auth.uid());

CREATE POLICY "view_marketplace_analytics_20250510" ON marketplace_analytics
  FOR SELECT TO authenticated USING (
    product_id IN (
      SELECT id FROM products WHERE user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_supplier_ratings_supplier ON supplier_ratings(supplier_id);
CREATE INDEX idx_supplier_ratings_user_id ON supplier_ratings(user_id);
CREATE INDEX idx_supplier_orders_supplier ON supplier_orders(supplier_id);
CREATE INDEX idx_supplier_orders_user_id ON supplier_orders(user_id);
CREATE INDEX idx_marketplace_analytics_product ON marketplace_analytics(product_id);
CREATE INDEX idx_marketplace_analytics_date ON marketplace_analytics(date);