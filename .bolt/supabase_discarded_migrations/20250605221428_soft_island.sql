/*
  # Add RLS policies for users table

  1. Security
    - Enable RLS on users table if not already enabled
    - Add policy for authenticated users to read their own data
    - Add policy for authenticated users to read basic user info
*/

-- Enable RLS
ALTER TABLE IF EXISTS users ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own full profile
CREATE POLICY "Users can read own profile"
ON users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Policy for users to read basic info of other users
CREATE POLICY "Users can read basic info of other users"
ON users
FOR SELECT
TO authenticated
USING (true)
WITH CHECK (true);

-- Ensure authenticated role has usage on public schema
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant SELECT on users table to authenticated role
GRANT SELECT ON users TO authenticated;