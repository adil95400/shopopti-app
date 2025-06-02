/*
  # Create store connections table

  1. New Tables
    - `store_connections`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `platform` (text)
      - `store_url` (text)
      - `api_key` (text)
      - `api_secret` (text, nullable)
      - `scopes` (text array, nullable)
      - `status` (text)
      - `created_at` (timestamptz)
      - `last_sync` (timestamptz, nullable)

  2. Security
    - Enable RLS on `store_connections` table
    - Add policies for authenticated users to:
      - View their own connections
      - Insert their own connections
      - Update their own connections
      - Delete their own connections

  3. Indexes
    - Index on user_id for faster lookups
    - Index on status for filtering active connections
*/

-- Create the store_connections table
CREATE TABLE IF NOT EXISTS public.store_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  platform text NOT NULL,
  store_url text NOT NULL,
  api_key text NOT NULL,
  api_secret text,
  scopes text[],
  status text NOT NULL DEFAULT 'inactive',
  created_at timestamptz NOT NULL DEFAULT now(),
  last_sync timestamptz
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_store_connections_user_id ON public.store_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_store_connections_status ON public.store_connections(status);

-- Enable Row Level Security
ALTER TABLE public.store_connections ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own store connections"
  ON public.store_connections
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own store connections"
  ON public.store_connections
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own store connections"
  ON public.store_connections
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own store connections"
  ON public.store_connections
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add helpful comments
COMMENT ON TABLE public.store_connections IS 'Stores connections to various e-commerce platforms';
COMMENT ON COLUMN public.store_connections.platform IS 'The e-commerce platform (e.g., shopify, woocommerce)';
COMMENT ON COLUMN public.store_connections.status IS 'Connection status (active, inactive, error)';