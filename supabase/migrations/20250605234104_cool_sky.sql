/*
  # Create templates table

  1. New Tables
    - `templates`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `description` (text, optional)
      - `type` (text, required) - Constrained to: 'product', 'landing', 'email', 'blog', 'social'
      - `content` (text, required)
      - `thumbnail` (text, optional)
      - `tags` (jsonb, defaults to empty array)
      - `is_public` (boolean, defaults to false)
      - `created_by` (text, required)
      - `created_at` (timestamptz, auto-set)
      - `updated_at` (timestamptz, auto-set)

  2. Security
    - Enable RLS on `templates` table
    - Add policies for:
      - Public read access to public templates
      - Authenticated users can read their own templates
      - Authenticated users can create their own templates
      - Authenticated users can update their own templates
      - Authenticated users can delete their own templates
*/

-- Create templates table
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('product', 'landing', 'email', 'blog', 'social')),
  content TEXT NOT NULL,
  thumbnail TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Public can read public templates
CREATE POLICY "Public can read public templates"
  ON public.templates
  FOR SELECT
  TO public
  USING (is_public = true);

-- Users can read their own templates
CREATE POLICY "Users can read own templates"
  ON public.templates
  FOR SELECT
  TO authenticated
  USING (created_by = auth.uid()::text);

-- Users can create their own templates
CREATE POLICY "Users can create own templates"
  ON public.templates
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid()::text);

-- Users can update their own templates
CREATE POLICY "Users can update own templates"
  ON public.templates
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid()::text)
  WITH CHECK (created_by = auth.uid()::text);

-- Users can delete their own templates
CREATE POLICY "Users can delete own templates"
  ON public.templates
  FOR DELETE
  TO authenticated
  USING (created_by = auth.uid()::text);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_templates_type ON public.templates(type);
CREATE INDEX IF NOT EXISTS idx_templates_is_public ON public.templates(is_public);
CREATE INDEX IF NOT EXISTS idx_templates_created_by ON public.templates(created_by);