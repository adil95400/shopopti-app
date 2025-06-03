-- Création des tables pour les marketplaces et les intégrations

-- Table des marketplaces
CREATE TABLE IF NOT EXISTS public.marketplaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    region TEXT NOT NULL,
    country TEXT NOT NULL,
    logo_url TEXT,
    description TEXT,
    commission_rate NUMERIC,
    monthly_fee NUMERIC,
    setup_fee NUMERIC,
    currency TEXT,
    requirements JSONB,
    pros TEXT[],
    cons TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des intégrations marketplace par utilisateur
CREATE TABLE IF NOT EXISTS public.marketplace_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    marketplace_id UUID REFERENCES public.marketplaces(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending',
    credentials JSONB,
    settings JSONB DEFAULT '{}',
    products_count INTEGER DEFAULT 0,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des produits publiés sur les marketplaces
CREATE TABLE IF NOT EXISTS public.marketplace_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    integration_id UUID REFERENCES public.marketplace_integrations(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    external_id TEXT,
    status TEXT DEFAULT 'draft',
    published_at TIMESTAMP WITH TIME ZONE,
    last_updated_at TIMESTAMP WITH TIME ZONE,
    sync_status TEXT DEFAULT 'pending',
    sync_error TEXT,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activer RLS sur les tables
ALTER TABLE public.marketplaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_products ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les marketplaces
CREATE POLICY "Public read access to marketplaces" 
ON public.marketplaces FOR SELECT 
TO public 
USING (true);

-- Politiques RLS pour les intégrations marketplace
CREATE POLICY "Users can manage own marketplace integrations" 
ON public.marketplace_integrations FOR ALL 
TO authenticated 
USING (uid() = user_id)
WITH CHECK (uid() = user_id);

-- Politiques RLS pour les produits marketplace
CREATE POLICY "Users can manage own marketplace products" 
ON public.marketplace_products FOR ALL 
TO authenticated 
USING (uid() = user_id)
WITH CHECK (uid() = user_id);

-- Triggers pour mettre à jour le timestamp updated_at
CREATE TRIGGER update_marketplaces_updated_at
BEFORE UPDATE ON public.marketplaces
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketplace_integrations_updated_at
BEFORE UPDATE ON public.marketplace_integrations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketplace_products_updated_at
BEFORE UPDATE ON public.marketplace_products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insérer des données d'exemple pour les marketplaces
INSERT INTO public.marketplaces (name, region, country, description, commission_rate, monthly_fee, currency)
VALUES
('Amazon EU', 'Europe', 'Multiple', 'La plus grande marketplace en Europe avec une présence dans 8 pays européens.', 12.5, 39.99, 'EUR'),
('Cdiscount', 'Europe', 'FR', 'Deuxième plus grande marketplace en France avec plus de 10 millions de clients actifs.', 8.5, 39.99, 'EUR'),
('Amazon US', 'North America', 'US', 'La plus grande marketplace aux États-Unis avec plus de 200 millions de clients.', 12.5, 39.99, 'USD'),
('Walmart Marketplace', 'North America', 'US', 'Deuxième plus grande marketplace aux États-Unis avec plus de 120 millions de visiteurs mensuels.', 10.0, 0, 'USD'),
('Amazon Australia', 'Oceania', 'AU', 'La plus grande marketplace en Australie, en pleine croissance depuis son lancement en 2017.', 12.5, 49.95, 'AUD'),
('Rakuten', 'Asia', 'JP', 'Deuxième plus grande marketplace au Japon avec plus de 50 millions d'utilisateurs.', 10.0, 0, 'JPY'),
('Lazada', 'Asia', 'Multiple', 'Principale marketplace en Asie du Sud-Est, présente dans 6 pays.', 3.5, 0, 'USD');