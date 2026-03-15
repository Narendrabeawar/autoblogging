# Step 6: Technical Setup

## Folder Structure

```
/app
  /articles
  /category
  /admin

/components
  /navbar
  /footer
  /article-card
  /seo

/lib
  /ai
  /db

/scripts
  /auto-publish
  /generate-article
```

## Performance

- **ISR (Incremental Static Regeneration)** – Next.js for fast pages
- **Image optimization** – Next/Image, WebP, lazy load
- **Edge caching** – Vercel Edge for global speed
- **Database connection pooling** – Supabase best practices

## Security & Compliance

- **Rate limiting** – Prevent API abuse
- **CORS** – Strict origin policy
- **Crisis content disclaimer** – "Not a substitute for professional help"
- **Cookie consent** – For EU/global compliance
- **Privacy policy** – Required for AdSense

## Monitoring

- **Error tracking** – Sentry or similar
- **Uptime monitoring** – UptimeRobot
- **Search Console** – Indexing status
- **Analytics** – GA4 + custom events

## Risk Mitigation

- **AI content detection** – Add human review for top 10% traffic articles
- **AdSense rejection** – Ensure quality, original structure, no thin content
- **Sensitive topics** – Crisis disclaimer, avoid self-harm triggers
- **Hindi font rendering** – Test Noto Sans Devanagari, ensure readability
- **API costs** – Set daily limits, use cheaper models for drafts

---

**Next:** [07-Automation-System.md](07-Automation-System.md)
