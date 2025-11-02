/*
  # Fix Organization RLS Policy

  1. Security Updates
    - Drop existing organization policies that may be conflicting
    - Create new INSERT policy for organizations table
    - Ensure authenticated users can create organizations with their own user_id
    - Update existing policies to use proper auth.uid() function

  This fixes the RLS violation error when creating organizations during signup.
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can create their own organization" ON organizations;
DROP POLICY IF EXISTS "Users can update their own organization" ON organizations;
DROP POLICY IF EXISTS "Users can view their own organization" ON organizations;
DROP POLICY IF EXISTS "Users can create proposals for their organization" ON organizations;
DROP POLICY IF EXISTS "Users can update their proposals" ON organizations;
DROP POLICY IF EXISTS "Users can view their organization's proposals" ON organizations;

-- Ensure RLS is enabled
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Create new policies with correct syntax
CREATE POLICY "Users can insert their own organization"
  ON organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can select their own organization"
  ON organizations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own organization"
  ON organizations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);