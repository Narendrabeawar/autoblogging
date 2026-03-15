import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";
import { generateArticle } from "@/lib/ai/article-generator";
import { generateArticleImage } from "@/lib/ai/image-generator";
import { translateArticleToEnglish } from "@/lib/ai/translate-article";
import { findAITopics } from "@/lib/ai/trend-topic-finder";
import { slugifyEnglish } from "@/lib/slugify";
import { pingSitemap } from "@/lib/seo/ping-sitemap";

function slugify(text: string): string {
  const base = slugifyEnglish(text) || "article";
  return `${base}-${Date.now().toString(36)}`;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return Response.json(
      { error: "GEMINI_API_KEY not configured" },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const count = Math.min(Math.max(parseInt(body.count ?? "3", 10) || 3, 1), 20);
  const categorySlug = body.categorySlug ?? "all";
  const autoPublish = body.autoPublish === true;
  const generateImage = body.generateImage === true;
  const language =
    body.language === "both" ? "both" : body.language === "en" ? "en" : "hi";

  try {
    const existingTitles = await supabase
      .from("articles")
      .select("title")
      .limit(100);
    const excludeTopics =
      existingTitles.data?.map((r) => r.title).filter(Boolean) ?? [];

    const topics = await findAITopics(count, {
      categorySlug: categorySlug === "all" ? undefined : categorySlug,
      excludeTopics,
    });

    if (topics.length === 0) {
      return Response.json(
        { error: "AI could not generate topics. Try again." },
        { status: 500 }
      );
    }

    const results: {
      title: string;
      slug: string;
      status: string;
      error?: string;
      both?: boolean;
    }[] = [];

    for (let i = 0; i < topics.length; i++) {
      const topic = topics[i];
      try {
        const genLang = language === "both" ? "hi" : language;
        const article = await generateArticle(
          topic.topic,
          topic.categoryName,
          genLang
        );

        if (!article) {
          results.push({
            title: topic.title,
            slug: "",
            status: "failed",
            error: "Generation failed",
          });
          continue;
        }

        const { data: category } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", topic.categorySlug)
          .single();

        let featuredImage: string | null = null;
        if (generateImage) {
          featuredImage =
            (await generateArticleImage(article.title, "hope")) ?? null;
        }

        const articleSlug = slugify(article.title);

        if (language === "both") {
          const { data: insertedHi, error: errHi } = await supabase
            .from("articles")
            .insert({
              title: article.title,
              slug: articleSlug,
              content: article.content,
              excerpt: article.excerpt,
              seo_title: article.seo_title,
              seo_description: article.seo_description,
              category_id: category?.id ?? null,
              status: autoPublish ? "published" : "draft",
              published_at: autoPublish ? new Date().toISOString() : null,
              tags: [],
              featured_image: featuredImage,
              language: "hi",
            })
            .select("id")
            .single();

          if (errHi) {
            results.push({
              title: article.title,
              slug: "",
              status: "failed",
              error: errHi.message,
            });
            continue;
          }

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
            const { error: errEn } = await supabase.from("articles").insert({
              title: translated.title,
              slug: enSlug,
              content: translated.content,
              excerpt: translated.excerpt ?? null,
              seo_title: translated.seo_title ?? null,
              seo_description: translated.seo_description ?? null,
              category_id: category?.id ?? null,
              status: autoPublish ? "published" : "draft",
              published_at: autoPublish ? new Date().toISOString() : null,
              tags: [],
              featured_image: featuredImage,
              language: "en",
              original_id: insertedHi.id,
            });
            if (errEn) {
              results.push({
                title: article.title,
                slug: articleSlug,
                status: autoPublish ? "published" : "draft",
                error: `Hindi saved; EN failed: ${errEn.message}`,
                both: true,
              });
            } else {
              results.push({
                title: article.title,
                slug: articleSlug,
                enSlug,
                status: autoPublish ? "published" : "draft",
                both: true,
              });
            }
          } catch (trErr) {
            const msg =
              trErr instanceof Error ? trErr.message : "EN translate failed";
            results.push({
              title: article.title,
              slug: articleSlug,
              status: autoPublish ? "published" : "draft",
              error: `Hindi saved; EN failed: ${msg}`,
              both: true,
            });
          }
        } else {
          const { error } = await supabase.from("articles").insert({
            title: article.title,
            slug: articleSlug,
            content: article.content,
            excerpt: article.excerpt,
            seo_title: article.seo_title,
            seo_description: article.seo_description,
            category_id: category?.id ?? null,
            status: autoPublish ? "published" : "draft",
            published_at: autoPublish ? new Date().toISOString() : null,
            tags: [],
            featured_image: featuredImage,
            language,
          });

          if (error) {
            results.push({
              title: article.title,
              slug: "",
              status: "failed",
              error: error.message,
            });
          } else {
            results.push({
              title: article.title,
              slug: articleSlug,
              status: autoPublish ? "published" : "draft",
            });
          }
        }
      } catch (err) {
        results.push({
          title: topic.title,
          slug: "",
          status: "failed",
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }

      if (i < topics.length - 1) {
        await new Promise((r) => setTimeout(r, 1500));
      }
    }

    const success = results.filter((r) => r.status !== "failed").length;
    if (success > 0) pingSitemap().catch(() => {});
    return Response.json({
      success: true,
      total: results.length,
      created: success,
      failed: results.length - success,
      results,
    });
  } catch (err) {
    console.error("Full auto generate error:", err);
    return Response.json(
      {
        error:
          err instanceof Error ? err.message : "Auto generation failed",
      },
      { status: 500 }
    );
  }
}
