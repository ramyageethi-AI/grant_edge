/*
  # Create organizations table for GrantEdge AI

  1. New Tables
    - `organizations`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `type` (text, organization type)
      - `description` (text, organization description)
      - `location` (text, organization location)
      - `contact_email` (text, contact email)
      - `phone` (text, phone number)
      - `website` (text, website URL)
      - `founded_year` (integer, year founded)
      - `employee_count` (integer, number of employees)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `organizations` table
    - Add policy for users to manage their own organization data
*/

CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text,
  description text,
  location text,
  contact_email text,
  phone text,
  website text,
  founded_year integer,
  employee_count integer,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own organization"
  ON organizations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own organization"
  ON organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own organization"
  ON organizations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own organization"
  ON organizations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);