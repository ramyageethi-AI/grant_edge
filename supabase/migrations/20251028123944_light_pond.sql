/*
  # Create RFPs (Request for Proposals) table

  1. New Tables
    - `rfps`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `agency` (text, required)
      - `deadline` (date, required)
      - `funding_amount` (numeric)
      - `description` (text)
      - `eligibility_criteria` (text)
      - `focus_areas` (text array)
      - `source_url` (text)
      - `status` (text, default 'active')
      - `discovered_at` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `rfps` table
    - Add policies for public viewing of active RFPs
    - Authenticated users can view all RFPs
*/

CREATE TABLE IF NOT EXISTS rfps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  agency text NOT NULL,
  deadline date NOT NULL,
  funding_amount numeric,
  description text,
  eligibility_criteria text,
  focus_areas text[],
  source_url text,
  status text DEFAULT 'active',
  discovered_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rfps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active RFPs"
  ON rfps
  FOR SELECT
  TO public
  USING (status = 'active');

CREATE POLICY "Authenticated users can view all RFPs"
  ON rfps
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create RFPs"
  ON rfps
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() IS NOT NULL);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rfps_deadline ON rfps(deadline);
CREATE INDEX IF NOT EXISTS idx_rfps_status ON rfps(status);