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

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'Brands Distribution', 'IT', 'https://i.ibb.co/Qj1bBfL/brands-distribution-logo.png', true, 4.6, 'Italian fashion and accessories distributor with premium brands.', 'https://brandsdistribution.com', ARRAY['Fashion', 'Accessories']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Brands Distribution');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'Brevi', 'IT', 'https://i.ibb.co/Qj1bBfL/brevi-logo.png', true, 4.5, 'Italian supplier specializing in baby products and accessories.', 'https://brevi.it', ARRAY['Baby & Kids']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Brevi');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'CaseKing', 'DE', 'https://i.ibb.co/Qj1bBfL/caseking-logo.png', true, 4.8, 'German computer hardware and gaming accessories supplier.', 'https://caseking.de', ARRAY['Electronics', 'Gaming']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'CaseKing');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'C&C', 'IT', 'https://i.ibb.co/Qj1bBfL/cc-logo.png', true, 4.4, 'Italian supplier of various consumer goods and electronics.', 'https://cc-srl.it', ARRAY['Electronics', 'General']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'C&C');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'Cometa', 'IT', 'https://i.ibb.co/Qj1bBfL/cometa-logo.png', true, 4.6, 'Italian IT equipment and office supplies distributor.', 'https://cometa.it', ARRAY['Electronics', 'Office Supplies']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Cometa');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'Computer Universe', 'DE', 'https://i.ibb.co/Qj1bBfL/computer-universe-logo.png', true, 4.7, 'German electronics and computer hardware retailer.', 'https://computeruniverse.net', ARRAY['Electronics', 'Computers']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Computer Universe');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'Conrad', 'DE', 'https://i.ibb.co/Qj1bBfL/conrad-logo.png', true, 4.8, 'German electronics and technology supplier with extensive catalog.', 'https://conrad.de', ARRAY['Electronics', 'Technology']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Conrad');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'Daicom', 'IT', 'https://i.ibb.co/Qj1bBfL/daicom-logo.png', true, 4.5, 'Italian electronics and technology supplier.', 'https://daicom.it', ARRAY['Electronics']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Daicom');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'DealerPoint', 'IT', 'https://i.ibb.co/Qj1bBfL/dealerpoint-logo.png', true, 4.4, 'Italian office supplies and electronics distributor.', 'https://dealerpoint.it', ARRAY['Office Supplies', 'Electronics']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'DealerPoint');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'Difox', 'DE', 'https://i.ibb.co/Qj1bBfL/difox-logo.png', true, 4.6, 'German photography and electronics supplier.', 'https://difox.com', ARRAY['Electronics', 'Photography']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Difox');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'DND Distribution', 'IT', 'https://i.ibb.co/Qj1bBfL/dnd-logo.png', true, 4.5, 'Italian general merchandise distributor.', 'https://dnddistribution.it', ARRAY['General']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'DND Distribution');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'Drako', 'IT', 'https://i.ibb.co/Qj1bBfL/drako-logo.png', true, 4.3, 'Italian pet supplies and accessories distributor.', 'https://drako.it', ARRAY['Pet Supplies']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Drako');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'EDS Group', 'IT', 'https://i.ibb.co/Qj1bBfL/eds-group-logo.png', true, 4.5, 'Italian electronics and technology distributor.', 'https://edsgroup.it', ARRAY['Electronics', 'Technology']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'EDS Group');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'Effezeta', 'IT', 'https://i.ibb.co/Qj1bBfL/effezeta-logo.png', true, 4.4, 'Italian home furnishings and decor supplier.', 'https://effezeta.it', ARRAY['Home & Garden']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Effezeta');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'Erregame', 'IT', 'https://i.ibb.co/Qj1bBfL/erregame-logo.png', true, 4.7, 'Italian gaming and entertainment products supplier.', 'https://erregame.it', ARRAY['Gaming', 'Entertainment']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Erregame');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'Esprinet', 'IT', 'https://i.ibb.co/Qj1bBfL/esprinet-logo.png', true, 4.8, 'Italian IT and consumer electronics distributor.', 'https://esprinet.com', ARRAY['Electronics', 'Computers']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Esprinet');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'Esselte', 'IT', 'https://i.ibb.co/Qj1bBfL/esselte-logo.png', true, 4.5, 'Italian office supplies and stationery supplier.', 'https://esselte.com', ARRAY['Office Supplies']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Esselte');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'Focelda', 'IT', 'https://i.ibb.co/Qj1bBfL/focelda-logo.png', true, 4.6, 'Italian electronics and technology distributor.', 'https://focelda.it', ARRAY['Electronics', 'Technology']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Focelda');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'Intracom', 'IT', 'https://i.ibb.co/Qj1bBfL/intracom-logo.png', true, 4.5, 'Italian telecommunications and networking equipment supplier.', 'https://intracom.it', ARRAY['Telecommunications', 'Electronics']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Intracom');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'Il Triangolo', 'IT', 'https://i.ibb.co/Qj1bBfL/il-triangolo-logo.png', true, 4.4, 'Italian IT and electronics distributor.', 'https://iltriangolo.it', ARRAY['Electronics', 'Computers']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Il Triangolo');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'Ingram Micro', 'IT', 'https://i.ibb.co/Qj1bBfL/ingram-logo.png', true, 4.9, 'Global technology distributor with extensive product catalog.', 'https://ingrammicro.com', ARRAY['Electronics', 'Technology', 'Software']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Ingram Micro');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'LambdaTek', 'UK', 'https://i.ibb.co/Qj1bBfL/lambdatek-logo.png', true, 4.7, 'UK-based computer hardware and components supplier.', 'https://lambdatek.com', ARRAY['Computers', 'Electronics']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'LambdaTek');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'Ledlux', 'IT', 'https://i.ibb.co/Qj1bBfL/ledlux-logo.png', true, 4.6, 'Italian LED lighting and electrical supplies distributor.', 'https://ledlux.it', ARRAY['Lighting', 'Electrical']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Ledlux');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'Lindy', 'DE', 'https://i.ibb.co/Qj1bBfL/lindy-logo.png', true, 4.7, 'German computer and AV accessories manufacturer.', 'https://lindy.com', ARRAY['Electronics', 'Accessories']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Lindy');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'McDigi', 'IT', 'https://i.ibb.co/Qj1bBfL/mcdigi-logo.png', true, 4.5, 'Italian digital products and electronics supplier.', 'https://mcdigi.it', ARRAY['Electronics', 'Digital Products']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'McDigi');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'Mecshopping', 'IT', 'https://i.ibb.co/Qj1bBfL/mecshopping-logo.png', true, 4.6, 'Italian electronics and computer hardware retailer.', 'https://mecshopping.it', ARRAY['Electronics', 'Computers']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Mecshopping');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'Next', 'IT', 'https://i.ibb.co/Qj1bBfL/next-logo.png', true, 4.5, 'Italian IT and electronics distributor.', 'https://nextits.it', ARRAY['Electronics', 'IT']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Next');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'PowerTech', 'IT', 'https://i.ibb.co/Qj1bBfL/powertech-logo.png', true, 4.7, 'Italian power supplies and electrical components distributor.', 'https://powertech.it', ARRAY['Electronics', 'Electrical']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'PowerTech');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'Prezzo Bomba', 'IT', 'https://i.ibb.co/Qj1bBfL/prezzo-bomba-logo.png', true, 4.4, 'Italian discount electronics and general merchandise supplier.', 'https://prezzobomba.it', ARRAY['Electronics', 'General']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Prezzo Bomba');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'Runner', 'IT', 'https://i.ibb.co/Qj1bBfL/runner-logo.png', true, 4.5, 'Italian sports equipment and apparel supplier.', 'https://runner.it', ARRAY['Sports & Outdoors']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Runner');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'SG', 'IT', 'https://i.ibb.co/Qj1bBfL/sg-logo.png', true, 4.6, 'Italian general merchandise distributor.', 'https://sg-spa.it', ARRAY['General']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'SG');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'SoloTempo', 'IT', 'https://i.ibb.co/Qj1bBfL/solotempo-logo.png', true, 4.7, 'Italian watches and accessories supplier.', 'https://solotempo.it', ARRAY['Watches', 'Accessories']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'SoloTempo');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'Supplies24', 'DE', 'https://i.ibb.co/Qj1bBfL/supplies24-logo.png', true, 4.6, 'German office supplies and stationery distributor.', 'https://supplies24.de', ARRAY['Office Supplies']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Supplies24');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'TelePart', 'DE', 'https://i.ibb.co/Qj1bBfL/telepart-logo.png', true, 4.7, 'German telecommunications and mobile accessories supplier.', 'https://telepart.com', ARRAY['Telecommunications', 'Accessories']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'TelePart');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'Terminal', 'IT', 'https://i.ibb.co/Qj1bBfL/terminal-logo.png', true, 4.5, 'Italian IT and electronics distributor.', 'https://terminal.it', ARRAY['Electronics', 'IT']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Terminal');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'Trexon', 'DE', 'https://i.ibb.co/Qj1bBfL/trexon-logo.png', true, 4.6, 'German electronics and technology supplier.', 'https://trexon.de', ARRAY['Electronics', 'Technology']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Trexon');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'Vidaxl', 'NL', 'https://i.ibb.co/Qj1bBfL/vidaxl-logo.png', true, 4.8, 'Dutch general merchandise supplier with extensive product catalog.', 'https://vidaxl.com', ARRAY['General', 'Home & Garden']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Vidaxl');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'Wavedistro', 'IT', 'https://i.ibb.co/Qj1bBfL/wavedistro-logo.png', true, 4.5, 'Italian audio equipment and electronics distributor.', 'https://wavedistro.it', ARRAY['Electronics', 'Audio']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'Wavedistro');

INSERT INTO suppliers (name, country, logo, verified, rating, description, website, categories)
SELECT 'WWT', 'IT', 'https://i.ibb.co/Qj1bBfL/wwt-logo.png', true, 4.6, 'Italian IT and electronics wholesaler.', 'https://wwt.it', ARRAY['Electronics', 'IT']
WHERE NOT EXISTS (SELECT 1 FROM suppliers WHERE name = 'WWT');