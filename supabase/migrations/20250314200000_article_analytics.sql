-- Article analytics for view tracking
CREATE TABLE IF NOT EXISTS article_analytics (
  article_id UUID PRIMARY KEY REFERENCES articles(id) ON DELETE CASCADE,
  view_count INT DEFAULT 0,
  last_viewed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_article_analytics_view_count ON article_analytics(view_count DESC);

-- Allow anon to increment views (article page is public)
-- Use a function for atomic increment
CREATE OR REPLACE FUNCTION increment_article_view(p_article_id UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO article_analytics (article_id, view_count, last_viewed_at)
  VALUES (p_article_id, 1, NOW())
  ON CONFLICT (article_id) DO UPDATE SET
    view_count = article_analytics.view_count + 1,
    last_viewed_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Allow anon to call the function (for public article views)
GRANT EXECUTE ON FUNCTION increment_article_view(UUID) TO anon;
GRANT EXECUTE ON FUNCTION increment_article_view(UUID) TO authenticated;

-- Allow authenticated (admins) to read analytics
ALTER TABLE article_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read analytics" ON article_analytics
  FOR SELECT TO authenticated USING (true);
