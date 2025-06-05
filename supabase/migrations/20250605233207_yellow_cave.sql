-- Add logo column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'suppliers' AND column_name = 'logo'
  ) THEN
    ALTER TABLE suppliers ADD COLUMN logo text;
  END IF;
END $$;

-- Add categories column if it doesn't exist (using array type for categories)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'suppliers' AND column_name = 'categories'
  ) THEN
    ALTER TABLE suppliers ADD COLUMN categories text[];
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
INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'Shop.it', 'IT', 'https://i.ibb.co/Qj1bBfL/shop-it-logo.png', true, 4.7, 'Italian general merchandise supplier with a wide range of products.', 'https://shop.it', ARRAY['General']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Shop.it');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'Abaco International', 'IT', 'https://i.ibb.co/Qj1bBfL/abaco-logo.png', true, 4.6, 'Italian fashion and accessories supplier with high-quality products.', 'https://abaco.it', ARRAY['Fashion', 'Accessories']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Abaco International');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'Ariete', 'IT', 'https://i.ibb.co/Qj1bBfL/ariete-logo.png', true, 4.8, 'Italian home appliances manufacturer with innovative products.', 'https://ariete.it', ARRAY['Home Appliances']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Ariete');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'Griffati', 'IT', 'https://i.ibb.co/Qj1bBfL/griffati-logo.png', true, 4.5, 'Italian fashion brand specializing in trendy clothing and accessories.', 'https://griffati.it', ARRAY['Fashion']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Griffati');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'BestIT', 'IT', 'https://i.ibb.co/Qj1bBfL/bestit-logo.png', true, 4.7, 'Italian electronics supplier with a focus on quality and innovation.', 'https://bestit.it', ARRAY['Electronics']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'BestIT');