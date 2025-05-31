-- ✅ MIGRATION COMPLÈTE SHOPOPTI+ | Généré le 2025-05-29 22:06:05 UTC

-- 🔒 Créer ou mettre à jour la table suppliers
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country TEXT,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 🔒 Ajouter une policy publique de lecture si manquante
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS public_read_suppliers ON suppliers;

CREATE POLICY public_read_suppliers
  ON suppliers
  FOR SELECT
  TO public
  USING (true);

-- ✅ Ajouter colonne category dans products
ALTER TABLE products ADD COLUMN IF NOT EXISTS category TEXT;

-- ✅ Ajouter colonne category dans supplier_products
ALTER TABLE supplier_products ADD COLUMN IF NOT EXISTS category TEXT;

-- ✅ Ajouter colonne image_urls dans supplier_products
ALTER TABLE supplier_products ADD COLUMN IF NOT EXISTS image_urls TEXT[];

-- ✅ Recréer une policy propre sur products
DROP POLICY IF EXISTS manage_own_products_20250510 ON products;

CREATE POLICY manage_own_products_20250510
  ON products
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- ✅ Ajouter colonne region dans marketplaces
ALTER TABLE marketplaces ADD COLUMN IF NOT EXISTS region TEXT;

-- ✅ Exemple d'insertion marketplace
INSERT INTO marketplaces (name, region, country, description, fees_percent, monthly_fee, currency)
VALUES
('Rakuten', 'Asia', 'JP', 'Deuxième plus grande marketplace au Japon avec plus de 50 millions d''utilisateurs.', 10.0, 0, 'JPY')
ON CONFLICT DO NOTHING;

-- ✅ Ajout de sample supplier
INSERT INTO suppliers (name, country, type)
VALUES
('StyleHub Global', 'US', 'fashion'),
('EcoGadget Dropship', 'DE', 'electronics')
ON CONFLICT DO NOTHING;

-- ✅ Ajout de produits suppliers
INSERT INTO supplier_products (name, description, price, image_urls, category)
VALUES
('T-shirt Bio', 'T-shirt coton bio haut de gamme', 19.99, ARRAY['https://example.com/tshirt.jpg'], 'Apparel'),
('Chargeur Solaire', 'Chargeur solaire portable waterproof', 29.99, ARRAY['https://example.com/solar.jpg'], 'Electronics')
ON CONFLICT DO NOTHING;
