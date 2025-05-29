-- ✅ MIGRATION COMPLÈTE SHOPOPTI+ | Correction des erreurs

-- ✅ Vérifier si la table suppliers existe déjà
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'suppliers') THEN
        -- Créer la table suppliers si elle n'existe pas
        CREATE TABLE public.suppliers (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            country TEXT,
            type TEXT DEFAULT 'generic',
            url TEXT,
            api_key TEXT,
            credentials JSONB,
            status TEXT DEFAULT 'active',
            settings JSONB DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            verified BOOLEAN DEFAULT false,
            rating NUMERIC DEFAULT 0,
            description TEXT,
            logo TEXT,
            categories TEXT[],
            products_count INTEGER DEFAULT 0,
            processing_time TEXT,
            shipping_time TEXT,
            minimum_order INTEGER DEFAULT 0,
            performance JSONB DEFAULT '{"response_rate": 0, "response_time": "0h", "quality_rating": 0, "on_time_delivery": 0}'
        );

        -- Activer RLS sur la table suppliers
        ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

        -- Créer les index pour suppliers
        CREATE INDEX IF NOT EXISTS idx_suppliers_categories ON public.suppliers USING gin (categories);
        CREATE INDEX IF NOT EXISTS idx_suppliers_country ON public.suppliers USING btree (country);
        CREATE INDEX IF NOT EXISTS idx_suppliers_verified ON public.suppliers USING btree (verified);
        CREATE INDEX IF NOT EXISTS idx_suppliers_rating ON public.suppliers USING btree (rating);
    END IF;
END
$$;

-- ✅ Vérifier si la table supplier_products existe déjà
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'supplier_products') THEN
        -- Créer la table supplier_products si elle n'existe pas
        CREATE TABLE public.supplier_products (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            supplier_id UUID REFERENCES public.suppliers(id) ON DELETE CASCADE,
            user_id UUID REFERENCES auth.users(id),
            name TEXT NOT NULL,
            description TEXT,
            base_price NUMERIC,
            retail_price NUMERIC,
            inventory_count INTEGER DEFAULT 0,
            moq INTEGER DEFAULT 1,
            processing_time TEXT,
            shipping_time TEXT,
            origin_country TEXT,
            images TEXT[],
            category TEXT,
            variants JSONB DEFAULT '[]',
            customization JSONB,
            certifications TEXT[],
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            image_urls TEXT[]
        );

        -- Activer RLS sur la table supplier_products
        ALTER TABLE public.supplier_products ENABLE ROW LEVEL SECURITY;

        -- Créer les index pour supplier_products
        CREATE INDEX IF NOT EXISTS idx_supplier_products_supplier ON public.supplier_products USING btree (supplier_id);
        CREATE INDEX IF NOT EXISTS idx_supplier_products_category ON public.supplier_products USING btree (category);
    ELSE
        -- Si la table existe déjà, ajouter les colonnes manquantes
        ALTER TABLE public.supplier_products ADD COLUMN IF NOT EXISTS category TEXT;
        ALTER TABLE public.supplier_products ADD COLUMN IF NOT EXISTS image_urls TEXT[];
    END IF;
END
$$;

-- ✅ Vérifier si la table marketplaces existe déjà
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'marketplaces') THEN
        -- Créer la table marketplaces si elle n'existe pas
        CREATE TABLE public.marketplaces (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            country TEXT NOT NULL,
            logo TEXT,
            status TEXT DEFAULT 'inactive',
            commission NUMERIC(5,2) DEFAULT 0,
            requirements JSONB DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            region TEXT
        );

        -- Activer RLS sur la table marketplaces
        ALTER TABLE public.marketplaces ENABLE ROW LEVEL SECURITY;
    ELSE
        -- Si la table existe déjà, ajouter la colonne manquante
        ALTER TABLE public.marketplaces ADD COLUMN IF NOT EXISTS region TEXT;
    END IF;
END
$$;

-- ✅ Vérifier si la table products existe déjà
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'products') THEN
        -- Si la table existe, ajouter la colonne category si elle n'existe pas
        ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category TEXT;
        
        -- Recréer la policy pour products
        DROP POLICY IF EXISTS manage_own_products_20250510 ON public.products;
        
        CREATE POLICY manage_own_products_20250510
            ON public.products
            FOR ALL
            TO authenticated
            USING (user_id = auth.uid());
    END IF;
END
$$;

