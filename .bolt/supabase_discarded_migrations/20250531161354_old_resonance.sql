-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  invoice_number text NOT NULL,
  customer_name text NOT NULL,
  customer_email text,
  customer_address text,
  company_name text,
  company_address text,
  company_email text,
  company_phone text,
  items jsonb NOT NULL,
  subtotal numeric(10,2) NOT NULL,
  tax_rate numeric(5,2) DEFAULT 20,
  tax_amount numeric(10,2) NOT NULL,
  total numeric(10,2) NOT NULL,
  notes text,
  issue_date date NOT NULL,
  due_date date NOT NULL,
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own invoices"
  ON invoices
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_invoices_user ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(issue_date);