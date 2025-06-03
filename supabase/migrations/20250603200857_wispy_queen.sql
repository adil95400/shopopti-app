/*
  # Create Subscriptions Table

  1. New Tables
    - `subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `stripe_customer_id` (text)
      - `stripe_subscription_id` (text)
      - `plan` (text)
      - `status` (text)
      - `price_id` (text)
      - `current_period_end` (bigint)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `subscriptions` table
    - Add policies for users to:
      - View their own subscriptions
      - Insert their own subscriptions
      - Update their own subscriptions
    - Create index on user_id for better query performance

  3. Changes
    - Creates a new table for storing subscription information
    - Sets up appropriate security policies
    - Adds necessary indexes
*/

CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_customer_id text,
    stripe_subscription_id text,
    plan text,
    status text,
    price_id text,
    current_period_end bigint,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions"
    ON public.subscriptions
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions"
    ON public.subscriptions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
    ON public.subscriptions
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id 
    ON public.subscriptions (user_id);