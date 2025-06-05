/*
  # Create missing tables and relationships

  1. New Tables
    - b2b_suppliers
    - inventory_settings
    - stock_alerts
    - chat_sessions
    - chat_messages
    - return_requests
    - return_items
    - ab_tests
    - ab_test_variants
    - funnels
    - funnel_steps

  2. Relationships
    - stock_alerts -> products
    - return_items -> return_requests
    - ab_test_variants -> ab_tests
    - funnel_steps -> funnels
    - chat_messages -> chat_sessions

  3. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
*/

-- Create b2b_suppliers table
CREATE TABLE IF NOT EXISTS b2b_suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country text NOT NULL,
  category text NOT NULL,
  delivery_delay text,
  min_order integer DEFAULT 0,
  verified boolean DEFAULT false,
  rating numeric DEFAULT 0,
  description text,
  contact_email text,
  website text,
  logo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create inventory_settings table
CREATE TABLE IF NOT EXISTS inventory_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  low_stock_threshold integer DEFAULT 5,
  notify_on_low_stock boolean DEFAULT true,
  auto_reorder boolean DEFAULT false,
  reorder_quantity integer DEFAULT 10,
  track_inventory_changes boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create stock_alerts table
CREATE TABLE IF NOT EXISTS stock_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  current_stock integer NOT NULL,
  threshold integer NOT NULL,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  last_message text,
  last_message_time timestamptz DEFAULT now(),
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES chat_sessions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL,
  content text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  metadata jsonb
);

-- Create return_requests table
CREATE TABLE IF NOT EXISTS return_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  order_number text NOT NULL,
  customer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  reason text NOT NULL,
  status text DEFAULT 'pending',
  refund_amount numeric,
  tracking_number text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create return_items table
CREATE TABLE IF NOT EXISTS return_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  return_request_id uuid REFERENCES return_requests(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  product_name text NOT NULL,
  quantity integer NOT NULL,
  price numeric NOT NULL,
  reason text,
  condition text,
  images text[]
);

-- Create ab_tests table
CREATE TABLE IF NOT EXISTS ab_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  status text DEFAULT 'draft',
  start_date timestamptz,
  end_date timestamptz,
  target_audience text DEFAULT 'all',
  audience_segment_id uuid,
  winning_variant_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ab_test_variants table
CREATE TABLE IF NOT EXISTS ab_test_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id uuid REFERENCES ab_tests(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL,
  content jsonb NOT NULL,
  traffic_allocation numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create funnels table
CREATE TABLE IF NOT EXISTS funnels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create funnel_steps table
CREATE TABLE IF NOT EXISTS funnel_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  funnel_id uuid REFERENCES funnels(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL,
  content jsonb NOT NULL,
  settings jsonb NOT NULL,
  position integer NOT NULL,
  next_steps jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_stock_alerts_product ON stock_alerts(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_alerts_status ON stock_alerts(status);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_return_requests_customer ON return_requests(customer_id);
CREATE INDEX IF NOT EXISTS idx_return_requests_status ON return_requests(status);
CREATE INDEX IF NOT EXISTS idx_return_items_request ON return_items(return_request_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_variants_test ON ab_test_variants(test_id);
CREATE INDEX IF NOT EXISTS idx_funnel_steps_funnel ON funnel_steps(funnel_id);

-- Enable Row Level Security
ALTER TABLE b2b_suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE return_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE return_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnel_steps ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access to b2b suppliers" ON b2b_suppliers
  FOR SELECT TO public USING (true);

CREATE POLICY "Admin manage inventory settings" ON inventory_settings
  FOR ALL TO authenticated USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE role = 'admin'
  ));

CREATE POLICY "Users view own stock alerts" ON stock_alerts
  FOR SELECT TO authenticated USING (
    product_id IN (SELECT id FROM products WHERE user_id = auth.uid())
  );

CREATE POLICY "Users manage own chat sessions" ON chat_sessions
  FOR ALL TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users manage own chat messages" ON chat_messages
  FOR ALL TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users manage own return requests" ON return_requests
  FOR ALL TO authenticated USING (customer_id = auth.uid());

CREATE POLICY "Users view own return items" ON return_items
  FOR SELECT TO authenticated USING (
    return_request_id IN (SELECT id FROM return_requests WHERE customer_id = auth.uid())
  );

CREATE POLICY "Users manage own AB tests" ON ab_tests
  FOR ALL TO authenticated USING (
    auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin')
  );

CREATE POLICY "Users view AB test variants" ON ab_test_variants
  FOR SELECT TO authenticated USING (
    test_id IN (SELECT id FROM ab_tests WHERE status = 'running' OR status = 'completed')
  );

CREATE POLICY "Users manage own funnels" ON funnels
  FOR ALL TO authenticated USING (
    auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin')
  );

CREATE POLICY "Users view funnel steps" ON funnel_steps
  FOR SELECT TO authenticated USING (
    funnel_id IN (SELECT id FROM funnels WHERE status = 'active')
  );