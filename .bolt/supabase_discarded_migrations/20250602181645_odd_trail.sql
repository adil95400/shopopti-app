/*
  # Ajout de politiques de lecture publique

  1. Sécurité
    - Ajoute une politique de lecture publique pour la table suppliers
    - Ajoute une politique de lecture publique pour la table supplier_products
*/

-- ✅ Politique publique de lecture pour suppliers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Public read access to suppliers'
  ) THEN
    CREATE POLICY "Public read access to suppliers"
    ON public.suppliers
    FOR SELECT
    TO public
    USING (true);
  END IF;
END $$;

-- ✅ Politique publique de lecture pour supplier_products
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Public read access to supplier products'
  ) THEN
    CREATE POLICY "Public read access to supplier products"
    ON public.supplier_products
    FOR SELECT
    TO public
    USING (true);
  END IF;
END $$;