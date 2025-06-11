/*
  # User Settings Table

  1. New Tables
    - `user_settings` - Stores user preferences like language and currency
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `language` (text, default 'en')
      - `currency` (text, default 'USD')
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `user_settings` table
    - Add policy for users to manage their own settings
*/

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  language text NOT NULL DEFAULT 'en',
  currency text NOT NULL DEFAULT 'USD',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create unique index on user_id to ensure one settings record per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- Enable Row Level Security
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own settings
CREATE POLICY "Users can manage their own settings"
  ON user_settings
  FOR ALL
  TO public
  USING (user_id = uid())
  WITH CHECK (user_id = uid());