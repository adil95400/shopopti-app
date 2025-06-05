/*
  # Fix templates table migration

  1. New Tables
    - Creates `templates` table if it doesn't exist
    - Adds necessary columns and constraints
  
  2. Security
    - Enables RLS on templates table
    - Adds policies for authenticated users to manage their own templates
    - Adds policy for public users to read public templates
*/

-- Create templates table if it doesn't exist
CREATE TABLE IF NOT EXISTS templates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  type text NOT NULL,
  content text NOT NULL,
  thumbnail text,
  tags jsonb DEFAULT '[]'::jsonb,
  is_public boolean NOT NULL DEFAULT false,
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add constraint to ensure type is one of the allowed values
-- First check if constraint exists to avoid error
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'templates_type_check' AND conrelid = 'templates'::regclass
  ) THEN
    ALTER TABLE templates
    ADD CONSTRAINT templates_type_check
    CHECK (type = ANY (ARRAY['product'::text, 'landing'::text, 'email'::text, 'blog'::text, 'social'::text]));
  END IF;
END $$;

-- Create indexes for common query patterns if they don't exist
CREATE INDEX IF NOT EXISTS idx_templates_type ON templates USING btree (type);
CREATE INDEX IF NOT EXISTS idx_templates_is_public ON templates USING btree (is_public);
CREATE INDEX IF NOT EXISTS idx_templates_created_by ON templates USING btree (created_by);

-- Enable Row Level Security
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Public can read public templates" ON templates;
DROP POLICY IF EXISTS "Users can read own templates" ON templates;
DROP POLICY IF EXISTS "Users can create own templates" ON templates;
DROP POLICY IF EXISTS "Users can update own templates" ON templates;
DROP POLICY IF EXISTS "Users can delete own templates" ON templates;

-- Public can read public templates
CREATE POLICY "Public can read public templates"
  ON templates
  FOR SELECT
  TO public
  USING (is_public = true);

-- Users can read own templates
CREATE POLICY "Users can read own templates"
  ON templates
  FOR SELECT
  TO authenticated
  USING (created_by = (uid())::text);

-- Users can create own templates
CREATE POLICY "Users can create own templates"
  ON templates
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = (uid())::text);

-- Users can update own templates
CREATE POLICY "Users can update own templates"
  ON templates
  FOR UPDATE
  TO authenticated
  USING (created_by = (uid())::text)
  WITH CHECK (created_by = (uid())::text);

-- Users can delete own templates
CREATE POLICY "Users can delete own templates"
  ON templates
  FOR DELETE
  TO authenticated
  USING (created_by = (uid())::text);