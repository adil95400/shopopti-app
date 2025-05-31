-- Create tracking_history table
CREATE TABLE IF NOT EXISTS tracking_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  tracking_number text NOT NULL,
  carrier text,
  status text,
  last_checked timestamptz DEFAULT now(),
  history jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tracking_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own tracking history"
  ON tracking_history
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own tracking history"
  ON tracking_history
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own tracking history"
  ON tracking_history
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tracking_history_user ON tracking_history(user_id);
CREATE INDEX IF NOT EXISTS idx_tracking_history_number ON tracking_history(tracking_number);