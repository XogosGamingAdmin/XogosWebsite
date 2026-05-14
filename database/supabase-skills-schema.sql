-- Supabase Skills Matrix Schema
-- Run this in your Supabase SQL Editor to create the necessary tables

-- Board Member Skills Table
-- Stores individual skill assessments for each board member
CREATE TABLE IF NOT EXISTS board_member_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  skill_category TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  proficiency_level INTEGER NOT NULL CHECK (proficiency_level >= 1 AND proficiency_level <= 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_email, skill_category, skill_name)
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_board_member_skills_user_email ON board_member_skills(user_email);
CREATE INDEX IF NOT EXISTS idx_board_member_skills_category ON board_member_skills(skill_category);
CREATE INDEX IF NOT EXISTS idx_skill_definitions_category ON skill_definitions(category);
CREATE INDEX IF NOT EXISTS idx_skill_definitions_active ON skill_definitions(is_active);

-- Enable Row Level Security
ALTER TABLE board_member_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_definitions ENABLE ROW LEVEL SECURITY;

-- Create policies for service role access (our API uses service role key)
DROP POLICY IF EXISTS "Service role full access" ON board_member_skills;
CREATE POLICY "Service role full access" ON board_member_skills
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access" ON skill_definitions;
CREATE POLICY "Service role full access" ON skill_definitions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Insert default skill categories (these match the frontend categories)
INSERT INTO skill_definitions (category, skill_name, description, display_order) VALUES
  -- Core Governance Skills
  ('Core Governance Skills', 'Strategic Planning', 'Long-term vision and planning', 1),
  ('Core Governance Skills', 'Board Leadership', 'Leading board discussions and decisions', 2),
  ('Core Governance Skills', 'Financial Oversight', 'Budget review and financial governance', 3),
  ('Core Governance Skills', 'Risk Management', 'Identifying and mitigating risks', 4),
  ('Core Governance Skills', 'Legal/Regulatory Compliance', 'Understanding legal requirements', 5),
  ('Core Governance Skills', 'Technology Governance', 'Overseeing technology decisions', 6),

  -- Educational Content & Assessment
  ('Educational Content & Assessment', 'K-12 Curriculum Standards', 'Knowledge of education standards', 1),
  ('Educational Content & Assessment', 'Educational Game Design', 'Designing engaging learning games', 2),
  ('Educational Content & Assessment', 'Learning Assessment Methods', 'Evaluating student progress', 3),
  ('Educational Content & Assessment', 'Education Technology Trends', 'Current EdTech landscape', 4),
  ('Educational Content & Assessment', 'Accessibility in Education', 'Inclusive learning design', 5),

  -- Cryptocurrency & Blockchain
  ('Cryptocurrency & Blockchain', 'Blockchain Fundamentals', 'Understanding blockchain technology', 1),
  ('Cryptocurrency & Blockchain', 'Cryptocurrency Operations', 'Managing digital assets', 2),
  ('Cryptocurrency & Blockchain', 'Token Economics', 'Token design and economics', 3),
  ('Cryptocurrency & Blockchain', 'Crypto Regulatory Landscape', 'Compliance requirements', 4),
  ('Cryptocurrency & Blockchain', 'Digital Asset Security', 'Protecting digital assets', 5),

  -- Youth Protection & Data Privacy
  ('Youth Protection & Data Privacy', 'Child Online Protection', 'COPPA and safety measures', 1),
  ('Youth Protection & Data Privacy', 'Student Data Privacy', 'FERPA and data protection', 2),
  ('Youth Protection & Data Privacy', 'Responsible Gaming Practices', 'Ethical gaming principles', 3),
  ('Youth Protection & Data Privacy', 'Identity Verification', 'Age and identity verification', 4),
  ('Youth Protection & Data Privacy', 'Digital Citizenship', 'Online behavior education', 5),

  -- Scholarship & Financial Education
  ('Scholarship & Financial Education', 'Scholarship Administration', 'Managing scholarship programs', 1),
  ('Scholarship & Financial Education', 'Higher Education Financing', 'College funding knowledge', 2),
  ('Scholarship & Financial Education', 'Financial Literacy Education', 'Teaching money management', 3),
  ('Scholarship & Financial Education', 'Incentive Program Design', 'Reward system design', 4),
  ('Scholarship & Financial Education', 'Impact Measurement', 'Measuring educational outcomes', 5),

  -- Marketing & Communications
  ('Marketing & Communications', 'Brand Development', 'Building brand identity', 1),
  ('Marketing & Communications', 'Social Media Marketing', 'Digital marketing strategies', 2),
  ('Marketing & Communications', 'Public Relations', 'Media and stakeholder relations', 3),
  ('Marketing & Communications', 'Content Strategy', 'Content planning and creation', 4),
  ('Marketing & Communications', 'Marketing Analytics', 'Measuring marketing effectiveness', 5)
ON CONFLICT (category, skill_name) DO NOTHING;

-- Function to get members with their skill counts (for results page)
CREATE OR REPLACE FUNCTION get_members_with_skills()
RETURNS TABLE (
  user_email TEXT,
  user_name TEXT,
  user_avatar TEXT,
  skills_count BIGINT,
  last_updated TIMESTAMP WITH TIME ZONE
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT
    user_email,
    user_name,
    user_avatar,
    COUNT(*) as skills_count,
    MAX(updated_at) as last_updated
  FROM board_member_skills
  GROUP BY user_email, user_name, user_avatar
  ORDER BY user_name;
$$;

-- Function to get skill statistics across all board members
CREATE OR REPLACE FUNCTION get_skills_statistics()
RETURNS TABLE (
  skill_category TEXT,
  skill_name TEXT,
  member_count BIGINT,
  avg_proficiency NUMERIC,
  max_proficiency INTEGER,
  min_proficiency INTEGER
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT
    skill_category,
    skill_name,
    COUNT(*) as member_count,
    ROUND(AVG(proficiency_level), 2) as avg_proficiency,
    MAX(proficiency_level) as max_proficiency,
    MIN(proficiency_level) as min_proficiency
  FROM board_member_skills
  GROUP BY skill_category, skill_name
  ORDER BY skill_category, skill_name;
$$;
