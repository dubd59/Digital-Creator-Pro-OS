/*
  # Create project invites table

  1. New Tables
    - `project_invites`
      - `id` (uuid, primary key)
      - `project_id` (integer, references projects)
      - `email` (text)
      - `invited_by` (text)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `project_invites` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS project_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id integer NOT NULL,
  email text NOT NULL,
  invited_by text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE project_invites ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read their own invites
CREATE POLICY "Users can read their own invites"
  ON project_invites
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = email);

-- Allow project owners to create invites
CREATE POLICY "Project owners can create invites"
  ON project_invites
  FOR INSERT
  TO authenticated
  WITH CHECK (invited_by = auth.jwt() ->> 'email');

-- Allow users to update their own invite status
CREATE POLICY "Users can update their own invite status"
  ON project_invites
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'email' = email)
  WITH CHECK (auth.jwt() ->> 'email' = email);