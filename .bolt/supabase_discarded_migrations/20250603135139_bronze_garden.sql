/*
  # Add missing modules tables for Shopopti+

  1. New Tables
    - `pricing_rules` - For automatic price optimization
    - `competitor_prices` - For tracking competitor prices
    - `stock_alerts` - For inventory management
    - `reorders` - For automatic reordering
    - `chat_sessions` and `chat_messages` - For customer support chat
    - `push_tokens` - For push notifications
    - `notification_preferences` - For user notification settings
    - `return_requests` and `return_items` - For returns management
    - `invoices` and `invoice_items` - For accounting
    - `funnels` and `funnel_steps` - For sales funnels
    - `templates` - For page templates
    - `ab_tests` and related tables - For A/B testing
*/

-- ============================================
-- 🧠 Repricing AI Module
-- ============================================

-- Pricing rules table
CREATE TABLE IF NOT EXISTS public.pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('fixed', 'percentage', 'cost_plus', 'competitor_based')),
  value NUMERIC NOT NULL,
  min_price NUMERIC,
  max_price NUMERIC,
  apply_to TEXT NOT NULL CHECK (apply_to IN ('all', 'category', 'supplier', 'tag')),
  apply_to_value TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Competitor prices table
CREATE TABLE IF NOT EXISTS public.competitor_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  competitor_name TEXT NOT NULL,
  competitor_url TEXT,
  price NUMERIC NOT NULL,
  last_checked TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 🛍️ Inventory Management Module
-- ============================================

-- Stock alerts table
CREATE TABLE IF NOT EXISTS public.stock_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  current_stock INTEGER NOT NULL,
  threshold INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'resolved', 'ignored')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Reorders table
CREATE TABLE IF NOT EXISTS public.reorders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  supplier_id UUID REFERENCES public.suppliers(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Inventory settings table
CREATE TABLE IF NOT EXISTS public.inventory_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  low_stock_threshold INTEGER DEFAULT 5,
  notify_on_low_stock BOOLEAN DEFAULT true,
  auto_reorder BOOLEAN DEFAULT false,
  reorder_quantity INTEGER DEFAULT 10,
  track_inventory_changes BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 💬 Chat Support Module
-- ============================================

-- Chat sessions table
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  last_message TEXT,
  last_message_time TIMESTAMPTZ DEFAULT now(),
  status TEXT NOT NULL CHECK (status IN ('active', 'closed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT now(),
  metadata JSONB
);

-- ============================================
-- 📲 Push Notifications Module
-- ============================================

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('order', 'product', 'system', 'marketing', 'stock')),
  read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Push tokens table
CREATE TABLE IF NOT EXISTS public.push_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  device_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Notification preferences table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email BOOLEAN DEFAULT true,
  push BOOLEAN DEFAULT true,
  in_app BOOLEAN DEFAULT true,
  order_updates BOOLEAN DEFAULT true,
  stock_alerts BOOLEAN DEFAULT true,
  marketing_messages BOOLEAN DEFAULT true,
  system_announcements BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 📦 Returns Management Module
-- ============================================

-- Return requests table
CREATE TABLE IF NOT EXISTS public.return_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL,
  order_number TEXT NOT NULL,
  customer_id UUID REFERENCES auth.users(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  refund_amount NUMERIC,
  tracking_number TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Return items table
CREATE TABLE IF NOT EXISTS public.return_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  return_request_id UUID REFERENCES public.return_requests(id) ON DELETE CASCADE,
  product_id UUID NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  reason TEXT NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('new', 'used', 'damaged')),
  images TEXT[]
);

-- Refunds table
CREATE TABLE IF NOT EXISTS public.refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  return_request_id UUID REFERENCES public.return_requests(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('original', 'store_credit', 'bank_transfer')),
  notes TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 🧾 Accounting Module
-- ============================================

-- Invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL UNIQUE,
  customer_id UUID NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  subtotal NUMERIC NOT NULL,
  tax_rate NUMERIC NOT NULL,
  tax_amount NUMERIC NOT NULL,
  total NUMERIC NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  issue_date TIMESTAMPTZ NOT NULL,
  due_date TIMESTAMPTZ NOT NULL,
  paid_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Invoice items table
CREATE TABLE IF NOT EXISTS public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
  product_id UUID,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC NOT NULL,
  tax_rate NUMERIC,
  total NUMERIC NOT NULL
);

-- ============================================
-- 🛒 Sales Funnel Module
-- ============================================

-- Funnels table
CREATE TABLE IF NOT EXISTS public.funnels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'active', 'archived')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Funnel steps table
CREATE TABLE IF NOT EXISTS public.funnel_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funnel_id UUID REFERENCES public.funnels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('landing', 'product', 'upsell', 'downsell', 'checkout', 'thank_you')),
  content JSONB NOT NULL,
  settings JSONB NOT NULL,
  position INTEGER NOT NULL,
  next_steps JSONB NOT NULL
);

-- Funnel analytics table
CREATE TABLE IF NOT EXISTS public.funnel_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funnel_id UUID REFERENCES public.funnels(id) ON DELETE CASCADE,
  step_id UUID REFERENCES public.funnel_steps(id) ON DELETE CASCADE,
  user_id UUID,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'conversion', 'click', 'exit')),
  revenue NUMERIC,
  metadata JSONB,
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 🛠️ Template Builder Module
-- ============================================

-- Templates table
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('product', 'landing', 'email', 'blog', 'social')),
  content TEXT NOT NULL,
  thumbnail TEXT,
  tags TEXT[],
  is_public BOOLEAN DEFAULT false,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 📊 A/B Testing Module
-- ============================================

