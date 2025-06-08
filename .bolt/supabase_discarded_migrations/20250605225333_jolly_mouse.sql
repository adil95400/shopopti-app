/*
  # Add supplier logos to existing suppliers

  1. New Columns
    - Add logo_url column to suppliers table
  
  2. Updates
    - Update existing suppliers with logo URLs
*/

-- Add logo_url column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'suppliers' AND column_name = 'logo'
  ) THEN
    ALTER TABLE suppliers ADD COLUMN logo text;
  END IF;
END $$;

-- Update existing suppliers with logo URLs
UPDATE suppliers SET logo = 'https://i.ibb.co/Qj1bBfL/shopcom-logo.png' WHERE name = 'Shopcom Dropshipping' AND logo IS NULL;
UPDATE suppliers SET logo = 'https://i.ibb.co/Qj1bBfL/innocigs-logo.png' WHERE name = 'InnoCigs' AND logo IS NULL;
UPDATE suppliers SET logo = 'https://i.ibb.co/Qj1bBfL/syntrox-logo.png' WHERE name = 'Syntrox Germany' AND logo IS NULL;
UPDATE suppliers SET logo = 'https://i.ibb.co/Qj1bBfL/kaysser-logo.png' WHERE name = 'Kaysser' AND logo IS NULL;
UPDATE suppliers SET logo = 'https://i.ibb.co/Qj1bBfL/trends4cents-logo.png' WHERE name = 'Trends4Cents' AND logo IS NULL;
UPDATE suppliers SET logo = 'https://i.ibb.co/Qj1bBfL/vidaxl-logo.png' WHERE name = 'Vidaxl Dropshipping' AND logo IS NULL;
UPDATE suppliers SET logo = 'https://i.ibb.co/Qj1bBfL/bigbuy-logo.png' WHERE name = 'BigBuy' AND logo IS NULL;
UPDATE suppliers SET logo = 'https://i.ibb.co/Qj1bBfL/kosatec-logo.png' WHERE name = 'Kosatec Computer' AND logo IS NULL;
UPDATE suppliers SET logo = 'https://i.ibb.co/Qj1bBfL/atixc-logo.png' WHERE name = 'Atixc' AND logo IS NULL;
UPDATE suppliers SET logo = 'https://i.ibb.co/Qj1bBfL/ila-uhren-logo.png' WHERE name = 'ILA Uhren GmbH' AND logo IS NULL;
UPDATE suppliers SET logo = 'https://i.ibb.co/Qj1bBfL/matterhorn-logo.png' WHERE name = 'Matterhorn' AND logo IS NULL;
UPDATE suppliers SET logo = 'https://i.ibb.co/Qj1bBfL/miniheld-logo.png' WHERE name = 'MiniHeld' AND logo IS NULL;

-- Add more suppliers if they don't exist
INSERT INTO suppliers (name, country, category, delivery_delay, min_order, verified, rating, description, contact_email, website, logo)
SELECT 'Shop.it', 'IT', 'General', '2-4 days', 100, true, 4.7, 'Italian general merchandise supplier with a wide range of products.', 'info@shop.it', 'https://shop.it', 'https://i.ibb.co/Qj1bBfL/shop-it-logo.png'
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Shop.it');

INSERT INTO suppliers (name, country, category, delivery_delay, min_order, verified, rating, description, contact_email, website, logo)
SELECT 'Abaco International', 'IT', 'Fashion & Accessories', '2-3 days', 150, true, 4.6, 'Italian fashion and accessories supplier with high-quality products.', 'info@abaco.it', 'https://abaco.it', 'https://i.ibb.co/Qj1bBfL/abaco-logo.png'
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Abaco International');

INSERT INTO suppliers (name, country, category, delivery_delay, min_order, verified, rating, description, contact_email, website, logo)
SELECT 'Ariete', 'IT', 'Home Appliances', '1-3 days', 200, true, 4.8, 'Italian home appliances manufacturer with innovative products.', 'info@ariete.it', 'https://ariete.it', 'https://i.ibb.co/Qj1bBfL/ariete-logo.png'
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Ariete');

INSERT INTO suppliers (name, country, category, delivery_delay, min_order, verified, rating, description, contact_email, website, logo)
SELECT 'Griffati', 'IT', 'Fashion', '2-4 days', 120, true, 4.5, 'Italian fashion brand specializing in trendy clothing and accessories.', 'info@griffati.it', 'https://griffati.it', 'https://i.ibb.co/Qj1bBfL/griffati-logo.png'
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Griffati');

INSERT INTO suppliers (name, country, category, delivery_delay, min_order, verified, rating, description, contact_email, website, logo)
SELECT 'BestIT', 'IT', 'Electronics', '1-2 days', 100, true, 4.7, 'Italian electronics supplier with a focus on quality and innovation.', 'info@bestit.it', 'https://bestit.it', 'https://i.ibb.co/Qj1bBfL/bestit-logo.png'
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'BestIT');