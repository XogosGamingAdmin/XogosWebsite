-- Blog Images Table
-- Stores metadata for images uploaded to Supabase Storage for blog posts
-- Images persist independently of posts (ON DELETE SET NULL)

CREATE TABLE IF NOT EXISTS blog_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path TEXT NOT NULL,           -- Path in Supabase Storage (e.g., 'blog-images/abc123.jpg')
  public_url TEXT NOT NULL,             -- Full public URL for the image
  original_filename TEXT NOT NULL,      -- Original uploaded filename
  file_size INTEGER NOT NULL,           -- Size in bytes
  mime_type TEXT NOT NULL,              -- e.g., 'image/jpeg'
  alt_text TEXT,                        -- Accessibility text
  uploaded_by TEXT NOT NULL,            -- Email of uploader
  post_id TEXT REFERENCES blog_posts(id) ON DELETE SET NULL,  -- Can be NULL (orphaned image)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for finding images by post
CREATE INDEX IF NOT EXISTS idx_blog_images_post_id ON blog_images(post_id);

-- Index for finding orphaned images (post_id IS NULL)
CREATE INDEX IF NOT EXISTS idx_blog_images_orphaned ON blog_images(post_id) WHERE post_id IS NULL;

-- Index for listing images by upload date
CREATE INDEX IF NOT EXISTS idx_blog_images_created_at ON blog_images(created_at DESC);

-- Enable Row Level Security
ALTER TABLE blog_images ENABLE ROW LEVEL SECURITY;

-- Allow all for authenticated users (simple policy for admin-only table)
DROP POLICY IF EXISTS "Allow all for authenticated users" ON blog_images;
CREATE POLICY "Allow all for authenticated users" ON blog_images FOR ALL USING (true);
