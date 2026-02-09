-- Migration to expand schema for feed and map features
-- 1. Add coordinates to schools and campuses
-- 2. Create comments table for interactions with approval workflow and attachments

-- ==========================================
-- 1. Add Coordinates to Schools and Campuses
-- ==========================================

ALTER TABLE schools
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

ALTER TABLE campuses
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

COMMENT ON COLUMN schools.latitude IS 'Latitude coordinate for map display';
COMMENT ON COLUMN schools.longitude IS 'Longitude coordinate for map display';
COMMENT ON COLUMN campuses.latitude IS 'Latitude coordinate for map display';
COMMENT ON COLUMN campuses.longitude IS 'Longitude coordinate for map display';

-- ==========================================
-- 2. Create Comments Table
-- ==========================================

CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID NOT NULL REFERENCES approved_content(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, 
  author_name TEXT, 
  content TEXT NOT NULL,
  
  -- Approval Workflow
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,

  -- Attachments
  attachment_url TEXT,
  attachment_name TEXT,
  attachment_type TEXT, -- e.g., 'image/png', 'application/pdf'

  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX IF NOT EXISTS comments_content_id_idx ON comments(content_id);
CREATE INDEX IF NOT EXISTS comments_created_at_idx ON comments(created_at);
CREATE INDEX IF NOT EXISTS comments_status_idx ON comments(status);

-- RLS Policies

-- Anyone can view APPROVED comments
CREATE POLICY "Anyone can view approved comments"
  ON comments FOR SELECT
  USING (status = 'approved' AND is_active = true);

-- Authenticated users can INSERT comments (default pending)
CREATE POLICY "Authenticated users can comment"
  ON comments FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  USING (auth.uid() = author_id);

-- Admins can VIEW ALL comments (including pending/rejected)
CREATE POLICY "Admins can view all comments"
  ON comments FOR SELECT
  USING (auth.uid() IN (SELECT id FROM admins));

-- Admins can UPDATE comments (approve/reject/edit)
CREATE POLICY "Admins can manage comments"
  ON comments FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM admins));

-- Admins can DELETE any comment
CREATE POLICY "Admins can delete any comment"
  ON comments FOR DELETE
  USING (auth.uid() IN (SELECT id FROM admins));

-- Trigger for updated_at
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
