import { createClient } from "@/lib/supabase/server";
import type { Article, ArticleWithCategory, ArticleLanguage } from "./types";

export async function getPublishedArticleSlugs(
  limit = 5000,
  language: ArticleLanguage = "hi"
) {
  const supabase = await createClient();
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
  const supabase = await createClient();
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

  if (error) {
    console.error("Error fetching articles:", error);
    return [];
  }

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
        *,
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
export async function hasEnglishVersion(hindiSlug: string): Promise<boolean> {
  const hiArticle = await getArticleBySlug(hindiSlug, "hi");
  if (!hiArticle?.id) return false;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("id")
    .eq("original_id", hiArticle.id)
    .eq("status", "published")
    .eq("language", "en")
    .maybeSingle();
  return !error && !!data;
}

/** Get the English article slug for a Hindi article slug (for hreflang /en/articles/... link) */
export async function getEnglishVersionSlug(hindiSlug: string): Promise<string | null> {
  const hiArticle = await getArticleBySlug(hindiSlug, "hi");
  if (!hiArticle?.id) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("slug")
    .eq("original_id", hiArticle.id)
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
