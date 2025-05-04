/*
  # Add supplier and marketplace features

  1. New Tables
    - `supplier_categories` - Predefined supplier categories
    - `supplier_ratings` - User ratings and reviews for suppliers
    - `supplier_orders` - Orders placed with suppliers
    - `marketplace_analytics` - Analytics data for marketplace listings

  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users
*/

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
ALTER TABLE supplier_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to supplier categories" ON supplier_categories
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage their supplier ratings" ON supplier_ratings
  FOR ALL TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can manage their supplier orders" ON supplier_orders
  FOR ALL TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can view their marketplace analytics" ON marketplace_analytics
  FOR SELECT TO authenticated USING (
    product_id IN (
      SELECT id FROM products WHERE user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX idx_supplier_ratings_supplier ON supplier_ratings(supplier_id);
CREATE INDEX idx_supplier_orders_supplier ON supplier_orders(supplier_id);
CREATE INDEX idx_supplier_orders_user ON supplier_orders(user_id);
CREATE INDEX idx_marketplace_analytics_product ON marketplace_analytics(product_id);
CREATE INDEX idx_marketplace_analytics_date ON marketplace_analytics(date);