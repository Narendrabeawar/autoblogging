-- ============================================
-- Akelapan: Full Database Migration
-- Run this in Supabase SQL Editor for fresh setup
-- ============================================

-- --------------------------------------------
-- 1. Initial Schema
-- --------------------------------------------

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  parent_id UUID REFERENCES categories(id),
  icon TEXT,
  color TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  category_id UUID REFERENCES categories(id),
  tags TEXT[] DEFAULT '{}',
  featured_image TEXT,
  seo_title TEXT,
  seo_description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  article_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Articles: bilingual SEO (language + original_id)
ALTER TABLE articles ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'hi';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS original_id UUID REFERENCES articles(id);
ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_slug_key;
CREATE UNIQUE INDEX IF NOT EXISTS idx_articles_slug_language ON articles(slug, language);
CREATE INDEX IF NOT EXISTS idx_articles_language ON articles(language);

INSERT INTO categories (name, slug, icon, sort_order) VALUES
  ('Loneliness', 'loneliness', '💭', 1),
  ('Breakup', 'breakup', '💔', 2),
  ('Relationships', 'relationships', '❤️', 3),
  ('Friendship', 'friendship', '🤝', 4),
  ('Self Improvement', 'self-improvement', '🌱', 5),
  ('Mental Strength', 'mental-strength', '💪', 6),
  ('Motivation', 'motivation', '✨', 7),
  ('Life Advice', 'life-advice', '📖', 8)
ON CONFLICT (slug) DO NOTHING;

-- --------------------------------------------
-- 2. Newsletter Subscribers (Phase 3)
-- --------------------------------------------

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  preferences JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

DO $$ BEGIN
  IF NOT (SELECT relrowsecurity FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'newsletter_subscribers' AND n.nspname = 'public') THEN
    ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DROP POLICY IF EXISTS "Allow public insert" ON newsletter_subscribers;
CREATE POLICY "Allow public insert" ON newsletter_subscribers
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can read all" ON newsletter_subscribers;
CREATE POLICY "Service role can read all" ON newsletter_subscribers
  FOR SELECT TO service_role USING (true);

DROP POLICY IF EXISTS "Authenticated can read subscribers" ON newsletter_subscribers;
CREATE POLICY "Authenticated can read subscribers" ON newsletter_subscribers
  FOR SELECT TO authenticated USING (true);

-- --------------------------------------------
-- 3. Article Analytics
-- --------------------------------------------

