/*
  # Create concept notes table

  1. New Tables
    - `concept_notes`
      - `id` (uuid, primary key)
      - `proposal_id` (uuid, foreign key to proposals)
      - `content` (text, required)
      - `approach_type` (text)
      - `version` (integer, default 1)
      - `selected` (boolean, default false)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `concept_notes` table
    - Add policies for users to manage concept notes for their proposals
*/

CREATE TABLE IF NOT EXISTS concept_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid REFERENCES proposals(id) ON DELETE CASCADE,
  content text NOT NULL,
  approach_type text,
  version integer DEFAULT 1,
  selected boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE concept_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view concept notes of their proposals"
  ON concept_notes
  FOR SELECT
  TO public
  USING (proposal_id IN (
    SELECT p.id FROM proposals p
    JOIN organizations o ON p.organization_id = o.id
    WHERE o.user_id = auth.uid()
  ));

CREATE POLICY "Users can create concept notes for their proposals"
  ON concept_notes
  FOR INSERT
  TO public
  WITH CHECK (proposal_id IN (
    SELECT p.id FROM proposals p
    JOIN organizations o ON p.organization_id = o.id
    WHERE o.user_id = auth.uid()
  ));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_concept_notes_proposal_id ON concept_notes(proposal_id);