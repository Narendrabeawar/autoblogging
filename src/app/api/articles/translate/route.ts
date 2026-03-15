import { NextRequest } from "next/server";
import { getArticleBySlug } from "@/lib/db/articles";
import { translateArticleToEnglish } from "@/lib/ai/translate-article";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const slug = typeof body.slug === "string" ? body.slug : "";
    const targetLang = body.targetLang === "en" ? "en" : "hi";

    if (!slug) {
      return Response.json({ error: "Missing slug" }, { status: 400 });
    }

    const article = await getArticleBySlug(slug);
    if (!article) {
      return Response.json({ error: "Article not found" }, { status: 404 });
    }

    if (targetLang === "hi") {
      return Response.json({
        title: article.title,
        content: article.content,
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const translated = await translateArticleToEnglish(
      article.title,
      article.content,
      article.excerpt
    );

    return Response.json({
      title: translated.title,
      content: translated.content,
      excerpt: translated.excerpt,
      seo_title: translated.seo_title,
      seo_description: translated.seo_description,
    });
  } catch (err) {
    console.error("Translate article error:", err);
    return Response.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  }
}