CREATE TABLE IF NOT EXISTS article_analytics (
  article_id UUID PRIMARY KEY REFERENCES articles(id) ON DELETE CASCADE,
  view_count INT DEFAULT 0,
  last_viewed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_article_analytics_view_count ON article_analytics(view_count DESC);

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

GRANT EXECUTE ON FUNCTION increment_article_view(UUID) TO anon;
GRANT EXECUTE ON FUNCTION increment_article_view(UUID) TO authenticated;

DO $$ BEGIN
  IF NOT (SELECT relrowsecurity FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'article_analytics' AND n.nspname = 'public') THEN
    ALTER TABLE article_analytics ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DROP POLICY IF EXISTS "Authenticated can read analytics" ON article_analytics;
CREATE POLICY "Authenticated can read analytics" ON article_analytics
  FOR SELECT TO authenticated USING (true);

-- --------------------------------------------
-- 4. User Stories (Phase 4)
-- --------------------------------------------

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

DO $$ BEGIN
  IF NOT (SELECT relrowsecurity FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'user_stories' AND n.nspname = 'public') THEN
    ALTER TABLE user_stories ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DROP POLICY IF EXISTS "Public can read approved stories" ON user_stories;
CREATE POLICY "Public can read approved stories" ON user_stories
  FOR SELECT USING (status = 'approved');

DROP POLICY IF EXISTS "Anyone can submit story" ON user_stories;
CREATE POLICY "Anyone can submit story" ON user_stories
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated admin can manage all stories" ON user_stories;
CREATE POLICY "Authenticated admin can manage all stories" ON user_stories
  FOR ALL USING (auth.role() = 'authenticated');

-- --------------------------------------------
-- 5. Quizzes (Phase 4)
-- --------------------------------------------

CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  result_intro TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  options JSONB NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  answers JSONB NOT NULL DEFAULT '{}',
  result_type TEXT,
  result_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_quiz ON quiz_results(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_slug ON quizzes(slug);

DO $$ BEGIN
  IF NOT (SELECT relrowsecurity FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'quizzes' AND n.nspname = 'public') THEN
    ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
  END IF;
  IF NOT (SELECT relrowsecurity FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'quiz_questions' AND n.nspname = 'public') THEN
    ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
  END IF;
  IF NOT (SELECT relrowsecurity FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relname = 'quiz_results' AND n.nspname = 'public') THEN
    ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DROP POLICY IF EXISTS "Public can read quizzes" ON quizzes;
CREATE POLICY "Public can read quizzes" ON quizzes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read quiz_questions" ON quiz_questions;
CREATE POLICY "Public can read quiz_questions" ON quiz_questions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can submit quiz result" ON quiz_results;
CREATE POLICY "Anyone can submit quiz result" ON quiz_results FOR INSERT WITH CHECK (true);

INSERT INTO quizzes (id, title, slug, description, result_intro, sort_order) VALUES
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'अकेलेपन का आकलन',
    'loneliness-assessment',
    'यह छोटा assessment आपको अपनी emotional state समझने में मदद करेगा। सभी सवालों के ईमानदार जवाब दें।',
    'आपके जवाबों के आधार पर यहाँ आपकी स्थिति का संक्षिप्त विश्लेषण है। याद रखें: यह पेशेवर निदान नहीं है।',
    1
  )
ON CONFLICT (slug) DO NOTHING;

INSERT INTO quiz_questions (quiz_id, question_text, sort_order, options)
SELECT * FROM (VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid, 'आपको कितनी बार लगता है कि आप किसी के करीब नहीं हैं?', 1, '[
    {"value": "1", "label": "कभी नहीं", "score": 0},
    {"value": "2", "label": "कभी-कभी", "score": 1},
    {"value": "3", "label": "अक्सर", "score": 2},
    {"value": "4", "label": "हमेशा", "score": 3}
  ]'::jsonb),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid, 'क्या आपको अपनी feelings share करने के लिए कोई मिलता है?', 2, '[
    {"value": "1", "label": "हाँ, आसानी से", "score": 0},
    {"value": "2", "label": "कभी-कभी", "score": 1},
    {"value": "3", "label": "शायद ही कभी", "score": 2},
    {"value": "4", "label": "नहीं, किसी के साथ नहीं", "score": 3}
  ]'::jsonb),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid, 'आप अपने दिन के बारे में कैसा महसूस करते हैं?', 3, '[
    {"value": "1", "label": "संतुष्ट और खुश", "score": 0},
    {"value": "2", "label": "ठीक-ठाक", "score": 1},
    {"value": "3", "label": "खाली या उदास", "score": 2},
    {"value": "4", "label": "बहुत अकेला", "score": 3}
  ]'::jsonb),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'क्या आपको लगता है कि लोग आपको समझते हैं?', 4, '[
    {"value": "1", "label": "हाँ, पूरी तरह", "score": 0},
    {"value": "2", "label": "कुछ हद तक", "score": 1},
    {"value": "3", "label": "बहुत कम", "score": 2},
    {"value": "4", "label": "बिल्कुल नहीं", "score": 3}
  ]'::jsonb),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid, 'आप अपने social connections से कितने संतुष्ट हैं?', 5, '[
    {"value": "1", "label": "बहुत संतुष्ट", "score": 0},
    {"value": "2", "label": "संतुष्ट", "score": 1},
    {"value": "3", "label": "कम संतुष्ट", "score": 2},
    {"value": "4", "label": "बिल्कुल संतुष्ट नहीं", "score": 3}
  ]'::jsonb)
) AS v(quiz_id, question_text, sort_order, options)
WHERE NOT EXISTS (SELECT 1 FROM quiz_questions WHERE quiz_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid);
