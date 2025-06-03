/*
  # Supplier and Product Schema Enhancement

  1. New Tables
    - `suppliers` - Enhanced supplier table with detailed information
    - `supplier_products` - Complete product catalog for suppliers
    - `supplier_ratings` - Customer ratings and reviews for suppliers
    - `supplier_orders` - Orders placed with suppliers

  2. Security
    - Enable RLS on all tables
    - Add appropriate access policies for each table
    - Create indexes for performance optimization

  3. Relationships
    - Link suppliers to products
    - Link ratings to suppliers and users
    - Link orders to suppliers and users
*/

-- Create suppliers table with enhanced fields
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  website text,
  verified boolean DEFAULT false,
  rating numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  country text,
  description text,
  logo text,
  categories text[],
  products_count integer DEFAULT 0,
  processing_time text,
  shipping_time text,
  minimum_order integer DEFAULT 0,
  performance jsonb DEFAULT '{"response_rate": 0, "response_time": "0h", "quality_rating": 0, "on_time_delivery": 0}'::jsonb,
  user_id uuid REFERENCES auth.users(id)
);

-- Create supplier_products table with comprehensive product information
CREATE TABLE IF NOT EXISTS supplier_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid REFERENCES suppliers(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric,
  msrp numeric,
  moq integer DEFAULT 1,
  processing_time text,
  images text[],
  category text,
  variants jsonb DEFAULT '[]'::jsonb,
  customization jsonb,
  certifications text[],
  specifications jsonb,
  created_at timestamptz DEFAULT now(),
  base_price numeric,
  retail_price numeric,
  inventory_count integer DEFAULT 0,
  shipping_time integer,
  user_id uuid REFERENCES auth.users(id),
  origin_country text,
  devise text
);

-- Create or update supplier_ratings table
CREATE TABLE IF NOT EXISTS supplier_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid REFERENCES suppliers(id),
  user_id uuid REFERENCES auth.users(id),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review text,
  created_at timestamptz DEFAULT now()
);

-- Create or update supplier_orders table
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

-- Create supplier_categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS supplier_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  parent_id uuid REFERENCES supplier_categories(id),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for suppliers
CREATE POLICY "read_suppliers_20250510" ON suppliers
  FOR SELECT TO authenticated USING (true);

-- Create policies for supplier_products
CREATE POLICY "Public read access to supplier products" ON supplier_products
  FOR SELECT TO public USING (true);

-- Create policies for supplier_ratings
CREATE POLICY "manage_supplier_ratings_20250510" ON supplier_ratings
  FOR ALL TO authenticated USING (user_id = auth.uid());

-- Create policies for supplier_orders
CREATE POLICY "manage_supplier_orders_20250510" ON supplier_orders
  FOR ALL TO authenticated USING (user_id = auth.uid());

-- Create policies for supplier_categories
CREATE POLICY "read_supplier_categories_20250510" ON supplier_categories
  FOR SELECT TO authenticated USING (true);

-- Create indexes for performance
CREATE INDEX idx_suppliers_categories ON suppliers USING gin (categories);
CREATE INDEX idx_suppliers_country ON suppliers USING btree (country);
CREATE INDEX idx_suppliers_rating ON suppliers USING btree (rating);
CREATE INDEX idx_suppliers_verified ON suppliers USING btree (verified);

CREATE INDEX idx_supplier_products_supplier ON supplier_products USING btree (supplier_id);
CREATE INDEX idx_supplier_products_category ON supplier_products USING btree (category);

CREATE INDEX idx_supplier_ratings_supplier ON supplier_ratings USING btree (supplier_id);
CREATE INDEX idx_supplier_ratings_user_id ON supplier_ratings USING btree (user_id);

CREATE INDEX idx_supplier_orders_supplier ON supplier_orders USING btree (supplier_id);
CREATE INDEX idx_supplier_orders_user_id ON supplier_orders USING btree (user_id);

