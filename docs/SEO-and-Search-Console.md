# SEO & Google Search Console – Akelapan

## What’s already in place

- **Sitemap:** `/sitemap.xml` (all published articles + static pages, Hindi & English)
- **robots.txt:** `/robots.txt` – allows crawlers, disallows `/admin/` and `/api/`, points to sitemap
- **Metadata:** Title template, description, keywords, Open Graph, Twitter cards on layout and article pages
- **Article SEO:** Each article uses `seo_title` and `seo_description` from DB when set; otherwise title and excerpt
- **Structured data:** Organization schema (global), Article schema (article pages), hreflang for Hindi/English
- **Canonical & hreflang:** Set on article pages for both languages

## Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console).
2. Add property: **URL prefix** → `https://akelapan.com` (or your production URL).
3. **Verification:** Choose “HTML tag”.
   - Copy the `content` value from the meta tag (e.g. `content="abc123..."`).
   - In `.env.local` (and production env) set:
     ```env
     NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=abc123...
     ```
   - Redeploy so the layout outputs the verification meta tag.
4. After verification: submit **Sitemap** → `https://akelapan.com/sitemap.xml`.
5. Use **URL Inspection** for important URLs; **Performance** and **Coverage** for indexing and queries.

## Keywords

- **Site-wide:** In `layout.tsx` metadata (loneliness, breakup, motivation, hindi, emotional support, mental health, relationships, life advice, अकेलापन, akelapan).
- **Per article:** `generateMetadata` adds category name + base keywords. For finer control, use **seo_title** and **seo_description** (and optional meta keywords in DB later) in admin.
- **Content:** Keep titles and excerpts clear and keyword-aware; use headings (H2/H3) and internal links to categories and related articles.

## Recommendations

1. Add a default **OG image** at `public/images/og-default.png` (e.g. 1200×630) so shares look good when an article has no featured image.
2. In Search Console, set **International targeting** if you focus on India (e.g. “India” or “Hindi”).
3. Monitor **Core Web Vitals** and fix any URLs that fail (layout and article pages are already optimized for LCP/CLS where possible).
4. Use **Structured data** (Article, Organization) – already present; you can add **BreadcrumbList** on article/category pages later for rich results.
5. Keep **sitemap** and **robots.txt** in sync with deployment (they are generated at build time).

## Sitemap ping (automatic)

When you **publish an article** from the admin (Edit article → Status: Published → Save), or when **auto-generate** publishes new articles, the app automatically pings **Google** and **Bing** with your sitemap URL. That asks them to re-crawl the sitemap sooner so new URLs can be discovered without waiting for the next scheduled crawl. No manual step needed.

## Env checklist (production)

- `NEXT_PUBLIC_SITE_URL` = production URL
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` = Search Console HTML tag content (optional but recommended)
