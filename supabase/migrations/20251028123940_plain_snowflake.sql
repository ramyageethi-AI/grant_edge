/*
  # Create organizations table

  1. New Tables
    - `organizations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `name` (text, required)
      - `sector` (text)
      - `organization_size` (text)
      - `mission` (text)
      - `annual_budget` (numeric)
      - `contact_email` (text)
      - `contact_phone` (text)
      - `address` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `organizations` table
    - Add policies for users to manage their own organization data
*/

CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  sector text,
  organization_size text,
  mission text,
  annual_budget numeric,
  contact_email text,
  contact_phone text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own organization"
  ON organizations
  FOR SELECT
  TO public
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own organization"
  ON organizations
  FOR INSERT
  TO public
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own organization"
  ON organizations
  FOR UPDATE
  TO public
  USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_organizations_user_id ON organizations(user_id);