-- Insert sample suppliers
INSERT INTO suppliers (name, email, website, verified, rating, country, description, categories, processing_time, shipping_time, minimum_order, performance)
VALUES 
  ('TechPro Supply', 'contact@techprosupply.com', 'https://techprosupply.com', true, 4.8, 'US', 'Premier supplier of consumer electronics and accessories with fast shipping across North America.', ARRAY['Electronics', 'Accessories'], '1-3 days', '3-7 days', 50, '{"response_rate": 98, "response_time": "2h", "quality_rating": 96, "on_time_delivery": 98}'),
  ('EcoHome Essentials', 'info@ecohome.com', 'https://ecohomeessentials.com', true, 4.7, 'UK', 'Sustainable home goods and eco-friendly products for the conscious consumer.', ARRAY['Home & Garden', 'Eco-Friendly'], '1-2 days', '2-5 days', 30, '{"response_rate": 95, "response_time": "3h", "quality_rating": 98, "on_time_delivery": 97}'),
  ('StyleHub Global', 'partners@stylehub.com', 'https://stylehubglobal.com', true, 4.6, 'IT', 'Trendy fashion items from Italian designers with worldwide shipping.', ARRAY['Fashion', 'Apparel'], '2-3 days', '4-8 days', 100, '{"response_rate": 92, "response_time": "4h", "quality_rating": 97, "on_time_delivery": 94}'),
  ('FitLife Gear', 'wholesale@fitlifegear.com', 'https://fitlifegear.com', true, 4.9, 'AU', 'Premium fitness equipment and outdoor gear from Australia.', ARRAY['Sports & Outdoors', 'Fitness'], '1-2 days', '5-10 days', 75, '{"response_rate": 98, "response_time": "1h", "quality_rating": 99, "on_time_delivery": 99}'),
  ('BeautyWorld Cosmetics', 'business@beautyworld.com', 'https://beautyworldcosmetics.com', true, 4.7, 'FR', 'Luxury beauty products and cosmetics from France.', ARRAY['Beauty & Personal Care', 'Cosmetics'], '1-3 days', '3-7 days', 60, '{"response_rate": 94, "response_time": "3h", "quality_rating": 98, "on_time_delivery": 96}');

