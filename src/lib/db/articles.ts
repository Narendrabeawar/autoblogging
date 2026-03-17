import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Article, ArticleWithCategory, ArticleLanguage } from "./types";

function createStaticSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing Supabase env. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local"
    );
  }
  return createSupabaseClient(url, key);
}

export async function getPublishedArticleSlugs(
  limit = 5000,
  language: ArticleLanguage = "hi"
) {
  const supabase = createStaticSupabase();
  const { data, error } = await supabase
    .from("articles")
    .select("slug, published_at, language")
    .eq("status", "published")
    .eq("language", language)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return (data ?? []).map((r) => ({
    slug: r.slug,
    published_at: r.published_at,
    language: (r.language as ArticleLanguage) ?? "hi",
  }));
}

export async function getPublishedArticleSlugsAllLanguages(limit = 5000) {
  const supabase = createStaticSupabase();
  const { data, error } = await supabase
    .from("articles")
    .select("slug, published_at, language")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return (data ?? []).map((r) => ({
    slug: r.slug,
    published_at: r.published_at,
    language: (r.language as ArticleLanguage) ?? "hi",
  }));
}

export async function getPublishedArticles(
  limit = 50,
  language: ArticleLanguage = "hi"
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select(
      `
      id,
      title,
      slug,
      excerpt,
      featured_image,
      published_at,
      status,
      language,
      categories (
        id,
        name,
        slug
      )
    `
    )
    .eq("status", "published")
    .eq("language", language)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) return [];

  const getCat = (c: unknown) =>
    Array.isArray(c) ? c[0] : c;

  return (data ?? []).map((row) => {
    const cat = getCat(row.categories);
    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt ?? "",
      category: (cat as { name?: string })?.name ?? "Uncategorized",
      categorySlug: (cat as { slug?: string })?.slug ?? "uncategorized",
      featuredImage: row.featured_image,
      publishedAt: row.published_at,
    };
  });
}

/** Shuffle array in place (Fisher–Yates). */
function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** All (or many) published articles for hero ticker, shuffled randomly. */
export async function getHeroTickerArticles(
  limit = 80,
  language: ArticleLanguage = "hi"
): Promise<{ title: string; slug: string; featuredImage: string | null }[]> {
  const articles = await getPublishedArticles(limit, language);
  return shuffle(articles).map((a) => ({
    title: a.title,
    slug: a.slug,
    featuredImage: a.featuredImage ?? null,
  }));
}

export async function getArticleBySlug(
  slug: string,
  language: ArticleLanguage = "hi"
) {
  const supabase = await createClient();

  const trySlug = async (s: string) => {
    const { data, error } = await supabase
      .from("articles")
      .select(
        `
        id,
        title,
        slug,
        content,
        excerpt,
        seo_title,
        seo_description,
        featured_image,
        published_at,
        status,
        language,
        category_id,
        categories (
          id,
          name,
          slug
        )
      `
      )
      .eq("slug", s)
      .eq("status", "published")
      .eq("language", language)
      .single();
    return { data, error };
  };

  let result = await trySlug(slug);
  if (result.error && slug.includes("%")) {
    try {
      result = await trySlug(decodeURIComponent(slug));
    } catch {
      /* keep original result */
    }
  }

  const { data, error } = result;
  if (error || !data) return null;

  const cat = Array.isArray(data.categories) ? data.categories[0] : data.categories;
  return {
    ...data,
    category: (cat as { name?: string })?.name ?? "Uncategorized",
    categorySlug: (cat as { slug?: string })?.slug ?? "uncategorized",
  };
}

/** Check if an English version exists for this Hindi article slug (by original_id) */
export async function hasEnglishVersion(
  hindiArticleId: string | null | undefined
): Promise<boolean> {
  if (!hindiArticleId) return false;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("id")
    .eq("original_id", hindiArticleId)
    .eq("status", "published")
    .eq("language", "en")
    .maybeSingle();
  return !error && !!data;
}

/** Get the English article slug for a Hindi article slug (for hreflang /en/articles/... link) */
export async function getEnglishVersionSlug(
  hindiArticleId: string | null | undefined
): Promise<string | null> {
  if (!hindiArticleId) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("slug")
    .eq("original_id", hindiArticleId)
    .eq("status", "published")
    .eq("language", "en")
    .maybeSingle();
  return !error && data?.slug ? data.slug : null;
}

/** Get the Hindi article slug for an English article slug (for hreflang /articles/... link) */
export async function getHindiVersionSlug(englishSlug: string): Promise<string | null> {
  const enArticle = await getArticleBySlug(englishSlug, "en");
  if (!enArticle?.original_id) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("slug")
    .eq("id", enArticle.original_id)
    .eq("status", "published")
    .eq("language", "hi")
    .maybeSingle();
  return !error && data?.slug ? data.slug : null;
}

export async function getArticlesByCategorySlug(
  categorySlug: string,
  limit = 50,
  language: ArticleLanguage = "hi"
) {
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .single();

  if (!category) return { articles: [], category: null };

  const { data, error } = await supabase
    .from("articles")
    .select(
      `
      id,
      title,
      slug,
      excerpt,
      featured_image,
      published_at,
      categories (
        name,
        slug
      )
    `
    )
    .eq("category_id", category.id)
    .eq("status", "published")
    .eq("language", language)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) return { articles: [], category: null };

  const getCat = (c: unknown) => (Array.isArray(c) ? c[0] : c);

  return {
    articles: (data ?? []).map((row) => {
      const cat = getCat(row.categories);
      return {
        title: row.title,
        slug: row.slug,
        excerpt: row.excerpt ?? "",
        category: (cat as { name?: string })?.name ?? "Uncategorized",
        categorySlug: (cat as { slug?: string })?.slug ?? categorySlug,
        featuredImage: row.featured_image,
        publishedAt: row.published_at,
      };
    }),
    category: { slug: categorySlug },
  };
}

export async function getRelatedArticles(
  excludeSlug: string,
  categoryId: string | null,
  limit = 5,
  language: ArticleLanguage = "hi"
) {
  const supabase = await createClient();

  let query = supabase
    .from("articles")
    .select(
      `
      id,
      title,
      slug,
      excerpt,
      featured_image,
      published_at,
      categories (
        name,
        slug
      )
    `
    )
    .neq("slug", excludeSlug)
    .eq("status", "published")
    .eq("language", language)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data, error } = await query;

  if (error) return [];

  const getCat = (c: unknown) => (Array.isArray(c) ? c[0] : c);

  return (data ?? []).map((row) => {
    const cat = getCat(row.categories);
    return {
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt ?? "",
      category: (cat as { name?: string })?.name ?? "Uncategorized",
      categorySlug: (cat as { slug?: string })?.slug ?? "uncategorized",
      featuredImage: row.featured_image,
      publishedAt: row.published_at,
    };
  });
}
