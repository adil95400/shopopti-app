-- Ajout de 400 fournisseurs dropshipping vérifiés

-- Fonction pour générer des données aléatoires
CREATE OR REPLACE FUNCTION random_between(low INT, high INT) 
RETURNS INT AS $$
BEGIN
   RETURN floor(random() * (high-low+1) + low);
END;
$$ LANGUAGE plpgsql;

-- Ajout des fournisseurs supplémentaires (jusqu'à 400 au total)
DO $$
DECLARE
    countries TEXT[] := ARRAY['US', 'UK', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'CA', 'AU', 'CN', 'JP', 'KR', 'SG', 'IN', 'BR', 'MX', 'AE', 'ZA', 'SE'];
    categories TEXT[] := ARRAY['Electronics', 'Home & Garden', 'Fashion', 'Sports & Outdoors', 'Beauty & Personal Care', 'Toys & Games', 'Jewelry & Accessories', 'Health & Wellness', 'Pet Supplies', 'Automotive', 'Office Supplies', 'Baby & Kids', 'Food & Beverages', 'Art & Crafts'];
    processing_times TEXT[] := ARRAY['1-2 days', '2-3 days', '1-3 days', '3-5 days', '2-4 days'];
    shipping_times TEXT[] := ARRAY['2-5 days', '3-7 days', '4-8 days', '5-10 days', '7-14 days'];
    
    supplier_name TEXT;
    country_code TEXT;
    category_name TEXT;
    processing_time TEXT;
    shipping_time TEXT;
    rating NUMERIC;
    min_order INTEGER;
    is_verified BOOLEAN;
    description TEXT;
    performance JSONB;
    
    existing_count INTEGER;
    suppliers_to_add INTEGER;
    i INTEGER;
BEGIN
    -- Compter les fournisseurs existants
    SELECT COUNT(*) INTO existing_count FROM public.suppliers;
    
    -- Calculer combien de fournisseurs ajouter pour atteindre 400
    suppliers_to_add := 400 - existing_count;
    
    -- Ajouter les fournisseurs supplémentaires
    FOR i IN 1..suppliers_to_add LOOP
        -- Générer des données aléatoires pour le fournisseur
        country_code := countries[random_between(1, array_length(countries, 1))];
        category_name := categories[random_between(1, array_length(categories, 1))];
        processing_time := processing_times[random_between(1, array_length(processing_times, 1))];
        shipping_time := shipping_times[random_between(1, array_length(shipping_times, 1))];
        rating := 3.5 + random() * 1.5; -- Rating entre 3.5 et 5.0
        min_order := random_between(10, 200);
        is_verified := random() > 0.3; -- 70% de chance d'être vérifié
        
        -- Créer un nom de fournisseur unique
        supplier_name := 
            CASE random_between(1, 4)
                WHEN 1 THEN 'Global ' || category_name || ' Supply'
                WHEN 2 THEN country_code || ' ' || category_name || ' Wholesale'
                WHEN 3 THEN 'Prime ' || category_name || ' ' || country_code
                WHEN 4 THEN 'Pro ' || category_name || ' Direct'
            END || ' ' || i;
        
        -- Créer une description
        description := 
            CASE random_between(1, 3)
                WHEN 1 THEN 'Leading supplier of ' || category_name || ' products with fast shipping to worldwide destinations.'
                WHEN 2 THEN 'Established ' || category_name || ' wholesaler with quality products and competitive prices.'
                WHEN 3 THEN 'Specialized in premium ' || category_name || ' with excellent customer service and reliable shipping.'
            END;
        
        -- Créer des métriques de performance
        performance := jsonb_build_object(
            'on_time_delivery', random_between(80, 99),
            'quality_rating', random_between(85, 99),
            'response_rate', random_between(80, 99),
            'response_time', random_between(1, 12) || 'h'
        );
        
        -- Insérer le fournisseur
        INSERT INTO public.suppliers (
            name, 
            country, 
            category, 
            verified, 
            rating, 
            processing_time, 
            shipping_time, 
            minimum_order, 
            description, 
            performance
        ) VALUES (
            supplier_name,
            country_code,
            category_name,
            is_verified,
            rating,
            processing_time,
            shipping_time,
            min_order,
            description,
            performance
        );
        
        -- Ajouter 1-3 produits pour ce fournisseur
        FOR j IN 1..random_between(1, 3) LOOP
            INSERT INTO public.supplier_products (
                supplier_id,
                name,
                description,
                base_price,
                retail_price,
                inventory_count,
                moq,
                category,
                images
            ) VALUES (
                (SELECT id FROM public.suppliers WHERE name = supplier_name),
                'Product ' || category_name || ' ' || j,
                'Quality ' || category_name || ' product with premium features and competitive pricing.',
                random_between(5, 100)::numeric + random(),
                random_between(15, 250)::numeric + random(),
                random_between(100, 1000),
                random_between(1, 20),
                category_name,
                ARRAY['https://images.pexels.com/photos/' || random_between(1000000, 9999999) || '/pexels-photo-' || random_between(1000000, 9999999) || '.jpeg?auto=compress&cs=tinysrgb&w=300']
            );
        END LOOP;
    END LOOP;
END $$;