-- ✅ Créer ou remplacer la fonction pour mettre à jour le timestamp updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ✅ Créer les triggers pour mettre à jour le timestamp updated_at si nécessaire
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_suppliers_updated_at') THEN
        CREATE TRIGGER update_suppliers_updated_at
        BEFORE UPDATE ON public.suppliers
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_supplier_products_updated_at') THEN
        CREATE TRIGGER update_supplier_products_updated_at
        BEFORE UPDATE ON public.supplier_products
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_marketplaces_updated_at') AND 
       EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'marketplaces') THEN
        CREATE TRIGGER update_marketplaces_updated_at
        BEFORE UPDATE ON public.marketplaces
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;

-- ✅ Créer les policies RLS pour les tables
DO $$
BEGIN
    -- Policies pour suppliers
    DROP POLICY IF EXISTS public_read_suppliers ON public.suppliers;
    CREATE POLICY public_read_suppliers
        ON public.suppliers
        FOR SELECT
        TO public
        USING (true);

    DROP POLICY IF EXISTS read_suppliers_20250510 ON public.suppliers;
    CREATE POLICY read_suppliers_20250510
        ON public.suppliers
        FOR SELECT
        TO authenticated
        USING (true);

    DROP POLICY IF EXISTS manage_own_suppliers ON public.suppliers;
    CREATE POLICY manage_own_suppliers
        ON public.suppliers
        FOR ALL
        TO authenticated
        USING (user_id = auth.uid())
        WITH CHECK (user_id = auth.uid());

    -- Policies pour supplier_products
    DROP POLICY IF EXISTS public_read_supplier_products ON public.supplier_products;
    CREATE POLICY public_read_supplier_products
        ON public.supplier_products
        FOR SELECT
        TO public
        USING (true);

    -- Policies pour marketplaces si la table existe
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'marketplaces') THEN
        DROP POLICY IF EXISTS read_marketplaces_20250510 ON public.marketplaces;
        CREATE POLICY read_marketplaces_20250510
            ON public.marketplaces
            FOR SELECT
            TO authenticated
            USING (true);
    END IF;
END
$$;

-- ✅ Insérer des données d'exemple dans marketplaces si nécessaire
INSERT INTO public.marketplaces (name, region, country, description, commission, requirements)
VALUES
    ('Rakuten', 'Asia', 'JP', 'Deuxième plus grande marketplace au Japon avec plus de 50 millions d''utilisateurs.', 10.0, '{}')
ON CONFLICT DO NOTHING;

-- ✅ Insérer des données d'exemple dans suppliers si nécessaire
INSERT INTO public.suppliers (name, country, type, verified, rating, processing_time, shipping_time, minimum_order, description, performance)
VALUES
    ('StyleHub Global', 'US', 'fashion', true, 4.6, '2-3 days', '4-8 days', 100, 'Trendy fashion items from US designers with worldwide shipping.', '{"on_time_delivery": 94, "quality_rating": 97, "response_rate": 92, "response_time": "4h"}'),
    ('EcoGadget Dropship', 'DE', 'electronics', true, 4.7, '1-2 days', '3-7 days', 50, 'Eco-friendly electronics and gadgets from Germany.', '{"on_time_delivery": 96, "quality_rating": 95, "response_rate": 98, "response_time": "2h"}')
ON CONFLICT DO NOTHING;

-- ✅ Insérer des données d'exemple dans supplier_products si nécessaire
DO $$
DECLARE
    supplier_id_1 UUID;
    supplier_id_2 UUID;
BEGIN
    SELECT id INTO supplier_id_1 FROM public.suppliers WHERE name = 'StyleHub Global' LIMIT 1;
    SELECT id INTO supplier_id_2 FROM public.suppliers WHERE name = 'EcoGadget Dropship' LIMIT 1;
    
    IF supplier_id_1 IS NOT NULL THEN
        INSERT INTO public.supplier_products (supplier_id, name, description, base_price, retail_price, category, image_urls)
        VALUES
            (supplier_id_1, 'T-shirt Bio', 'T-shirt coton bio haut de gamme', 12.99, 29.99, 'Apparel', ARRAY['https://images.pexels.com/photos/5698851/pexels-photo-5698851.jpeg?auto=compress&cs=tinysrgb&w=300'])
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF supplier_id_2 IS NOT NULL THEN
        INSERT INTO public.supplier_products (supplier_id, name, description, base_price, retail_price, category, image_urls)
        VALUES
            (supplier_id_2, 'Chargeur Solaire', 'Chargeur solaire portable waterproof', 19.99, 49.99, 'Electronics', ARRAY['https://images.pexels.com/photos/6667360/pexels-photo-6667360.jpeg?auto=compress&cs=tinysrgb&w=300'])
        ON CONFLICT DO NOTHING;
    END IF;
END
$$;