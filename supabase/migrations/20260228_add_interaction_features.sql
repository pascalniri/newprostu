-- Add view_count to approved_content
ALTER TABLE approved_content ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Add is_accepted to comments
ALTER TABLE comments ADD COLUMN IF NOT EXISTS is_accepted BOOLEAN DEFAULT false;

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES approved_content(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, content_id)
);

-- Enable RLS for bookmarks
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Bookmarks RLS Policies
CREATE POLICY "Users can view their own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID REFERENCES approved_content(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  vote_type INTEGER NOT NULL CHECK (vote_type IN (1, -1)),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  -- Ensure a user can only vote once per content OR comment
  CONSTRAINT one_vote_per_user_content UNIQUE (user_id, content_id),
  CONSTRAINT one_vote_per_user_comment UNIQUE (user_id, comment_id),
  -- Ensure vote is applied to EITHER content OR comment, not both
  CONSTRAINT vote_target_check CHECK (
    (content_id IS NOT NULL AND comment_id IS NULL) OR
    (content_id IS NULL AND comment_id IS NOT NULL)
  )
);

-- Enable RLS for votes
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Votes RLS Policies
CREATE POLICY "Anyone can view votes"
  ON votes FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own votes"
  ON votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes"
  ON votes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes"
  ON votes FOR DELETE
  USING (auth.uid() = user_id);
