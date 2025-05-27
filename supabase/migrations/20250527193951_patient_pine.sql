/*
  # Create scheduled emails table

  1. New Tables
    - `scheduled_emails`
      - `id` (uuid, primary key)
      - `recipients` (text array)
      - `subject` (text)
      - `content` (text)
      - `scheduled_date` (timestamptz)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `scheduled_emails` table
    - Add policy for authenticated users to read their own scheduled emails
*/

CREATE TABLE IF NOT EXISTS scheduled_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipients text[] NOT NULL,
  subject text NOT NULL,
  content text NOT NULL,
  scheduled_date timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE scheduled_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own scheduled emails"
  ON scheduled_emails
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = ANY(recipients));

-- Add trigger for updating updated_at column
CREATE TRIGGER scheduled_emails_updated_at_trigger
  BEFORE UPDATE ON scheduled_emails
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();