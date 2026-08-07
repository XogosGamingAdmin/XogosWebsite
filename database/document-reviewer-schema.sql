-- ============================================================================
-- Document Reviewer
-- ============================================================================
-- Board-secured PDF review tool: board members read documents in-browser,
-- highlight phrases (max 100 chars) and attach comments (max 500 chars).
-- Others with access can reply to those comments.
--
-- RETENTION: highlights, comments, replies, and document metadata are retained
-- for 7 years. `retain_until` is stamped on every row at insert. Documents can
-- be HIDDEN (archived, reversible) rather than deleted. Hard deletes are
-- possible for admins but are recorded in document_deletion_log.
--
-- Run this in the Supabase SQL Editor.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Documents
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS board_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,

  -- Location in the private Supabase Storage bucket `board-documents`.
  -- The file is never served publicly; it is streamed through
  -- /api/documents/[id]/file after an auth check.
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  page_count INTEGER,

  uploaded_by_email TEXT NOT NULL,
  uploaded_by_name TEXT,

  -- Hide = archive. Reversible with one click; nothing is destroyed.
  is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
  hidden_at TIMESTAMP WITH TIME ZONE,
  hidden_by TEXT,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  -- 7-year retention policy
  retain_until TIMESTAMP WITH TIME ZONE NOT NULL
    DEFAULT (NOW() + INTERVAL '7 years')
);

CREATE INDEX IF NOT EXISTS idx_board_documents_hidden
  ON board_documents(is_hidden);
CREATE INDEX IF NOT EXISTS idx_board_documents_created_at
  ON board_documents(created_at DESC);

-- ----------------------------------------------------------------------------
-- Highlights (a selected phrase on a page)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS document_highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL
    REFERENCES board_documents(id) ON DELETE CASCADE,

  page_number INTEGER NOT NULL CHECK (page_number > 0),

  -- Hard cap enforced in the database, not just the UI
  highlighted_text TEXT NOT NULL
    CHECK (char_length(highlighted_text) > 0
       AND char_length(highlighted_text) <= 100),

  -- Normalized rectangles (0-1 relative to page size) so the highlight can be
  -- redrawn at any zoom level: [{ x, y, width, height }, ...]
  position JSONB,

  created_by_email TEXT NOT NULL,
  created_by_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  retain_until TIMESTAMP WITH TIME ZONE NOT NULL
    DEFAULT (NOW() + INTERVAL '7 years')
);

CREATE INDEX IF NOT EXISTS idx_document_highlights_document
  ON document_highlights(document_id);
CREATE INDEX IF NOT EXISTS idx_document_highlights_page
  ON document_highlights(document_id, page_number);

-- ----------------------------------------------------------------------------
-- Comments and replies
-- ----------------------------------------------------------------------------
-- A comment with parent_comment_id = NULL is the original comment on the
-- highlight. Any row with parent_comment_id set is a reply to that comment.
CREATE TABLE IF NOT EXISTS document_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  highlight_id UUID NOT NULL
    REFERENCES document_highlights(id) ON DELETE CASCADE,
  parent_comment_id UUID
    REFERENCES document_comments(id) ON DELETE CASCADE,

  comment_text TEXT NOT NULL
    CHECK (char_length(comment_text) > 0
       AND char_length(comment_text) <= 500),

  author_email TEXT NOT NULL,
  author_name TEXT,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  retain_until TIMESTAMP WITH TIME ZONE NOT NULL
    DEFAULT (NOW() + INTERVAL '7 years')
);

CREATE INDEX IF NOT EXISTS idx_document_comments_highlight
  ON document_comments(highlight_id);
CREATE INDEX IF NOT EXISTS idx_document_comments_parent
  ON document_comments(parent_comment_id);

-- ----------------------------------------------------------------------------
-- Deletion audit log
-- ----------------------------------------------------------------------------
-- Hard-deleting a document destroys its highlights and comments via CASCADE.
-- This log survives so there is a record that the document existed and who
-- removed it, which matters if the material was under a retention obligation.
CREATE TABLE IF NOT EXISTS document_deletion_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL,
  title TEXT NOT NULL,
  file_name TEXT,
  uploaded_by_email TEXT,
  document_created_at TIMESTAMP WITH TIME ZONE,
  retain_until TIMESTAMP WITH TIME ZONE,
  highlight_count INTEGER NOT NULL DEFAULT 0,
  comment_count INTEGER NOT NULL DEFAULT 0,
  deleted_by_email TEXT NOT NULL,
  deleted_by_name TEXT,
  deleted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  -- TRUE when the document was destroyed before its 7-year retention date
  deleted_before_retention BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_document_deletion_log_deleted_at
  ON document_deletion_log(deleted_at DESC);

-- ----------------------------------------------------------------------------
-- Storage bucket (create in the Supabase dashboard, or via the API)
-- ----------------------------------------------------------------------------
-- Bucket name: board-documents
-- Public:      NO  (must stay private -- files are streamed through the API
--                   after an auth check, never linked directly)
-- MIME types:  application/pdf
-- Size limit:  50 MB
