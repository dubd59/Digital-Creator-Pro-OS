/*
  # Project and Invites Schema Update
  
  1. Changes
    - Convert project_id from integer to UUID in project_invites table
    - Create projects table with UUID primary key
    - Set up RLS policies for project access
    
  2. Security
    - Enable RLS on projects table
    - Add policies for project owners and invited users
*/

-- Create the projects table first
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'planning',
  progress integer NOT NULL DEFAULT 0,
  due_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  owner_id uuid REFERENCES auth.users(id) NOT NULL
);

-- Handle the project_invites table conversion
ALTER TABLE project_invites 
  ADD COLUMN project_id_new uuid;

-- Drop the existing foreign key if it exists
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'project_invites_project_id_fkey'
  ) THEN
    ALTER TABLE project_invites DROP CONSTRAINT project_invites_project_id_fkey;
  END IF;
END $$;

-- Drop the old column and rename the new one
ALTER TABLE project_invites DROP COLUMN project_id;
ALTER TABLE project_invites RENAME COLUMN project_id_new TO project_id;
ALTER TABLE project_invites ALTER COLUMN project_id SET NOT NULL;

-- Enable RLS on projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Allow project owners to have full access
CREATE POLICY "Project owners have full access"
  ON projects
  FOR ALL
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Allow invited users to read projects
CREATE POLICY "Invited users can read projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM project_invites
      WHERE project_invites.project_id = projects.id
      AND project_invites.email = auth.jwt() ->> 'email'
      AND project_invites.status = 'accepted'
    )
  );

-- Add foreign key to project_invites table
ALTER TABLE project_invites
  ADD CONSTRAINT project_invites_project_id_fkey
  FOREIGN KEY (project_id) REFERENCES projects(id)
  ON DELETE CASCADE;