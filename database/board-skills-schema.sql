-- Board Skills Table (Email-based, standalone)
-- Run this on your AWS RDS PostgreSQL database

CREATE TABLE IF NOT EXISTS board_skills (
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_board_skills_user_email ON board_skills(user_email);
CREATE INDEX IF NOT EXISTS idx_board_skills_category ON board_skills(skill_category);
