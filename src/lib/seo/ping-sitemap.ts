const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://akelapan.com").replace(
  /\/$/,
  ""
);
const SITEMAP_URL = `${BASE}/sitemap.xml`;

/**
 * Notify Google and Bing that the sitemap was updated.
 * Call after publishing new content so crawlers re-fetch the sitemap sooner.
 * Fire-and-forget; errors are ignored.
 */
export async function pingSitemap(): Promise<void> {
  const encoded = encodeURIComponent(SITEMAP_URL);
  try {
    await Promise.all([
      fetch(`https://www.google.com/ping?sitemap=${encoded}`, { method: "GET" }),
      fetch(`https://www.bing.com/ping?sitemap=${encoded}`, { method: "GET" }),
    ]);
  } catch {
    // Non-blocking
  }
}
