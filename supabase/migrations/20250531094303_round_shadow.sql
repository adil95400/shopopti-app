-- Create B2B suppliers table
CREATE TABLE IF NOT EXISTS b2b_suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country text NOT NULL,
  category text NOT NULL,
  delivery_delay text NOT NULL,
  min_order integer NOT NULL DEFAULT 100,
  verified boolean NOT NULL DEFAULT false,
  rating numeric NOT NULL DEFAULT 0,
  description text,
  contact_email text,
  website text,
  logo_url text,
  created_at timestamptz DEFAULT now()
);

-- Create B2B products table
CREATE TABLE IF NOT EXISTS b2b_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid REFERENCES b2b_suppliers(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  min_quantity integer NOT NULL DEFAULT 1,
  discount_tiers jsonb DEFAULT '[]'::jsonb,
  stock integer NOT NULL DEFAULT 0,
  images text[],
  category text,
  specifications jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create B2B quote requests table
CREATE TABLE IF NOT EXISTS b2b_quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid REFERENCES b2b_suppliers(id) ON DELETE CASCADE,
  product_ids uuid[],
  quantity integer NOT NULL,
  message text,
  contact_email text NOT NULL,
  contact_name text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE b2b_suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_quote_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access to b2b suppliers"
  ON b2b_suppliers
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public read access to b2b products"
  ON b2b_products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public insert access to b2b quote requests"
  ON b2b_quote_requests
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_b2b_suppliers_country ON b2b_suppliers(country);
CREATE INDEX IF NOT EXISTS idx_b2b_suppliers_category ON b2b_suppliers(category);
CREATE INDEX IF NOT EXISTS idx_b2b_suppliers_verified ON b2b_suppliers(verified);
CREATE INDEX IF NOT EXISTS idx_b2b_products_supplier ON b2b_products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_b2b_products_category ON b2b_products(category);

-- Insert sample data
INSERT INTO b2b_suppliers (
  name, country, category, delivery_delay, min_order, verified, rating,
  description, contact_email, website, logo_url
) VALUES
-- Fashion & Apparel
('FashionWholesale', 'France', 'Mode', '10-15 jours', 500, true, 4.8,
'Grossiste de vêtements et accessoires de mode avec une large gamme de produits tendance.', 
'contact@fashionwholesale.com', 'https://fashionwholesale.com', 
'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=300'),

-- Electronics
('TechDistribution', 'Allemagne', 'Électronique', '7-10 jours', 1000, true, 4.7,
'Distributeur d''électronique grand public et de gadgets innovants.', 
'sales@techdistribution.de', 'https://techdistribution.de', 
'https://images.pexels.com/photos/1841841/pexels-photo-1841841.jpeg?auto=compress&cs=tinysrgb&w=300'),

-- Home & Garden
('MaisonDeco', 'Italie', 'Maison & Jardin', '14-21 jours', 300, false, 4.5,
'Articles de décoration d''intérieur et d''extérieur fabriqués en Italie.', 
'info@maisondeco.it', 'https://maisondeco.it', 
'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=300'),

-- Beauty & Cosmetics
('BeautySource', 'France', 'Beauté', '5-7 jours', 200, true, 4.9,
'Produits de beauté et cosmétiques de marques françaises renommées.', 
'wholesale@beautysource.fr', 'https://beautysource.fr', 
'https://images.pexels.com/photos/2253834/pexels-photo-2253834.jpeg?auto=compress&cs=tinysrgb&w=300'),

-- Food & Beverages
('GourmetWholesale', 'Espagne', 'Alimentation', '3-5 jours', 400, true, 4.6,
'Spécialités alimentaires espagnoles et méditerranéennes pour professionnels.', 
'orders@gourmetwholesale.es', 'https://gourmetwholesale.es', 
'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=300'),

-- Sports & Outdoors
('SportEquip', 'Royaume-Uni', 'Sport', '7-12 jours', 600, false, 4.3,
'Équipements sportifs et de plein air pour professionnels et revendeurs.', 
'business@sportequip.co.uk', 'https://sportequip.co.uk', 
'https://images.pexels.com/photos/3775566/pexels-photo-3775566.jpeg?auto=compress&cs=tinysrgb&w=300'),

-- Toys & Games
('ToyWorld', 'Allemagne', 'Jouets', '8-14 jours', 350, true, 4.7,
'Jouets éducatifs et jeux de société pour tous les âges.', 
'wholesale@toyworld.de', 'https://toyworld.de', 
'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=300'),

-- Jewelry
('LuxBijoux', 'Italie', 'Bijouterie', '10-15 jours', 800, true, 4.8,
'Bijoux de luxe et accessoires haut de gamme fabriqués en Italie.', 
'pro@luxbijoux.it', 'https://luxbijoux.it', 
'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=300');

-- Insert sample products (would be expanded in a real implementation)
INSERT INTO b2b_products (
  supplier_id, name, description, price, min_quantity, discount_tiers,
  stock, images, category, specifications
)
SELECT
  s.id,
  'Produit Exemple ' || generate_series(1, 5),
  'Description détaillée du produit avec spécifications et caractéristiques.',
  random() * 100 + 20,
  floor(random() * 50 + 10)::int,
  '[{"quantity": 100, "discount_percent": 5}, {"quantity": 500, "discount_percent": 10}, {"quantity": 1000, "discount_percent": 15}]'::jsonb,
  floor(random() * 1000 + 100)::int,
  ARRAY['https://images.pexels.com/photos/1037992/pexels-photo-1037992.jpeg'],
  s.category,
  '{"Matériau": "Premium", "Origine": "Europe", "Certification": "ISO 9001"}'::jsonb
FROM b2b_suppliers s;