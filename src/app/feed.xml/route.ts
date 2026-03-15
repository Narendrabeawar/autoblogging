import { getPublishedArticles } from "@/lib/db/articles";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://akelapan.com";

export async function GET() {
  const articles = await getPublishedArticles(50);

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Akelapan | Emotional Support in Hindi</title>
    <link>${BASE_URL}</link>
    <description>आपके अकेलेपन में आपका साथ। Loneliness, breakup, motivation और life advice हिंदी में।</description>
    <language>hi</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${articles
      .map(
        (a) => `
    <item>
      <title><![CDATA[${escapeXml(a.title)}]]></title>
      <link>${BASE_URL}/articles/${encodeURIComponent(a.slug)}</link>
      <description><![CDATA[${escapeXml(a.excerpt)}]]></description>
      <pubDate>${a.publishedAt ? new Date(a.publishedAt).toUTCString() : new Date().toUTCString()}</pubDate>
      <guid isPermaLink="true">${BASE_URL}/articles/${encodeURIComponent(a.slug)}</guid>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
