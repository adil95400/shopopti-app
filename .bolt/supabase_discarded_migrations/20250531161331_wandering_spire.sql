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
ALTER TABLE marketplaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "read_marketplaces_20250510"
  ON marketplaces
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "view_marketplace_analytics_20250510"
  ON marketplace_analytics
  FOR SELECT
  TO authenticated
  USING (product_id IN (
    SELECT products.id
    FROM products
    WHERE products.user_id = auth.uid()
  ));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_marketplace_analytics_date ON marketplace_analytics(date);
CREATE INDEX IF NOT EXISTS idx_marketplace_analytics_product ON marketplace_analytics(product_id);