-- Insert a demo supplier if it doesn't exist
INSERT INTO public.suppliers (
  name, 
  email, 
  website, 
  verified, 
  rating, 
  country, 
  description, 
  logo, 
  categories, 
  products_count, 
  processing_time, 
  shipping_time, 
  minimum_order, 
  performance
)
SELECT 
  'Demo Supplier', 
  'demo@supplier.com', 
  'https://demo-supplier.com', 
  true, 
  4.8, 
  'FR', 
  'This is a demonstration supplier for testing purposes', 
  'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg', 
  ARRAY['Electronics', 'Accessories'], 
  100, 
  '1-3 days', 
  '3-7 days', 
  50, 
  '{"response_rate": 95, "response_time": "2h", "quality_rating": 92, "on_time_delivery": 96}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM public.suppliers WHERE name = 'Demo Supplier'
);

-- Insert a demo product linked to the demo supplier
INSERT INTO public.supplier_products (
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
  certifications,
  specifications,
  base_price,
  retail_price,
  inventory_count
)
SELECT 
  s.id,
  'Demo Product',
  'This is a demonstration product for testing purposes',
  29.99,
  39.99,
  1,
  '2 days',
  ARRAY['https://images.pexels.com/photos/1037992/pexels-photo-1037992.jpeg'],
  'Electronics',
  '[{"name": "Standard", "price": 29.99, "moq": 1}, {"name": "Premium", "price": 39.99, "moq": 1}]'::jsonb,
  '{"available": true, "options": ["Color", "Size"], "min_quantity": 10}'::jsonb,
  ARRAY['CE', 'RoHS'],
  '{"weight": "250g", "dimensions": "10x5x2cm", "material": "Aluminum"}'::jsonb,
  24.99,
  34.99,
  500
FROM public.suppliers s
WHERE s.name = 'Demo Supplier'
AND NOT EXISTS (
  SELECT 1 FROM public.supplier_products WHERE name = 'Demo Product' AND supplier_id = s.id
);