-- A/B tests table
CREATE TABLE IF NOT EXISTS public.ab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'running', 'completed', 'archived')),
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  target_audience TEXT,
  audience_segment_id TEXT,
  winning_variant_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- A/B test variants table
CREATE TABLE IF NOT EXISTS public.ab_test_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID REFERENCES public.ab_tests(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  content JSONB NOT NULL,
  traffic_allocation NUMERIC NOT NULL CHECK (traffic_allocation >= 0 AND traffic_allocation <= 100)
);

-- A/B test analytics table
CREATE TABLE IF NOT EXISTS public.ab_test_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID REFERENCES public.ab_tests(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.ab_test_variants(id) ON DELETE CASCADE,
  user_id UUID,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('impression', 'click', 'conversion')),
  revenue NUMERIC,
  metadata JSONB,
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- A/B test assignments table
CREATE TABLE IF NOT EXISTS public.ab_test_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID REFERENCES public.ab_tests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  variant_id UUID REFERENCES public.ab_test_variants(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(test_id, user_id)
);

-- ============================================
-- 🔐 Row Level Security Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitor_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reorders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.return_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.return_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funnel_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funnel_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_test_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_test_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_test_assignments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view their own chat sessions" ON public.chat_sessions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view messages in their chat sessions" ON public.chat_messages
  FOR SELECT USING (session_id IN (
    SELECT id FROM public.chat_sessions WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can view their own return requests" ON public.return_requests
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Users can view items in their return requests" ON public.return_items
  FOR SELECT USING (return_request_id IN (
    SELECT id FROM public.return_requests WHERE customer_id = auth.uid()
  ));

CREATE POLICY "Users can view their own invoices" ON public.invoices
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Users can view items in their invoices" ON public.invoice_items
  FOR SELECT USING (invoice_id IN (
    SELECT id FROM public.invoices WHERE customer_id = auth.uid()
  ));

CREATE POLICY "Users can view public templates" ON public.templates
  FOR SELECT USING (is_public = true OR created_by = auth.uid());

-- ============================================
-- 📊 Indexes for Performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_pricing_rules_type ON public.pricing_rules(type);
CREATE INDEX IF NOT EXISTS idx_pricing_rules_apply_to ON public.pricing_rules(apply_to, apply_to_value);

CREATE INDEX IF NOT EXISTS idx_competitor_prices_product ON public.competitor_prices(product_id);
CREATE INDEX IF NOT EXISTS idx_competitor_prices_last_checked ON public.competitor_prices(last_checked);

CREATE INDEX IF NOT EXISTS idx_stock_alerts_product ON public.stock_alerts(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_alerts_status ON public.stock_alerts(status);

CREATE INDEX IF NOT EXISTS idx_reorders_product ON public.reorders(product_id);
CREATE INDEX IF NOT EXISTS idx_reorders_status ON public.reorders(status);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_user ON public.chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON public.chat_sessions(status);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON public.chat_messages(timestamp);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);

CREATE INDEX IF NOT EXISTS idx_push_tokens_user ON public.push_tokens(user_id);

CREATE INDEX IF NOT EXISTS idx_return_requests_order ON public.return_requests(order_id);
CREATE INDEX IF NOT EXISTS idx_return_requests_customer ON public.return_requests(customer_id);
CREATE INDEX IF NOT EXISTS idx_return_requests_status ON public.return_requests(status);

CREATE INDEX IF NOT EXISTS idx_return_items_request ON public.return_items(return_request_id);
CREATE INDEX IF NOT EXISTS idx_return_items_product ON public.return_items(product_id);

CREATE INDEX IF NOT EXISTS idx_invoices_customer ON public.invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_issue_date ON public.invoices(issue_date);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON public.invoices(due_date);

CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON public.invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_product ON public.invoice_items(product_id);

CREATE INDEX IF NOT EXISTS idx_funnels_status ON public.funnels(status);
CREATE INDEX IF NOT EXISTS idx_funnel_steps_funnel ON public.funnel_steps(funnel_id);
CREATE INDEX IF NOT EXISTS idx_funnel_steps_position ON public.funnel_steps(position);

CREATE INDEX IF NOT EXISTS idx_funnel_analytics_funnel ON public.funnel_analytics(funnel_id);
CREATE INDEX IF NOT EXISTS idx_funnel_analytics_step ON public.funnel_analytics(step_id);
CREATE INDEX IF NOT EXISTS idx_funnel_analytics_event_type ON public.funnel_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_funnel_analytics_timestamp ON public.funnel_analytics(timestamp);

CREATE INDEX IF NOT EXISTS idx_templates_type ON public.templates(type);
CREATE INDEX IF NOT EXISTS idx_templates_is_public ON public.templates(is_public);
CREATE INDEX IF NOT EXISTS idx_templates_created_by ON public.templates(created_by);

CREATE INDEX IF NOT EXISTS idx_ab_tests_status ON public.ab_tests(status);
CREATE INDEX IF NOT EXISTS idx_ab_test_variants_test ON public.ab_test_variants(test_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_variants_type ON public.ab_test_variants(type);

CREATE INDEX IF NOT EXISTS idx_ab_test_analytics_test ON public.ab_test_analytics(test_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_analytics_variant ON public.ab_test_analytics(variant_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_analytics_event_type ON public.ab_test_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_ab_test_analytics_timestamp ON public.ab_test_analytics(timestamp);

CREATE INDEX IF NOT EXISTS idx_ab_test_assignments_test ON public.ab_test_assignments(test_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_assignments_user ON public.ab_test_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_assignments_variant ON public.ab_test_assignments(variant_id);