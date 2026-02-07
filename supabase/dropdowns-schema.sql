-- Additional Schema for Dynamic Dropdown Management
-- Run this AFTER the main schema.sql

-- =====================================================
-- DROPDOWN DATA TABLES
-- =====================================================

-- Topics Table
CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Schools Table
CREATE TABLE IF NOT EXISTS schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  abbreviation TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Campuses Table
CREATE TABLE IF NOT EXISTS campuses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  location TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Grade Levels Table
CREATE TABLE IF NOT EXISTS grade_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  order_index INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Universities Table
CREATE TABLE IF NOT EXISTS universities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  abbreviation TEXT UNIQUE NOT NULL,
  color_primary TEXT,
  color_secondary TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS topics_active_idx ON topics(is_active);
CREATE INDEX IF NOT EXISTS schools_active_idx ON schools(is_active);
CREATE INDEX IF NOT EXISTS campuses_active_idx ON campuses(is_active);
CREATE INDEX IF NOT EXISTS grade_levels_order_idx ON grade_levels(order_index);
CREATE INDEX IF NOT EXISTS universities_active_idx ON universities(is_active);

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE campuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE grade_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;

-- Public read access for active items
CREATE POLICY "Anyone can view active topics"
  ON topics FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view active schools"
  ON schools FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view active campuses"
  ON campuses FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view active grade levels"
  ON grade_levels FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view active universities"
  ON universities FOR SELECT
  USING (is_active = true);

-- Admin write access
CREATE POLICY "Admins can manage topics"
  ON topics FOR ALL
  USING (auth.uid() IN (SELECT id FROM admins));

CREATE POLICY "Admins can manage schools"
  ON schools FOR ALL
  USING (auth.uid() IN (SELECT id FROM admins));

CREATE POLICY "Admins can manage campuses"
  ON campuses FOR ALL
  USING (auth.uid() IN (SELECT id FROM admins));

CREATE POLICY "Admins can manage grade levels"
  ON grade_levels FOR ALL
  USING (auth.uid() IN (SELECT id FROM admins));

CREATE POLICY "Admins can manage universities"
  ON universities FOR ALL
  USING (auth.uid() IN (SELECT id FROM admins));

-- =====================================================
-- SEED DATA FOR DROPDOWN TABLES
-- =====================================================

-- Insert Topics
INSERT INTO topics (name, description) VALUES
  ('Mathematics', 'Math-related questions and resources'),
  ('Chemistry', 'Chemistry topics and lab work'),
  ('Physics', 'Physics concepts and problems'),
  ('Biology', 'Biology and life sciences'),
  ('Computer Science', 'Programming and CS topics'),
  ('Engineering', 'Engineering disciplines'),
  ('Literature', 'Literature and writing'),
  ('History', 'Historical topics'),
  ('Economics', 'Economics and finance'),
  ('Other', 'Miscellaneous topics')
ON CONFLICT (name) DO NOTHING;

-- Insert Schools
INSERT INTO schools (name, abbreviation) VALUES
  ('College of Engineering', 'CoE'),
  ('College of Literature, Science, and the Arts', 'LSA'),
  ('Ross School of Business', 'Ross'),
  ('School of Information', 'SI'),
  ('School of Public Health', 'SPH'),
  ('School of Education', 'SoE'),
  ('Other', NULL)
ON CONFLICT (name) DO NOTHING;

-- Insert Campuses
INSERT INTO campuses (name, location) VALUES
  ('North Campus', 'Northern area'),
  ('Central Campus', 'Central area'),
  ('Medical Campus', 'Medical district'),
  ('Athletic Campus', 'Athletic facilities')
ON CONFLICT (name) DO NOTHING;

-- Insert Grade Levels
INSERT INTO grade_levels (name, order_index) VALUES
  ('Freshman', 1),
  ('Sophomore', 2),
  ('Junior', 3),
  ('Senior', 4),
  ('Graduate', 5)
ON CONFLICT (name) DO NOTHING;

-- Insert Universities
INSERT INTO universities (name, abbreviation, color_primary, color_secondary) VALUES
  ('University of Michigan', 'UMich', '#00274C', '#FFCB05'),
  ('Harvard University', 'Harvard', '#A51C30', '#FFFFFF'),
  ('Stanford University', 'Stanford', '#8C1515', '#FFFFFF')
ON CONFLICT (abbreviation) DO NOTHING;

-- =====================================================
-- TRIGGERS
-- =====================================================

CREATE TRIGGER update_topics_updated_at BEFORE UPDATE ON topics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campuses_updated_at BEFORE UPDATE ON campuses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grade_levels_updated_at BEFORE UPDATE ON grade_levels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_universities_updated_at BEFORE UPDATE ON universities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
