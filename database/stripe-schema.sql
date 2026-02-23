-- ================================================
-- STRIPE INTEGRATION TABLES FOR FINANCIAL DASHBOARD
-- ================================================
-- Run this SQL in your Supabase SQL editor to create
-- the tables needed for Stripe webhook integration.
-- ================================================

-- Stripe Events Table (logs all webhook events)
CREATE TABLE IF NOT EXISTS stripe_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB,
  processed BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stripe Customers Table
CREATE TABLE IF NOT EXISTS stripe_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_customer_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stripe Subscriptions Table
CREATE TABLE IF NOT EXISTS stripe_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL REFERENCES stripe_customers(stripe_customer_id) ON DELETE CASCADE,
  stripe_price_id TEXT,
  subscription_type TEXT NOT NULL CHECK (subscription_type IN ('monthly', 'yearly', 'lifetime')),
  status TEXT NOT NULL, -- active, canceled, past_due, unpaid, trialing, etc.
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stripe Payments Table
CREATE TABLE IF NOT EXISTS stripe_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_customer_id TEXT NOT NULL,
  stripe_invoice_id TEXT UNIQUE NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  currency TEXT DEFAULT 'usd',
  paid_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_stripe_events_type ON stripe_events(event_type);
CREATE INDEX IF NOT EXISTS idx_stripe_events_created_at ON stripe_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stripe_customers_email ON stripe_customers(email);
CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_customer ON stripe_subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_status ON stripe_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_type ON stripe_subscriptions(subscription_type);
CREATE INDEX IF NOT EXISTS idx_stripe_payments_customer ON stripe_payments(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_stripe_payments_paid_at ON stripe_payments(paid_at DESC);

-- Enable Row Level Security
ALTER TABLE stripe_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_payments ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now - server-side access only)
DROP POLICY IF EXISTS "Allow all for authenticated users" ON stripe_events;
CREATE POLICY "Allow all for authenticated users" ON stripe_events FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for authenticated users" ON stripe_customers;
CREATE POLICY "Allow all for authenticated users" ON stripe_customers FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for authenticated users" ON stripe_subscriptions;
CREATE POLICY "Allow all for authenticated users" ON stripe_subscriptions FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for authenticated users" ON stripe_payments;
CREATE POLICY "Allow all for authenticated users" ON stripe_payments FOR ALL USING (true);

-- ================================================
-- AFTER RUNNING THIS SQL:
-- 1. Go to your Stripe Dashboard
-- 2. Navigate to Developers > Webhooks
-- 3. Add endpoint: https://www.histronics.com/api/stripe-webhook
-- 4. Select these events:
--    - customer.created
--    - customer.updated
--    - customer.deleted
--    - customer.subscription.created
--    - customer.subscription.updated
--    - customer.subscription.deleted
--    - invoice.paid
--    - invoice.payment_failed
-- 5. Copy the webhook signing secret
-- 6. Add to AWS Amplify Environment Variables:
--    - STRIPE_SECRET_KEY=sk_live_... (your Stripe secret key)
--    - STRIPE_WEBHOOK_SECRET=whsec_... (webhook signing secret)
-- ================================================
