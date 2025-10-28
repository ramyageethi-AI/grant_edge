/*
  # Create proposals table

  1. New Tables
    - `proposals`
      - `id` (uuid, primary key)
      - `rfp_id` (uuid, foreign key to rfps)
      - `organization_id` (uuid, foreign key to organizations)
      - `status` (text, default 'draft')
      - `ai_fit_score` (integer, 0-100)
      - `created_at` (timestamp)
      - `submitted_at` (timestamp)
      - `result` (text)
      - `notes` (text)

  2. Security
    - Enable RLS on `proposals` table
    - Add policies for users to manage their organization's proposals
*/

CREATE TABLE IF NOT EXISTS proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rfp_id uuid REFERENCES rfps(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  status text DEFAULT 'draft',
  ai_fit_score integer CHECK (ai_fit_score >= 0 AND ai_fit_score <= 100),
  created_at timestamptz DEFAULT now(),
  submitted_at timestamptz,
  result text,
  notes text
);

ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their organization's proposals"
  ON proposals
  FOR SELECT
  TO public
  USING (organization_id IN (
    SELECT id FROM organizations WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can create proposals for their organization"
  ON proposals
  FOR INSERT
  TO public
  WITH CHECK (organization_id IN (
    SELECT id FROM organizations WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update their proposals"
  ON proposals
  FOR UPDATE
  TO public
  USING (organization_id IN (
    SELECT id FROM organizations WHERE user_id = auth.uid()
  ));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_proposals_rfp_id ON proposals(rfp_id);
CREATE INDEX IF NOT EXISTS idx_proposals_org_id ON proposals(organization_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);