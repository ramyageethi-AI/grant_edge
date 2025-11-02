/*
  # Fix RLS Policies for Authentication

  1. Security Updates
    - Enable RLS on organizations table (was disabled)
    - Update users table INSERT policy to work with auth.uid()
    - Update organizations table policies to work with authenticated users

  2. Policy Changes
    - Allow authenticated users to insert their own user profile
    - Allow authenticated users to create organizations for themselves
    - Ensure proper foreign key relationships work with RLS
*/

-- Enable RLS on organizations table (it was disabled)
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Drop and recreate the users INSERT policy to fix the RLS issue
DROP POLICY IF EXISTS "Users can insert own data" ON users;
CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Update organizations policies to work properly with authenticated users
DROP POLICY IF EXISTS "Users can create their own organization" ON organizations;
CREATE POLICY "Users can create their own organization"
  ON organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own organization" ON organizations;
CREATE POLICY "Users can update their own organization"
  ON organizations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own organization" ON organizations;
CREATE POLICY "Users can view their own organization"
  ON organizations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);