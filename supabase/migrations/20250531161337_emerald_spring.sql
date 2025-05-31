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

-- Enable RLS
ALTER TABLE supplier_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_orders ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "read_supplier_categories_20250510"
  ON supplier_categories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "manage_supplier_ratings_20250510"
  ON supplier_ratings
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "manage_supplier_orders_20250510"
  ON supplier_orders
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_supplier_ratings_supplier ON supplier_ratings(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_ratings_user_id ON supplier_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_supplier_orders_supplier ON supplier_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_orders_user_id ON supplier_orders(user_id);