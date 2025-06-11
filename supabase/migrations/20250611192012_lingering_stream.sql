/*
  # User Settings Table Migration

  1. New Tables
    - `user_settings` - Stores user preferences like language and currency
  2. Security
    - Enable RLS on `user_settings` table
    - Add policy for users to manage their own settings
*/

-- Check if the table already exists before creating it
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_settings') THEN
    -- Create user_settings table
    CREATE TABLE user_settings (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      language text NOT NULL DEFAULT 'en',
      currency text NOT NULL DEFAULT 'USD',
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );

    -- Create unique index on user_id to ensure one settings record per user
    CREATE UNIQUE INDEX idx_user_settings_user_id ON user_settings(user_id);

    -- Enable Row Level Security
    ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Check if the policy already exists before creating it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'user_settings' 
    AND policyname = 'Users can manage their own settings'
  ) THEN
    -- Create policy for users to manage their own settings
    CREATE POLICY "Users can manage their own settings"
      ON user_settings
      FOR ALL
      TO public
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;