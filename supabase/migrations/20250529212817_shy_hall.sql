-- Création des tables pour les fonctionnalités marketing avancées

-- Table des campagnes marketing
CREATE TABLE IF NOT EXISTS public.marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT DEFAULT 'draft',
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    budget NUMERIC DEFAULT 0,
    channels TEXT[],
    target_audience TEXT[],
    content JSONB DEFAULT '{}',
    metrics JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des emails marketing
CREATE TABLE IF NOT EXISTS public.marketing_emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES public.marketing_campaigns(id) ON DELETE SET NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    template TEXT,
    status TEXT DEFAULT 'draft',
    scheduled_for TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    metrics JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des posts sur les réseaux sociaux
CREATE TABLE IF NOT EXISTS public.social_media_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES public.marketing_campaigns(id) ON DELETE SET NULL,
    platform TEXT NOT NULL,
    content TEXT NOT NULL,
    images TEXT[],
    status TEXT DEFAULT 'draft',
    scheduled_for TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    metrics JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des campagnes SMS
CREATE TABLE IF NOT EXISTS public.sms_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES public.marketing_campaigns(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'draft',
    scheduled_for TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    metrics JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des segments d'audience
CREATE TABLE IF NOT EXISTS public.audience_segments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    criteria JSONB NOT NULL,
    estimated_size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activer RLS sur les tables
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_media_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audience_segments ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les campagnes marketing
CREATE POLICY "Users can manage own marketing campaigns" 
ON public.marketing_campaigns FOR ALL 
TO authenticated 
USING (uid() = user_id)
WITH CHECK (uid() = user_id);

-- Politiques RLS pour les emails marketing
CREATE POLICY "Users can manage own marketing emails" 
ON public.marketing_emails FOR ALL 
TO authenticated 
USING (uid() = user_id)
WITH CHECK (uid() = user_id);

-- Politiques RLS pour les posts sur les réseaux sociaux
CREATE POLICY "Users can manage own social media posts" 
ON public.social_media_posts FOR ALL 
TO authenticated 
USING (uid() = user_id)
WITH CHECK (uid() = user_id);

-- Politiques RLS pour les campagnes SMS
CREATE POLICY "Users can manage own SMS campaigns" 
ON public.sms_campaigns FOR ALL 
TO authenticated 
USING (uid() = user_id)
WITH CHECK (uid() = user_id);

-- Politiques RLS pour les segments d'audience
CREATE POLICY "Users can manage own audience segments" 
ON public.audience_segments FOR ALL 
TO authenticated 
USING (uid() = user_id)
WITH CHECK (uid() = user_id);

-- Triggers pour mettre à jour le timestamp updated_at
CREATE TRIGGER update_marketing_campaigns_updated_at
BEFORE UPDATE ON public.marketing_campaigns
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketing_emails_updated_at
BEFORE UPDATE ON public.marketing_emails
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_media_posts_updated_at
BEFORE UPDATE ON public.social_media_posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sms_campaigns_updated_at
BEFORE UPDATE ON public.sms_campaigns
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_audience_segments_updated_at
BEFORE UPDATE ON public.audience_segments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insérer des données d'exemple pour les campagnes marketing
INSERT INTO public.marketing_campaigns (name, type, status, start_date, end_date, budget, channels, target_audience)
VALUES
('Promotion Été 2025', 'seasonal', 'active', '2025-06-01', '2025-08-31', 5000, ARRAY['email', 'social', 'sms'], ARRAY['existing_customers', 'inactive_30d']),
('Bienvenue Nouveaux Clients', 'automated', 'active', '2025-01-01', NULL, 0, ARRAY['email'], ARRAY['new_customers']),
('Panier Abandonné', 'automated', 'active', '2025-01-01', NULL, 0, ARRAY['email'], ARRAY['cart_abandoners']);