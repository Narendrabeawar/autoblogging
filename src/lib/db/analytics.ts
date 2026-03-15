import { createClient } from "@/lib/supabase/server";
import type { ArticleLanguage } from "./types";

export async function getAnalyticsStats() {
  const supabase = await createClient();

  const [articlesRes, newsletterRes, analyticsRes] = await Promise.all([
    supabase.from("articles").select("id, status", { count: "exact", head: true }),
    supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
    supabase
      .from("article_analytics")
      .select("article_id, view_count")
      .order("view_count", { ascending: false })
      .limit(100),
  ]);

  const totalArticles = articlesRes.count ?? 0;
  const publishedRes = await supabase
    .from("articles")
    .select("id", { count: "exact", head: true })
    .eq("status", "published");
  const publishedArticles = publishedRes.count ?? 0;
  const newsletterCount = newsletterRes.count ?? 0;

  const totalViews = (analyticsRes.data ?? []).reduce((sum, r) => sum + (r.view_count ?? 0), 0);

  return {
    totalArticles,
    publishedArticles,
    newsletterCount,
    totalViews,
    topArticleIds: (analyticsRes.data ?? []).map((r) => r.article_id),
  };
}

export async function getTopArticlesByViews(
  limit = 10,
  language: ArticleLanguage = "hi"
) {
  const supabase = await createClient();

  const { data: analytics } = await supabase
    .from("article_analytics")
    .select("article_id, view_count")
    .order("view_count", { ascending: false })
    .limit(limit);

  if (!analytics?.length) return [];

  const ids = analytics.map((a) => a.article_id);
  const { data: articles } = await supabase
    .from("articles")
    .select(
      `
      id,
      title,
      slug,
      published_at,
      categories (name, slug)
    `
    )
    .in("id", ids)
    .eq("status", "published")
    .eq("language", language);

  const viewMap = Object.fromEntries(analytics.map((a) => [a.article_id, a.view_count ?? 0]));
  const ordered = (articles ?? [])
    .sort((a, b) => (viewMap[b.id] ?? 0) - (viewMap[a.id] ?? 0))
    .map((a) => {
      const cat = Array.isArray(a.categories) ? a.categories[0] : a.categories;
      return {
        id: a.id,
        title: a.title,
        slug: a.slug,
        published_at: a.published_at,
        category: (cat as { name?: string })?.name ?? "—",
        views: viewMap[a.id] ?? 0,
      };
    });

  return ordered;
}
