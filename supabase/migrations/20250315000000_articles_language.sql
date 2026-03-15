-- SEO-friendly bilingual: language + original_id for hi/en article pairs
ALTER TABLE articles ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'hi';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS original_id UUID REFERENCES articles(id);

-- Allow same slug for different languages: unique(slug, language)
ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_slug_key;
CREATE UNIQUE INDEX IF NOT EXISTS idx_articles_slug_language ON articles(slug, language);

CREATE INDEX IF NOT EXISTS idx_articles_language ON articles(language);
