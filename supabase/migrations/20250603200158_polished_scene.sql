/*
  # Create Store Connections and Stripe Tables

  1. New Tables
    - `store_connections`: Stores e-commerce platform integrations
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `platform` (text)
      - `store_url` (text)
      - `api_key` (text)
      - `api_secret` (text, nullable)
      - `scopes` (text array)
      - `status` (text)
      - `created_at` (timestamp)
      - `last_sync` (timestamp)
    
    - `stripe_customers`: Stores Stripe customer information
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `customer_id` (text, unique)
      - `created_at` (timestamp)
      - `deleted_at` (timestamp)
    
    - `stripe_subscriptions`: Stores subscription details
      - `id` (uuid, primary key)
      - `customer_id` (text, references stripe_customers)
      - `subscription_id` (text, unique)
      - `price_id` (text)
      - Various subscription fields
  
  2. Views
    - `stripe_user_subscriptions`: Combines customer and subscription data
  
  3. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create store_connections table
CREATE TABLE public.store_connections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    platform text NOT NULL,
    store_url text NOT NULL,
    api_key text NOT NULL,
    api_secret text,
    scopes text[],
    status text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    last_sync timestamp with time zone,
    CONSTRAINT store_connections_pkey PRIMARY KEY (id),
    CONSTRAINT store_connections_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE public.store_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users" 
    ON public.store_connections FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for authenticated users" 
    ON public.store_connections FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for authenticated users" 
    ON public.store_connections FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for authenticated users" 
    ON public.store_connections FOR DELETE 
    USING (auth.uid() = user_id);

-- Create stripe_customers table
CREATE TABLE public.stripe_customers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    customer_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT stripe_customers_pkey PRIMARY KEY (id),
    CONSTRAINT stripe_customers_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT stripe_customers_customer_id_key UNIQUE (customer_id)
);

ALTER TABLE public.stripe_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users" 
    ON public.stripe_customers FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for authenticated users" 
    ON public.stripe_customers FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for authenticated users" 
    ON public.stripe_customers FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for authenticated users" 
    ON public.stripe_customers FOR DELETE 
    USING (auth.uid() = user_id);

-- Create stripe_subscriptions table
CREATE TABLE public.stripe_subscriptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    customer_id text NOT NULL,
    subscription_id text,
    price_id text,
    current_period_start bigint,
    current_period_end bigint,
    cancel_at_period_end boolean,
    payment_method_brand text,
    payment_method_last4 text,
    status text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    canceled_at timestamp with time zone,
    CONSTRAINT stripe_subscriptions_pkey PRIMARY KEY (id),
    CONSTRAINT stripe_subscriptions_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.stripe_customers(customer_id) ON DELETE CASCADE,
    CONSTRAINT stripe_subscriptions_subscription_id_key UNIQUE (subscription_id)
);

ALTER TABLE public.stripe_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users" 
    ON public.stripe_subscriptions FOR SELECT 
    USING (EXISTS ( 
        SELECT 1 
        FROM public.stripe_customers 
        WHERE stripe_customers.user_id = auth.uid() 
        AND stripe_customers.customer_id = stripe_subscriptions.customer_id
    ));

CREATE POLICY "Enable insert for authenticated users" 
    ON public.stripe_subscriptions FOR INSERT 
    WITH CHECK (EXISTS ( 
        SELECT 1 
        FROM public.stripe_customers 
        WHERE stripe_customers.user_id = auth.uid() 
        AND stripe_customers.customer_id = stripe_subscriptions.customer_id
    ));

CREATE POLICY "Enable update for authenticated users" 
    ON public.stripe_subscriptions FOR UPDATE 
    USING (EXISTS ( 
        SELECT 1 
        FROM public.stripe_customers 
        WHERE stripe_customers.user_id = auth.uid() 
        AND stripe_customers.customer_id = stripe_subscriptions.customer_id
    ));

CREATE POLICY "Enable delete for authenticated users" 
    ON public.stripe_subscriptions FOR DELETE 
    USING (EXISTS ( 
        SELECT 1 
        FROM public.stripe_customers 
        WHERE stripe_customers.user_id = auth.uid() 
        AND stripe_customers.customer_id = stripe_subscriptions.customer_id
    ));

-- Create stripe_user_subscriptions view
CREATE OR REPLACE VIEW public.stripe_user_subscriptions AS
SELECT
    sc.user_id,
    ss.customer_id,
    ss.subscription_id,
    ss.price_id,
    ss.current_period_start,
    ss.current_period_end,
    ss.cancel_at_period_end,
    ss.payment_method_brand,
    ss.payment_method_last4,
    ss.status AS subscription_status,
    ss.created_at AS subscription_created_at,
    ss.updated_at AS subscription_updated_at
FROM
    public.stripe_customers sc
JOIN
    public.stripe_subscriptions ss ON sc.customer_id = ss.customer_id;

ALTER VIEW public.stripe_user_subscriptions OWNER TO postgres;
GRANT ALL ON TABLE public.stripe_user_subscriptions TO postgres;
GRANT SELECT ON TABLE public.stripe_user_subscriptions TO authenticated;
GRANT SELECT ON TABLE public.stripe_user_subscriptions TO anon;