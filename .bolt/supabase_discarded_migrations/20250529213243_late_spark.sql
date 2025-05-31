-- Création des tables de fournisseurs et produits avec RLS

-- Table des fournisseurs
CREATE TABLE IF NOT EXISTS public.suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    category TEXT NOT NULL,
    verified BOOLEAN DEFAULT false,
    rating NUMERIC DEFAULT 0,
    processing_time TEXT,
    shipping_time TEXT,
    minimum_order INTEGER DEFAULT 0,
    logo_url TEXT,
    description TEXT,
    website TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    performance JSONB DEFAULT '{"on_time_delivery": 0, "quality_rating": 0, "response_rate": 0, "response_time": "0h"}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des produits fournisseurs
CREATE TABLE IF NOT EXISTS public.supplier_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID REFERENCES public.suppliers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    base_price NUMERIC NOT NULL,
    retail_price NUMERIC,
    inventory_count INTEGER DEFAULT 0,
    moq INTEGER DEFAULT 1,
    processing_time INTEGER,
    shipping_time INTEGER,
    origin_country TEXT,
    images TEXT[],
    category TEXT,
    variants JSONB DEFAULT '[]',
    customization JSONB,
    certifications TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Création des index
CREATE INDEX idx_suppliers_category ON public.suppliers(category);
CREATE INDEX idx_suppliers_country ON public.suppliers(country);
CREATE INDEX idx_suppliers_verified ON public.suppliers(verified);
CREATE INDEX idx_suppliers_rating ON public.suppliers(rating);

CREATE INDEX idx_supplier_products_supplier ON public.supplier_products(supplier_id);
CREATE INDEX idx_supplier_products_category ON public.supplier_products(category);

-- Activer RLS sur les tables
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_products ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les fournisseurs
CREATE POLICY "Public read access to suppliers" 
ON public.suppliers FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Users can manage own suppliers" 
ON public.suppliers FOR ALL 
TO authenticated 
USING (uid() = user_id)
WITH CHECK (uid() = user_id);

-- Politiques RLS pour les produits fournisseurs
CREATE POLICY "Public read access to supplier products" 
ON public.supplier_products FOR SELECT 
TO public 
USING (true);

-- Trigger pour mettre à jour le timestamp updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_suppliers_updated_at
BEFORE UPDATE ON public.suppliers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_supplier_products_updated_at
BEFORE UPDATE ON public.supplier_products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insérer des données d'exemple pour les fournisseurs
INSERT INTO public.suppliers (name, country, category, verified, rating, processing_time, shipping_time, minimum_order, description, performance)
VALUES
('TechPro Supply', 'US', 'Electronics', true, 4.8, '1-3 days', '3-7 days', 50, 'Premier supplier of consumer electronics and accessories with fast shipping across North America.', '{"on_time_delivery": 98, "quality_rating": 96, "response_rate": 99, "response_time": "2h"}'),
('EcoHome Essentials', 'UK', 'Home & Garden', true, 4.7, '1-2 days', '2-5 days', 30, 'Sustainable home goods and eco-friendly products for the conscious consumer.', '{"on_time_delivery": 97, "quality_rating": 98, "response_rate": 95, "response_time": "3h"}'),
('StyleHub Global', 'IT', 'Fashion', true, 4.6, '2-3 days', '4-8 days', 100, 'Trendy fashion items from Italian designers with worldwide shipping.', '{"on_time_delivery": 94, "quality_rating": 97, "response_rate": 92, "response_time": "4h"}'),
('FitLife Gear', 'AU', 'Sports & Outdoors', true, 4.9, '1-2 days', '5-10 days', 75, 'Premium fitness equipment and outdoor gear from Australia.', '{"on_time_delivery": 99, "quality_rating": 99, "response_rate": 98, "response_time": "1h"}'),
('BeautyWorld Cosmetics', 'FR', 'Beauty & Personal Care', true, 4.7, '1-3 days', '3-7 days', 60, 'Luxury beauty products and cosmetics from France.', '{"on_time_delivery": 96, "quality_rating": 98, "response_rate": 94, "response_time": "3h"}');

-- Insérer des produits d'exemple pour chaque fournisseur
DO $$
DECLARE
    supplier_id_1 UUID;
    supplier_id_2 UUID;
    supplier_id_3 UUID;
    supplier_id_4 UUID;
    supplier_id_5 UUID;
