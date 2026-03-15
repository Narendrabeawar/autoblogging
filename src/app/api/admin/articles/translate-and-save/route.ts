import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getArticleBySlug } from "@/lib/db/articles";
import { translateArticleToEnglish } from "@/lib/ai/translate-article";
import { slugifyEnglish } from "@/lib/slugify";

/**
 * POST { slug: string }
 * Translates the Hindi article (by slug) to English and saves as a new row
 * with SEO-friendly English slug from English title, language='en', original_id=Hindi article id.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  if (!slug) {
    return Response.json({ error: "Missing slug" }, { status: 400 });
  }

  const article = await getArticleBySlug(slug, "hi");
  if (!article) {
    return Response.json(
      { error: "Hindi article not found for this slug" },
      { status: 404 }
    );
  }

  const existingByOriginalId = await supabase
    .from("articles")
    .select("id")
    .eq("original_id", article.id)
    .eq("language", "en")
    .maybeSingle();
  if (existingByOriginalId.data) {
    return Response.json(
      { error: "English version already exists for this article" },
      { status: 409 }
    );
  }

  if (!process.env.GEMINI_API_KEY) {
    return Response.json(
      { error: "GEMINI_API_KEY is not configured" },
      { status: 500 }
    );
  }

  try {
    const translated = await translateArticleToEnglish(
      article.title,
      article.content,
      article.excerpt
    );

    let enSlug = slugifyEnglish(translated.title) || "article";
    if (!enSlug) enSlug = "article";
    const { data: existingSlug } = await supabase
      .from("articles")
      .select("id")
      .eq("slug", enSlug)
      .eq("language", "en")
      .maybeSingle();
    if (existingSlug) {
      enSlug = `${enSlug}-${Date.now().toString(36).slice(-6)}`;
    }

    const isPublished = article.status === "published";
    const { error } = await supabase.from("articles").insert({
      title: translated.title,
      slug: enSlug,
      content: translated.content,
      excerpt: translated.excerpt ?? null,
      seo_title: translated.seo_title ?? null,
      seo_description: translated.seo_description ?? null,
      category_id: article.category_id,
      status: isPublished ? "published" : "draft",
      published_at: isPublished ? new Date().toISOString() : null,
      tags: article.tags ?? [],
      featured_image: article.featured_image,
      language: "en",
      original_id: article.id,
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({
      success: true,
      slug: enSlug,
      title: translated.title,
      language: "en",
      message: isPublished
        ? "English version saved and published."
        : "English version saved as draft.",
    });
  } catch (err) {
    console.error("Translate and save error:", err);
    return Response.json(
      {
        error:
          err instanceof Error ? err.message : "Translation failed",
      },
      { status: 500 }
    );
  }
}
