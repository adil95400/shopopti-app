-- Create platform connections table
CREATE TABLE IF NOT EXISTS platform_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  platform_id text NOT NULL,
  name text NOT NULL,
  type text NOT NULL,
  credentials jsonb NOT NULL,
  status text NOT NULL DEFAULT 'inactive',
  settings jsonb DEFAULT '{}'::jsonb,
  last_sync timestamptz,
  connected_at timestamptz,
  disconnected_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create category mappings table
CREATE TABLE IF NOT EXISTS category_mappings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  primary_category text NOT NULL,
  mappings jsonb NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create sync history table
CREATE TABLE IF NOT EXISTS sync_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  status text NOT NULL,
  platforms jsonb NOT NULL,
  items_processed integer NOT NULL DEFAULT 0,
  items_succeeded integer NOT NULL DEFAULT 0,
  items_failed integer NOT NULL DEFAULT 0,
  duration integer NOT NULL DEFAULT 0,
  initiated_by text NOT NULL,
  error text,
  details jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create sync settings table
CREATE TABLE IF NOT EXISTS sync_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  auto_sync boolean DEFAULT true,
  sync_interval integer DEFAULT 60,
  sync_inventory boolean DEFAULT true,
  sync_prices boolean DEFAULT true,
  sync_orders boolean DEFAULT true,
  sync_products boolean DEFAULT true,
  conflict_resolution text DEFAULT 'newer',
  primary_platform text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create notification settings table
CREATE TABLE IF NOT EXISTS notification_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email boolean DEFAULT true,
  sms boolean DEFAULT false,
  push boolean DEFAULT true,
  in_app boolean DEFAULT true,
  events jsonb DEFAULT '{"syncSuccess": false, "syncError": true, "syncPartial": true, "lowStock": true, "newOrder": true, "orderStatusChange": false, "priceChange": false}'::jsonb,
  email_recipients text[] DEFAULT '{}'::text[],
  phone_numbers text[] DEFAULT '{}'::text[],
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_platform_connections_user_id ON platform_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_platform_connections_platform_id ON platform_connections(platform_id);
CREATE INDEX IF NOT EXISTS idx_platform_connections_status ON platform_connections(status);
CREATE INDEX IF NOT EXISTS idx_category_mappings_user_id ON category_mappings(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_history_user_id ON sync_history(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_history_type ON sync_history(type);
CREATE INDEX IF NOT EXISTS idx_sync_history_status ON sync_history(status);
CREATE INDEX IF NOT EXISTS idx_sync_settings_user_id ON sync_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_settings_user_id ON notification_settings(user_id);

-- Enable Row Level Security
ALTER TABLE platform_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'platform_connections' AND policyname = 'Users can manage their own platform connections'
    ) THEN
        CREATE POLICY "Users can manage their own platform connections"
        ON platform_connections
        FOR ALL
        TO authenticated
        USING (user_id = auth.uid())
        WITH CHECK (user_id = auth.uid());
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'category_mappings' AND policyname = 'Users can manage their own category mappings'
    ) THEN
        CREATE POLICY "Users can manage their own category mappings"
        ON category_mappings
        FOR ALL
        TO authenticated
        USING (user_id = auth.uid())
        WITH CHECK (user_id = auth.uid());
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'sync_history' AND policyname = 'Users can view their own sync history'
    ) THEN
        CREATE POLICY "Users can view their own sync history"
        ON sync_history
        FOR SELECT
        TO authenticated
        USING (user_id = auth.uid());
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'sync_settings' AND policyname = 'Users can manage their own sync settings'
    ) THEN
        CREATE POLICY "Users can manage their own sync settings"
        ON sync_settings
        FOR ALL
        TO authenticated
        USING (user_id = auth.uid())
        WITH CHECK (user_id = auth.uid());
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'notification_settings' AND policyname = 'Users can manage their own notification settings'
    ) THEN
        CREATE POLICY "Users can manage their own notification settings"
        ON notification_settings
        FOR ALL
        TO authenticated
        USING (user_id = auth.uid())
        WITH CHECK (user_id = auth.uid());
    END IF;
END
$$;