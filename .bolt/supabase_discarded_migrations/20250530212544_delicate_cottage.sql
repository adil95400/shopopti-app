-- Add new fields to suppliers table
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS country text;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS logo text;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS categories text[];
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS products_count integer DEFAULT 0;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS processing_time text;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS shipping_time text;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS minimum_order integer DEFAULT 0;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS performance jsonb DEFAULT '{"on_time_delivery": 0, "quality_rating": 0, "response_rate": 0, "response_time": "0h"}'::jsonb;

-- Create supplier_products table
CREATE TABLE IF NOT EXISTS supplier_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid REFERENCES suppliers(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  msrp numeric,
  moq integer DEFAULT 1,
  processing_time text,
  images text[],
  category text,
  variants jsonb DEFAULT '[]'::jsonb,
  customization jsonb,
  certifications text[],
  specifications jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE supplier_products ENABLE ROW LEVEL SECURITY;

-- Add sample suppliers
INSERT INTO suppliers (
  name, country, description, logo, categories, products_count, 
  processing_time, shipping_time, minimum_order, verified, rating,
  performance
) VALUES
-- Fashion & Apparel
('StyleHub Global', 'US', 'Premium fashion dropshipping supplier with focus on sustainable materials', 
'https://images.pexels.com/photos/7679725/pexels-photo-7679725.jpeg', 
ARRAY['Fashion', 'Apparel'], 2500, '2-3 days', '5-7 days', 100, true, 4.8,
'{"on_time_delivery": 98, "quality_rating": 96, "response_rate": 99, "response_time": "2h"}'::jsonb),

('TrendWave', 'UK', 'Trendy fashion accessories and jewelry', 
'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg',
ARRAY['Accessories', 'Jewelry'], 1800, '1-2 days', '3-5 days', 50, true, 4.7,
'{"on_time_delivery": 97, "quality_rating": 95, "response_rate": 98, "response_time": "3h"}'::jsonb),

('TechPro Supply', 'CN', 'Leading electronics and gadgets supplier',
'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg',
ARRAY['Electronics', 'Gadgets'], 3500, '2-4 days', '7-10 days', 200, true, 4.6,
'{"on_time_delivery": 96, "quality_rating": 94, "response_rate": 97, "response_time": "4h"}'::jsonb),

('EcoHome Essentials', 'US', 'Eco-friendly home and garden products',
'https://images.pexels.com/photos/6207364/pexels-photo-6207364.jpeg',
ARRAY['Home', 'Garden'], 2200, '1-3 days', '4-6 days', 150, true, 4.9,
'{"on_time_delivery": 99, "quality_rating": 98, "response_rate": 100, "response_time": "1h"}'::jsonb);

-- Add sample products
INSERT INTO supplier_products (
  supplier_id,
  name,
  description,
  price,
  msrp,
  moq,
  processing_time,
  images,
  category,
  variants,
  customization,
  certifications
)
SELECT
  s.id,
  'Sample Product ' || generate_series(1, 10),
  'High-quality product with premium features',
  random() * 100 + 20,
  random() * 150 + 50,
  floor(random() * 50 + 1),
  floor(random() * 5 + 1) || '-' || floor(random() * 5 + 3) || ' days',
  ARRAY['https://images.pexels.com/photos/1037992/pexels-photo-1037992.jpeg'],
  (SELECT unnest(s.categories) LIMIT 1),
  '[{"name": "Standard", "price": 29.99, "moq": 1}]'::jsonb,
  '{"available": true, "options": ["Color", "Size"], "min_quantity": 100}'::jsonb,
  ARRAY['CE', 'RoHS']
FROM suppliers s;

-- Create policies
CREATE POLICY "Public read access to supplier products"
  ON supplier_products
  FOR SELECT
  TO public
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_supplier_products_supplier ON supplier_products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_products_category ON supplier_products(category);
CREATE INDEX IF NOT EXISTS idx_suppliers_country ON suppliers(country);
CREATE INDEX IF NOT EXISTS idx_suppliers_categories ON suppliers USING gin(categories);