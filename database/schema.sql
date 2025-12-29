-- Board Member Profiles Table
CREATE TABLE IF NOT EXISTS board_member_profiles (
  user_id TEXT PRIMARY KEY,
  rss_topic TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Checklist Items Table
CREATE TABLE IF NOT EXISTS checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  task TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT NOT NULL
);

-- Xogos Statistics Table
CREATE TABLE IF NOT EXISTS xogos_statistics (
  id SERIAL PRIMARY KEY,
  accounts INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  total_hours INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by TEXT NOT NULL
);

-- Xogos Financials Table
CREATE TABLE IF NOT EXISTS xogos_financials (
  id SERIAL PRIMARY KEY,
  revenue NUMERIC(12, 2) DEFAULT 0,
  expenses NUMERIC(12, 2) DEFAULT 0,
  monthly_payments NUMERIC(12, 2) DEFAULT 0,
  yearly_payments NUMERIC(12, 2) DEFAULT 0,
  lifetime_members INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by TEXT NOT NULL
);

-- Insert default board member profiles
INSERT INTO board_member_profiles (user_id, rss_topic) VALUES
  ('enjoyweaver@gmail.com', 'blockchain technology'),
  ('zack@xogosgaming.com', 'education technology'),
  ('braden@kennyhertzperry.com', 'legal technology'),
  ('terrence@terrencegatsby.com', 'gaming industry'),
  ('sturs49@gmail.com', 'business news'),
  ('mckaylaareece@gmail.com', 'educational games')
ON CONFLICT (user_id) DO NOTHING;

-- Insert default statistics (single row)
INSERT INTO xogos_statistics (accounts, active_users, total_hours, updated_by) VALUES
  (0, 0, 0, 'system')
ON CONFLICT DO NOTHING;

-- Insert default financials (single row)
INSERT INTO xogos_financials (revenue, expenses, monthly_payments, yearly_payments, lifetime_members, updated_by) VALUES
  (0, 0, 0, 0, 0, 'system')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_checklist_user_id ON checklist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_checklist_created_at ON checklist_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_statistics_last_updated ON xogos_statistics(last_updated DESC);
CREATE INDEX IF NOT EXISTS idx_financials_last_updated ON xogos_financials(last_updated DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE board_member_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE xogos_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE xogos_financials ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all operations for now - you can restrict later)
CREATE POLICY "Allow all for authenticated users" ON board_member_profiles FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON checklist_items FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON xogos_statistics FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON xogos_financials FOR ALL USING (true);
