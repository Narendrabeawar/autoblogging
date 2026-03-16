import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { generateArticle } from "@/lib/ai/article-generator";
import { generateArticleImage } from "@/lib/ai/image-generator";
import { translateArticleToEnglish } from "@/lib/ai/translate-article";
import { slugifyEnglish } from "@/lib/slugify";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const topic = body.topic?.trim();
  const categorySlug = body.categorySlug ?? "loneliness";
  const language =
    body.language === "both" ? "both" : body.language === "en" ? "en" : "hi";
  const autoPublish = body.autoPublish === true;
  const targetWords =
    typeof body.targetWords === "number"
      ? body.targetWords
      : body.targetWords
      ? parseInt(String(body.targetWords), 10)
      : undefined;

  if (!topic) {
    return NextResponse.json(
      { error: "Topic is required" },
      { status: 400 }
    );
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY not configured" },
      { status: 500 }
    );
  }

  const categoryNames: Record<string, string> = {
    loneliness: "Loneliness",
    breakup: "Breakup",
    relationships: "Relationships",
    friendship: "Friendship",
    "self-improvement": "Self Improvement",
    "mental-strength": "Mental Strength",
    motivation: "Motivation",
    "life-advice": "Life Advice",
  };

  try {
    const genLang = language === "both" ? "hi" : language;
    const article = await generateArticle(
      topic,
      categoryNames[categorySlug] ?? "Loneliness",
      genLang,
      targetWords
    );

    if (!article) {
      return NextResponse.json(
        { error: "Failed to generate article" },
        { status: 500 }
      );
    }

    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();

    const baseSlug =
      article.slug || slugifyEnglish(article.title) || "article";
    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    let featuredImage: string | null = null;
    if (body.generateImage) {
      featuredImage =
        (await generateArticleImage(article.title, "hope")) ?? null;
    }

    const nowIso = new Date().toISOString();
    const { data: inserted, error } = await supabase
      .from("articles")
      .insert({
        title: article.title,
        slug,
        content: article.content,
        excerpt: article.excerpt,
        seo_title: article.seo_title,
        seo_description: article.seo_description,
        category_id: category?.id ?? null,
        status: autoPublish ? "published" : "draft",
        published_at: autoPublish ? nowIso : null,
        tags: [],
        featured_image: featuredImage,
        language: language === "both" ? "hi" : language,
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (language === "both") {
      try {
        const translated = await translateArticleToEnglish(
          article.title,
          article.content,
          article.excerpt
        );
        let enSlug = slugifyEnglish(translated.title) || "article";
        const { data: existingEn } = await supabase
          .from("articles")
          .select("id")
          .eq("slug", enSlug)
          .eq("language", "en")
          .maybeSingle();
        if (existingEn) enSlug = `${enSlug}-${Date.now().toString(36).slice(-6)}`;
        await supabase.from("articles").insert({
          title: translated.title,
          slug: enSlug,
          content: translated.content,
          excerpt: translated.excerpt ?? null,
          seo_title: translated.seo_title ?? null,
          seo_description: translated.seo_description ?? null,
          category_id: category?.id ?? null,
          status: autoPublish ? "published" : "draft",
          published_at: autoPublish ? nowIso : null,
          tags: [],
          featured_image: featuredImage,
          language: "en",
          original_id: inserted.id,
        });
      } catch (trErr) {
        console.error("Translate and save EN failed:", trErr);
      }
    }

    return NextResponse.json({
      articleId: inserted.id,
      slug,
      title: article.title,
      both: language === "both",
    });
  } catch (err) {
    console.error("Generate article error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Generation failed" },
      { status: 500 }
    );
  }
}
