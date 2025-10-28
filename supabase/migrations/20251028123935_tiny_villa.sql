/*
  # Create users table extension

  1. New Tables
    - Extends the built-in auth.users with a profiles table
    - `id` (uuid, references auth.users)
    - `full_name` (text)
    - `organization_name` (text)
    - `role` (text)
    - `created_at` (timestamp)
    - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `users` table
    - Add policies for users to read and update their own data
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  organization_name text,
  role text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);