BEGIN
    SELECT id INTO supplier_id_1 FROM public.suppliers WHERE name = 'TechPro Supply' LIMIT 1;
    SELECT id INTO supplier_id_2 FROM public.suppliers WHERE name = 'EcoHome Essentials' LIMIT 1;
    SELECT id INTO supplier_id_3 FROM public.suppliers WHERE name = 'StyleHub Global' LIMIT 1;
    SELECT id INTO supplier_id_4 FROM public.suppliers WHERE name = 'FitLife Gear' LIMIT 1;
    SELECT id INTO supplier_id_5 FROM public.suppliers WHERE name = 'BeautyWorld Cosmetics' LIMIT 1;
    
    -- Produits pour TechPro Supply
    INSERT INTO public.supplier_products (supplier_id, name, description, base_price, retail_price, inventory_count, moq, category, images)
    VALUES
    (supplier_id_1, 'Wireless Earbuds Pro', 'High-quality wireless earbuds with noise cancellation and 24h battery life.', 25.99, 59.99, 500, 10, 'Electronics', ARRAY['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300']),
    (supplier_id_1, 'Smart Watch X1', 'Fitness tracker with heart rate monitor, sleep tracking and notifications.', 35.50, 89.99, 300, 5, 'Electronics', ARRAY['https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300']),
    (supplier_id_1, 'Bluetooth Speaker', 'Portable waterproof speaker with 20h battery life and deep bass.', 18.75, 45.99, 400, 10, 'Electronics', ARRAY['https://images.pexels.com/photos/1706694/pexels-photo-1706694.jpeg?auto=compress&cs=tinysrgb&w=300']);
    
    -- Produits pour EcoHome Essentials
    INSERT INTO public.supplier_products (supplier_id, name, description, base_price, retail_price, inventory_count, moq, category, images)
    VALUES
    (supplier_id_2, 'Bamboo Cutlery Set', 'Eco-friendly bamboo cutlery set with carrying case.', 4.50, 12.99, 1000, 20, 'Home & Garden', ARRAY['https://images.pexels.com/photos/5824883/pexels-photo-5824883.jpeg?auto=compress&cs=tinysrgb&w=300']),
    (supplier_id_2, 'Organic Cotton Bedding', 'Soft organic cotton bedding set, chemical-free and sustainable.', 28.75, 79.99, 200, 5, 'Home & Garden', ARRAY['https://images.pexels.com/photos/1034584/pexels-photo-1034584.jpeg?auto=compress&cs=tinysrgb&w=300']);
    
    -- Produits pour StyleHub Global
    INSERT INTO public.supplier_products (supplier_id, name, description, base_price, retail_price, inventory_count, moq, category, images)
    VALUES
    (supplier_id_3, 'Designer Sunglasses', 'Trendy Italian designer sunglasses with UV protection.', 15.25, 45.99, 300, 10, 'Fashion', ARRAY['https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=300']),
    (supplier_id_3, 'Leather Crossbody Bag', 'Handcrafted genuine leather crossbody bag with adjustable strap.', 29.99, 89.99, 150, 5, 'Fashion', ARRAY['https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=300']);
    
    -- Produits pour FitLife Gear
    INSERT INTO public.supplier_products (supplier_id, name, description, base_price, retail_price, inventory_count, moq, category, images)
    VALUES
    (supplier_id_4, 'Resistance Bands Set', 'Complete set of 5 resistance bands with different strengths.', 6.50, 19.99, 500, 20, 'Sports & Outdoors', ARRAY['https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=300']),
    (supplier_id_4, 'Yoga Mat Pro', 'Non-slip eco-friendly yoga mat with alignment lines.', 12.75, 34.99, 400, 10, 'Sports & Outdoors', ARRAY['https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=300']);
    
    -- Produits pour BeautyWorld Cosmetics
    INSERT INTO public.supplier_products (supplier_id, name, description, base_price, retail_price, inventory_count, moq, category, images)
    VALUES
    (supplier_id_5, 'Organic Face Serum', 'Anti-aging face serum with organic ingredients and vitamin C.', 9.99, 29.99, 300, 10, 'Beauty & Personal Care', ARRAY['https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=300']),
    (supplier_id_5, 'Luxury Makeup Brush Set', 'Professional 12-piece makeup brush set with vegan bristles.', 14.50, 39.99, 250, 5, 'Beauty & Personal Care', ARRAY['https://images.pexels.com/photos/2536965/pexels-photo-2536965.jpeg?auto=compress&cs=tinysrgb&w=300']);
END $$;