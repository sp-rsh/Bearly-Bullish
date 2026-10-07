CREATE TABLE IF NOT EXISTS comments (
  id BIGSERIAL PRIMARY KEY,
  article_slug TEXT NOT NULL,
  display_name VARCHAR(80) NOT NULL,
  body VARCHAR(2000) NOT NULL,
  parent_comment_id BIGINT REFERENCES comments(id) ON DELETE CASCADE,
  status VARCHAR(16) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS comments_article_status_created_idx
  ON comments (article_slug, status, created_at DESC);
