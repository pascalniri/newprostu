-- Migration to add parent_id to comments for threaded replies

ALTER TABLE comments
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES comments(id) ON DELETE CASCADE;

-- Index for performance
CREATE INDEX IF NOT EXISTS comments_parent_id_idx ON comments(parent_id);
