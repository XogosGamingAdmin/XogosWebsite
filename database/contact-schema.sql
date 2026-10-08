-- Contact Messages Table
-- Stores contact form submissions from the website

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  topic TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  replied_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Index for listing messages by date
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- Index for filtering by status
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
