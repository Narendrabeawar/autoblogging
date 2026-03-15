# Akelapan.com

आपके अकेलेपन में आपका साथ — Emotional support content platform in Hindi.

## Tech Stack

- **Next.js 16** with App Router
- **Tailwind CSS v4**
- **shadcn/ui** (Button, Card)
- **Framer Motion** for animations
- **Supabase** (PostgreSQL, Auth)
- **pnpm** package manager

## Getting Started

```bash
# Install dependencies
pnpm install

# Copy env and add your Supabase credentials
cp .env.example .env.local

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── articles/     # Article listing & detail
│   ├── category/     # Category pages
│   ├── about/
│   └── contact/
├── components/
│   ├── layout/      # Navbar, Footer, Container, SectionHeader
│   ├── article/     # ArticleCard, CategoryCard, CategoryBadge
│   └── ui/          # Button, Card, AnimatedContainer
├── lib/
│   ├── constants.ts
│   ├── utils.ts
│   └── supabase/    # Supabase client (server & browser)
docs/
└── plans/           # Step-by-step plan (01-10)
```

## Database Setup

A Supabase project **akelapan** is already created. Credentials are in `.env.local`.

To add sample articles, run this in Supabase SQL Editor (Dashboard → SQL Editor):

```sql
INSERT INTO articles (title, slug, content, excerpt, category_id, status, published_at)
SELECT 'अकेलेपन से कैसे निपटें', 'akelapan-se-kaise-nipte',
  '<p>Content here...</p>', 'Excerpt', c.id, 'published', NOW()
FROM categories c WHERE c.slug = 'loneliness'
ON CONFLICT (slug) DO NOTHING;
```

## Theme

Warm, calming emotional support palette:

- **Primary**: Soft teal (hope, calm)
- **Secondary**: Warm lavender (comfort)
- **Accent**: Soft amber (warmth)

## Admin Panel

1. Go to `/admin/login`
2. Sign up with email/password
3. In Supabase Dashboard → Authentication → Providers, ensure Email is enabled
4. For dev: disable "Confirm email" in Auth settings to skip verification
5. Create and manage articles at `/admin/articles`

## Phase 2: AI Automation

### Generate Articles

1. Add `GEMINI_API_KEY` to `.env.local` (from [Google AI Studio](https://aistudio.google.com/apikey))
2. **From Admin**: Go to `/admin/articles/generate`, enter topic, click Generate
3. **From CLI**:
   - `pnpm run generate "अकेलेपन से कैसे निपटें"` — specific topic
   - `pnpm run generate` — random topic from calendar
4. **Batch**: `pnpm run auto-publish 5` — generate 5 articles (draft)
   - Set `AUTO_PUBLISH=true` to publish immediately
   - Use `SUPABASE_SERVICE_KEY` for CLI (bypasses RLS)

### Image Generation

Optional: Check "Generate featured image" when generating — uses Imagen 4 (extra cost). Images stored as base64 data URL.

## Next Steps

See [docs/plans/](docs/plans/) for the full implementation plan.
