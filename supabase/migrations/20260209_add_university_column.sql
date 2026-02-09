-- Migration: Add university column to submissions table
-- Date: 2026-02-09
-- Description: Add university field to match form data and approved_content table structure

-- Add university column to submissions table
ALTER TABLE submissions 
ADD COLUMN IF NOT EXISTS university TEXT NOT NULL DEFAULT '';

-- Add comment for documentation
COMMENT ON COLUMN submissions.university IS 'University selected from universities lookup table';

-- Add index for performance (optional but recommended)
CREATE INDEX IF NOT EXISTS submissions_university_idx ON submissions(university);

-- Verify the column was added
-- You can run this after the migration to confirm:
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'submissions' AND column_name = 'university';
