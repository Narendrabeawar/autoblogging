-- User Stories: Community spotlights with consent & moderation
CREATE TABLE IF NOT EXISTS user_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_name TEXT,
  author_display TEXT DEFAULT 'Anonymous',
  consent_given BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  theme TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  admin_notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_user_stories_status ON user_stories(status);
CREATE INDEX IF NOT EXISTS idx_user_stories_published ON user_stories(published_at) WHERE status = 'approved';

-- RLS: Allow public read of approved stories, allow insert for submissions
ALTER TABLE user_stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read approved stories" ON user_stories
  FOR SELECT USING (status = 'approved');
CREATE POLICY "Anyone can submit story" ON user_stories
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated admin can manage all stories" ON user_stories
  FOR ALL USING (auth.role() = 'authenticated');
