/*
  # Create proposals table

  1. New Tables
    - `proposals`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `rfp_id` (uuid, foreign key to rfps)
      - `organization_id` (uuid, foreign key to organizations)
      - `user_id` (uuid, foreign key to auth.users)
      - `status` (text, proposal status)
      - `requested_amount` (numeric, requested funding amount)
      - `summary` (text, proposal summary)
      - `content` (text, full proposal content)
      - `submitted_at` (timestamp, submission date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `proposals` table
    - Add policies for users to manage their own proposals
*/

CREATE TABLE IF NOT EXISTS proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  rfp_id uuid REFERENCES rfps(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text DEFAULT 'draft',
  requested_amount numeric,
  summary text,
  content text,
  submitted_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own proposals"
  ON proposals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own proposals"
  ON proposals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own proposals"
  ON proposals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own proposals"
  ON proposals
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);