-- Insert sample products for each supplier
INSERT INTO supplier_products (supplier_id, name, description, price, msrp, moq, processing_time, images, category, variants, customization, certifications, specifications)
VALUES 
  -- TechPro Supply products
  ((SELECT id FROM suppliers WHERE name = 'TechPro Supply'), 'Wireless Bluetooth Earbuds', 'Premium wireless earbuds with noise cancellation and long battery life.', 29.99, 59.99, 10, '2 days', ARRAY['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300'], 'Electronics', '[{"name":"Color","options":["Black","White","Blue"],"price_modifier":0},{"name":"Case","options":["Standard","Premium"],"price_modifier":5}]'::jsonb, '{"available":true,"options":["Custom Logo","Custom Packaging"],"min_quantity":50}'::jsonb, ARRAY['CE', 'FCC', 'RoHS'], '{"Battery Life":"8 hours","Charging Time":"1.5 hours","Bluetooth Version":"5.2","Water Resistance":"IPX5"}'::jsonb),
  
  ((SELECT id FROM suppliers WHERE name = 'TechPro Supply'), 'Smart Watch Series 5', 'Feature-rich smartwatch with health monitoring and notifications.', 45.99, 89.99, 5, '3 days', ARRAY['https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300'], 'Electronics', '[{"name":"Color","options":["Black","Silver","Rose Gold"],"price_modifier":0},{"name":"Band","options":["Silicone","Metal","Leather"],"price_modifier":10}]'::jsonb, '{"available":true,"options":["Custom Watch Face","Engraving"],"min_quantity":25}'::jsonb, ARRAY['CE', 'FCC'], '{"Display":"1.4 inch AMOLED","Battery Life":"7 days","Water Resistance":"5ATM","Sensors":"Heart Rate, SpO2, Accelerometer"}'::jsonb),
  
  -- EcoHome Essentials products
  ((SELECT id FROM suppliers WHERE name = 'EcoHome Essentials'), 'Bamboo Kitchen Utensil Set', 'Eco-friendly kitchen utensils made from sustainable bamboo.', 12.50, 24.99, 20, '1 day', ARRAY['https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg?auto=compress&cs=tinysrgb&w=300'], 'Home & Garden', '[{"name":"Set Size","options":["5 Piece","8 Piece","12 Piece"],"price_modifier":5}]'::jsonb, '{"available":true,"options":["Custom Engraving","Gift Box"],"min_quantity":50}'::jsonb, ARRAY['FSC', 'Eco-Certified'], '{"Material":"100% Bamboo","Dishwasher Safe":"No","Length":"30cm"}'::jsonb),
  
  ((SELECT id FROM suppliers WHERE name = 'EcoHome Essentials'), 'Reusable Silicone Food Storage Bags', 'Leak-proof silicone food storage bags that replace single-use plastic.', 8.99, 16.99, 30, '1 day', ARRAY['https://images.pexels.com/photos/5765828/pexels-photo-5765828.jpeg?auto=compress&cs=tinysrgb&w=300'], 'Home & Garden', '[{"name":"Size","options":["Small","Medium","Large"],"price_modifier":2},{"name":"Color","options":["Clear","Blue","Green"],"price_modifier":0}]'::jsonb, '{"available":true,"options":["Custom Logo","Custom Colors"],"min_quantity":100}'::jsonb, ARRAY['FDA', 'BPA-Free'], '{"Material":"Food-Grade Silicone","Dishwasher Safe":"Yes","Microwave Safe":"Yes","Freezer Safe":"Yes"}'::jsonb),
  
  -- StyleHub Global products
  ((SELECT id FROM suppliers WHERE name = 'StyleHub Global'), 'Premium Leather Wallet', 'Handcrafted genuine leather wallet with multiple card slots.', 15.99, 39.99, 10, '2 days', ARRAY['https://images.pexels.com/photos/1682821/pexels-photo-1682821.jpeg?auto=compress&cs=tinysrgb&w=300'], 'Fashion', '[{"name":"Color","options":["Black","Brown","Tan"],"price_modifier":0},{"name":"Style","options":["Bifold","Trifold"],"price_modifier":3}]'::jsonb, '{"available":true,"options":["Monogram","Gift Box"],"min_quantity":20}'::jsonb, ARRAY['Leather Working Group'], '{"Material":"Genuine Leather","Card Slots":"8","Dimensions":"9.5cm x 11.5cm"}'::jsonb),
  
  ((SELECT id FROM suppliers WHERE name = 'StyleHub Global'), 'Designer Sunglasses', 'UV-protected stylish sunglasses with polarized lenses.', 12.99, 49.99, 12, '3 days', ARRAY['https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=300'], 'Fashion', '[{"name":"Frame Color","options":["Black","Tortoise","Gold"],"price_modifier":0},{"name":"Lens","options":["Polarized","Non-Polarized"],"price_modifier":5}]'::jsonb, '{"available":true,"options":["Custom Logo on Temple","Custom Case"],"min_quantity":50}'::jsonb, ARRAY['UV400', 'ISO'], '{"Frame Material":"Acetate","Lens":"Polarized","UV Protection":"100%"}'::jsonb),
  
  -- FitLife Gear products
  ((SELECT id FROM suppliers WHERE name = 'FitLife Gear'), 'Resistance Bands Set', 'Set of 5 resistance bands with different strength levels for home workouts.', 9.99, 24.99, 20, '1 day', ARRAY['https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=300'], 'Sports & Outdoors', '[{"name":"Set","options":["Basic (3 bands)","Standard (5 bands)","Pro (7 bands)"],"price_modifier":5}]'::jsonb, '{"available":true,"options":["Custom Packaging","Branded Carry Bag"],"min_quantity":50}'::jsonb, ARRAY['SGS'], '{"Material":"Natural Latex","Resistance Levels":"10-150lbs","Pieces":"5"}'::jsonb),
  
  ((SELECT id FROM suppliers WHERE name = 'FitLife Gear'), 'Yoga Mat', 'Non-slip, eco-friendly yoga mat with alignment lines.', 14.99, 34.99, 15, '2 days', ARRAY['https://images.pexels.com/photos/4498151/pexels-photo-4498151.jpeg?auto=compress&cs=tinysrgb&w=300'], 'Sports & Outdoors', '[{"name":"Thickness","options":["4mm","6mm","8mm"],"price_modifier":3},{"name":"Color","options":["Blue","Purple","Black","Green"],"price_modifier":0}]'::jsonb, '{"available":true,"options":["Custom Logo","Custom Color"],"min_quantity":30}'::jsonb, ARRAY['Eco-Friendly', 'SGS'], '{"Material":"TPE","Thickness":"6mm","Size":"183cm x 61cm","Non-Slip":"Yes"}'::jsonb),
  
  -- BeautyWorld Cosmetics products
  ((SELECT id FROM suppliers WHERE name = 'BeautyWorld Cosmetics'), 'Organic Skincare Set', 'Complete skincare routine with natural and organic ingredients.', 24.99, 69.99, 10, '2 days', ARRAY['https://images.pexels.com/photos/2536965/pexels-photo-2536965.jpeg?auto=compress&cs=tinysrgb&w=300'], 'Beauty & Personal Care', '[{"name":"Skin Type","options":["Normal","Dry","Oily","Combination"],"price_modifier":0}]'::jsonb, '{"available":true,"options":["Private Label","Custom Packaging"],"min_quantity":50}'::jsonb, ARRAY['Organic Certified', 'Cruelty-Free', 'Vegan'], '{"Ingredients":"Organic","Volume":"50ml x 4 products","Shelf Life":"12 months"}'::jsonb),
  
  ((SELECT id FROM suppliers WHERE name = 'BeautyWorld Cosmetics'), 'Professional Makeup Brush Set', '15-piece makeup brush set with synthetic bristles and wooden handles.', 18.99, 45.99, 15, '1 day', ARRAY['https://images.pexels.com/photos/2688992/pexels-photo-2688992.jpeg?auto=compress&cs=tinysrgb&w=300'], 'Beauty & Personal Care', '[{"name":"Set Size","options":["8 Piece","15 Piece","24 Piece"],"price_modifier":10}]'::jsonb, '{"available":true,"options":["Custom Logo on Handle","Custom Case"],"min_quantity":30}'::jsonb, ARRAY['Cruelty-Free'], '{"Bristles":"Synthetic","Handle":"Wooden","Pieces":"15"}'::jsonb);

-- Update products count for each supplier
UPDATE suppliers
SET products_count = (
  SELECT COUNT(*) 
  FROM supplier_products 
  WHERE supplier_products.supplier_id = suppliers.id
);