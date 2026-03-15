import { createClient } from "@/lib/supabase/server";
import { pingSitemap } from "@/lib/seo/ping-sitemap";

/**
 * POST — Ping Google and Bing that the sitemap was updated.
 * Call after publishing an article so crawlers re-fetch the sitemap sooner.
 * Requires authenticated admin.
 */
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await pingSitemap();
  return Response.json({ ok: true });
}
