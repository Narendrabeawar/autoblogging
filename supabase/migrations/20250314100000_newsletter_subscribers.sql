-- Newsletter subscribers table for Phase 3
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  preferences JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

-- Allow anyone to subscribe (insert), only service role can read
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON newsletter_subscribers
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Service role can read all" ON newsletter_subscribers
  FOR SELECT TO service_role USING (true);

-- Allow authenticated users (admins) to read for dashboard
CREATE POLICY "Authenticated can read subscribers" ON newsletter_subscribers
  FOR SELECT TO authenticated USING (true);
