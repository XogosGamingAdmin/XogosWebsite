-- Board Member Skills/Competencies Table
-- Stores individual skill assessments for each board member
CREATE TABLE IF NOT EXISTS board_member_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_category TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  proficiency_level INTEGER NOT NULL CHECK (proficiency_level >= 1 AND proficiency_level <= 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, skill_category, skill_name)
);

-- Predefined Skill Categories and Skills
-- This table stores the standard skills that board members can rate themselves on
CREATE TABLE IF NOT EXISTS skill_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category, skill_name)
);

-- Insert default skill categories and skills
INSERT INTO skill_definitions (category, skill_name, description, display_order) VALUES
  -- Strategic Leadership
  ('Strategic Leadership', 'Strategic Planning', 'Ability to develop and execute long-term strategies', 1),
  ('Strategic Leadership', 'Vision Setting', 'Articulating and communicating organizational vision', 2),
  ('Strategic Leadership', 'Decision Making', 'Making sound decisions under uncertainty', 3),
  ('Strategic Leadership', 'Change Management', 'Leading and managing organizational change', 4),

  -- Financial Acumen
  ('Financial Acumen', 'Financial Analysis', 'Analyzing financial statements and metrics', 1),
  ('Financial Acumen', 'Budgeting', 'Budget planning and oversight', 2),
  ('Financial Acumen', 'Investment Strategy', 'Understanding investment principles', 3),
  ('Financial Acumen', 'Risk Assessment', 'Financial risk evaluation', 4),

  -- Governance & Compliance
  ('Governance & Compliance', 'Corporate Governance', 'Understanding governance principles', 1),
  ('Governance & Compliance', 'Regulatory Compliance', 'Knowledge of regulatory requirements', 2),
  ('Governance & Compliance', 'Ethics & Integrity', 'Promoting ethical conduct', 3),
  ('Governance & Compliance', 'Legal Understanding', 'Basic legal knowledge relevant to the org', 4),

  -- Technology & Innovation
  ('Technology & Innovation', 'EdTech Knowledge', 'Educational technology understanding', 1),
  ('Technology & Innovation', 'Digital Transformation', 'Leading digital initiatives', 2),
  ('Technology & Innovation', 'AI & Emerging Tech', 'Understanding AI and new technologies', 3),
  ('Technology & Innovation', 'Cybersecurity Awareness', 'Basic cybersecurity understanding', 4),

  -- Education & Industry
  ('Education & Industry', 'K-12 Education', 'Understanding K-12 education sector', 1),
  ('Education & Industry', 'Higher Education', 'Understanding higher education sector', 2),
  ('Education & Industry', 'Gaming Industry', 'Knowledge of gaming industry', 3),
  ('Education & Industry', 'Market Trends', 'Understanding market dynamics', 4),

  -- Communication & Relationships
  ('Communication & Relationships', 'Public Speaking', 'Presenting to various audiences', 1),
  ('Communication & Relationships', 'Stakeholder Engagement', 'Building relationships with stakeholders', 2),
  ('Communication & Relationships', 'Fundraising', 'Donor relations and fundraising', 3),
  ('Communication & Relationships', 'Networking', 'Building professional networks', 4),

  -- Operations & Management
  ('Operations & Management', 'HR & People Management', 'Human resources oversight', 1),
  ('Operations & Management', 'Operations Management', 'Operational efficiency', 2),
  ('Operations & Management', 'Project Management', 'Managing complex projects', 3),
  ('Operations & Management', 'Quality Assurance', 'Ensuring quality standards', 4)
ON CONFLICT (category, skill_name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_board_member_skills_user_id ON board_member_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_board_member_skills_category ON board_member_skills(skill_category);
CREATE INDEX IF NOT EXISTS idx_skill_definitions_category ON skill_definitions(category);
CREATE INDEX IF NOT EXISTS idx_skill_definitions_active ON skill_definitions(is_active);

-- Enable Row Level Security
ALTER TABLE board_member_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_definitions ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Allow all for authenticated users" ON board_member_skills;
CREATE POLICY "Allow all for authenticated users" ON board_member_skills FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for authenticated users" ON skill_definitions;
CREATE POLICY "Allow all for authenticated users" ON skill_definitions FOR ALL USING (true);
