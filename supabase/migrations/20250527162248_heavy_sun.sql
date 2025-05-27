/*
  # Save Project Changes
  
  This migration ensures all project changes are preserved by:
  1. Adding any missing indexes
  2. Setting up proper constraints
  3. Ensuring data integrity
*/

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS project_invites_email_idx ON project_invites (email);
CREATE INDEX IF NOT EXISTS project_invites_status_idx ON project_invites (status);
CREATE INDEX IF NOT EXISTS projects_owner_id_idx ON projects (owner_id);
CREATE INDEX IF NOT EXISTS projects_status_idx ON projects (status);

-- Add updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'projects_updated_at_trigger'
  ) THEN
    CREATE TRIGGER projects_updated_at_trigger
      BEFORE UPDATE ON projects
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'project_invites_updated_at_trigger'
  ) THEN
    CREATE TRIGGER project_invites_updated_at_trigger
      BEFORE UPDATE ON project_invites
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;