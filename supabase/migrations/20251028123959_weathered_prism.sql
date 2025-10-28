/*
  # Create full proposals table

  1. New Tables
    - `full_proposals`
      - `id` (uuid, primary key)
      - `proposal_id` (uuid, foreign key to proposals)
      - `executive_summary` (text)
      - `needs_statement` (text)
      - `methodology` (text)
      - `budget_narrative` (text)
      - `evaluation_plan` (text)
      - `organizational_capacity` (text)
      - `full_content` (text)
      - `version` (integer, default 1)
      - `word_count` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `full_proposals` table
    - Add policies for users to manage full proposals for their proposals
*/

CREATE TABLE IF NOT EXISTS full_proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid REFERENCES proposals(id) ON DELETE CASCADE,
  executive_summary text,
  needs_statement text,
  methodology text,
  budget_narrative text,
  evaluation_plan text,
  organizational_capacity text,
  full_content text,
  version integer DEFAULT 1,
  word_count integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE full_proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view full proposals of their proposals"
  ON full_proposals
  FOR SELECT
  TO public
  USING (proposal_id IN (
    SELECT p.id FROM proposals p
    JOIN organizations o ON p.organization_id = o.id
    WHERE o.user_id = auth.uid()
  ));

CREATE POLICY "Users can create full proposals"
  ON full_proposals
  FOR INSERT
  TO public
  WITH CHECK (proposal_id IN (
    SELECT p.id FROM proposals p
    JOIN organizations o ON p.organization_id = o.id
    WHERE o.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their full proposals"
  ON full_proposals
  FOR UPDATE
  TO public
  USING (proposal_id IN (
    SELECT p.id FROM proposals p
    JOIN organizations o ON p.organization_id = o.id
    WHERE o.user_id = auth.uid()
  ));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_full_proposals_proposal_id ON full_proposals(proposal_id);