-- ================================================
-- MANUAL ENTRIES TABLES FOR FINANCIAL DASHBOARD
-- ================================================
-- Run this SQL in your Supabase SQL editor to create
-- tables for manually entered members and revenue.
-- ================================================

-- Manual Members Table
CREATE TABLE IF NOT EXISTS manual_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_type TEXT NOT NULL CHECK (member_type IN ('monthly', 'yearly', 'lifetime')),
  count INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Manual Revenue Table
CREATE TABLE IF NOT EXISTS manual_revenue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount NUMERIC(12, 2) NOT NULL,
  currency TEXT DEFAULT 'usd',
  description TEXT,
  revenue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_manual_members_type ON manual_members(member_type);
CREATE INDEX IF NOT EXISTS idx_manual_members_date ON manual_members(entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_manual_revenue_date ON manual_revenue(revenue_date DESC);

-- Enable Row Level Security
ALTER TABLE manual_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE manual_revenue ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Allow all for authenticated users" ON manual_members;
CREATE POLICY "Allow all for authenticated users" ON manual_members FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for authenticated users" ON manual_revenue;
CREATE POLICY "Allow all for authenticated users" ON manual_revenue FOR ALL USING (true);
