-- Users Table (board members and authorized users)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,  -- Email address
  name TEXT NOT NULL,
  avatar TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Groups Junction Table
CREATE TABLE IF NOT EXISTS user_groups (
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  group_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, group_id)
);

-- Newsletter Subscriptions Table
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  source TEXT DEFAULT 'website',  -- homepage, blog, etc.
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- Error Logs Table (for monitoring and debugging)
CREATE TABLE IF NOT EXISTS error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  error_type TEXT NOT NULL,  -- api_error, auth_error, database_error, client_error
  error_message TEXT NOT NULL,
  error_stack TEXT,
  user_id TEXT,
  url TEXT,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Board Member Profiles Table
CREATE TABLE IF NOT EXISTS board_member_profiles (
  user_id TEXT PRIMARY KEY,
  rss_topic TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RSS Feed Subscriptions Table (supports multiple feeds per user)
CREATE TABLE IF NOT EXISTS rss_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  topic TEXT NOT NULL,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, topic)
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

-- Blog Posts Table (admin-created posts stored in database)
CREATE TABLE IF NOT EXISTS blog_posts (
  id TEXT PRIMARY KEY,  -- URL slug
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author_name TEXT NOT NULL DEFAULT 'Zack Edwards',
  author_avatar TEXT DEFAULT '/images/board/zack.png',
  author_role TEXT DEFAULT 'Content Creator',
  category TEXT NOT NULL DEFAULT 'Education',
  published_at TEXT NOT NULL,  -- Formatted date string
  read_time TEXT NOT NULL DEFAULT '1 min read',
  image_url TEXT DEFAULT '/images/fullLogo.jpeg',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Board Member Initiatives Table
CREATE TABLE IF NOT EXISTS board_initiatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id TEXT NOT NULL,  -- e.g., "zack-edwards", "michael-weaver"
  member_email TEXT NOT NULL,
  member_name TEXT NOT NULL,
  member_title TEXT NOT NULL,
  member_role TEXT NOT NULL,
  member_image TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  objectives TEXT[] NOT NULL,  -- Array of objective strings
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default users (board members)
INSERT INTO users (id, name, avatar) VALUES
  ('enjoyweaver@gmail.com', 'Michael Weaver', '/images/board/michael.png'),
  ('zack@xogosgaming.com', 'Zack Edwards', '/images/board/zack.png'),
  ('braden@kennyhertzperry.com', 'Braden Perry', '/images/board/braden.png'),
  ('terrence@terrencegatsby.com', 'Terrence Gatsby', '/images/board/terrence.png'),
  ('sturs49@gmail.com', 'Sean Sturtevant', '/images/board/sean.png'),
  ('mckaylaareece@gmail.com', 'McKayla Reece', '/images/board/mckayla.png')
ON CONFLICT (id) DO NOTHING;

-- Insert default user groups
INSERT INTO user_groups (user_id, group_id) VALUES
  ('enjoyweaver@gmail.com', 'board'),
  ('zack@xogosgaming.com', 'board'),
  ('braden@kennyhertzperry.com', 'board'),
  ('terrence@terrencegatsby.com', 'board'),
  ('sturs49@gmail.com', 'board'),
  ('mckaylaareece@gmail.com', 'board')
ON CONFLICT (user_id, group_id) DO NOTHING;

-- Insert default board member profiles
INSERT INTO board_member_profiles (user_id, rss_topic) VALUES
  ('enjoyweaver@gmail.com', 'blockchain technology'),
  ('zack@xogosgaming.com', 'education technology'),
  ('braden@kennyhertzperry.com', 'legal technology'),
  ('terrence@terrencegatsby.com', 'gaming industry'),
  ('sturs49@gmail.com', 'business news'),
  ('mckaylaareece@gmail.com', 'educational games')
ON CONFLICT (user_id) DO NOTHING;

-- NOTE: Default statistics and financials rows are NOT inserted automatically
-- They should only be created manually by authorized admins via the admin panel

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rss_subscriptions_user_id ON rss_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_checklist_user_id ON checklist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_checklist_created_at ON checklist_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_statistics_last_updated ON xogos_statistics(last_updated DESC);
CREATE INDEX IF NOT EXISTS idx_financials_last_updated ON xogos_financials(last_updated DESC);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribed_at ON newsletter_subscriptions(subscribed_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON error_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_type ON error_logs(error_type);
CREATE INDEX IF NOT EXISTS idx_user_groups_user_id ON user_groups(user_id);
CREATE INDEX IF NOT EXISTS idx_user_groups_group_id ON user_groups(group_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_board_initiatives_member_id ON board_initiatives(member_id);
CREATE INDEX IF NOT EXISTS idx_board_initiatives_member_email ON board_initiatives(member_email);
CREATE INDEX IF NOT EXISTS idx_board_initiatives_created_at ON board_initiatives(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_member_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rss_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE xogos_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE xogos_financials ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_initiatives ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all operations for now - you can restrict later)
DROP POLICY IF EXISTS "Allow all for authenticated users" ON users;
CREATE POLICY "Allow all for authenticated users" ON users FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for authenticated users" ON user_groups;
CREATE POLICY "Allow all for authenticated users" ON user_groups FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for authenticated users" ON newsletter_subscriptions;
CREATE POLICY "Allow all for authenticated users" ON newsletter_subscriptions FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for authenticated users" ON error_logs;
CREATE POLICY "Allow all for authenticated users" ON error_logs FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for authenticated users" ON board_member_profiles;
CREATE POLICY "Allow all for authenticated users" ON board_member_profiles FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for authenticated users" ON rss_subscriptions;
CREATE POLICY "Allow all for authenticated users" ON rss_subscriptions FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for authenticated users" ON checklist_items;
CREATE POLICY "Allow all for authenticated users" ON checklist_items FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for authenticated users" ON xogos_statistics;
CREATE POLICY "Allow all for authenticated users" ON xogos_statistics FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for authenticated users" ON xogos_financials;
CREATE POLICY "Allow all for authenticated users" ON xogos_financials FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for authenticated users" ON blog_posts;
CREATE POLICY "Allow all for authenticated users" ON blog_posts FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for authenticated users" ON board_initiatives;
CREATE POLICY "Allow all for authenticated users" ON board_initiatives FOR ALL USING (true);
