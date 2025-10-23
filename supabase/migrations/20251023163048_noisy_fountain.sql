/*
  # Create RFPs (Request for Proposals) table

  1. New Tables
    - `rfps`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, RFP description)
      - `funder_name` (text, name of funding organization)
      - `amount_min` (numeric, minimum funding amount)
      - `amount_max` (numeric, maximum funding amount)
      - `deadline` (date, application deadline)
      - `eligibility_criteria` (text, eligibility requirements)
      - `focus_areas` (text array, focus areas/categories)
      - `geographic_scope` (text, geographic limitations)
      - `status` (text, RFP status)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `rfps` table
    - Add policy for authenticated users to view all RFPs
*/

CREATE TABLE IF NOT EXISTS rfps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  funder_name text,
  amount_min numeric,
  amount_max numeric,
  deadline date,
  eligibility_criteria text,
  focus_areas text[],
  geographic_scope text,
  status text DEFAULT 'open',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE rfps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all RFPs"
  ON rfps
  FOR SELECT
  TO authenticated
  USING (true);