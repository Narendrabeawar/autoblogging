/**
 * Generate a single AI article and save to Supabase.
 * Usage: pnpm run generate "topic" [category_slug]
 * Or: pnpm run generate (uses random topic from keyword finder)
 *
 * Requires: GEMINI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY
 */
import { createClient } from "@supabase/supabase-js";
import { generateArticle } from "../src/lib/ai/article-generator";
import {
  getTopicForDate,
  getRandomEvergreenTopic,
  type TopicSuggestion,
} from "../src/lib/ai/keyword-finder";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-\u0900-\u097F]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const topicArg = process.argv[2];
  const categoryArg = process.argv[3];

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!process.env.GEMINI_API_KEY) {
    console.error("Error: GEMINI_API_KEY is required");
    process.exit(1);
  }

  if (!url || !key) {
    console.error("Error: Supabase URL and key required");
    process.exit(1);
  }

  let topicSuggestion: TopicSuggestion;

  if (topicArg) {
    topicSuggestion = {
      topic: topicArg,
      categorySlug: categoryArg ?? "loneliness",
      categoryName: categoryArg ?? "Loneliness",
    };
  } else {
    topicSuggestion = getTopicForDate(new Date());
    console.log("Using topic from calendar:", topicSuggestion.topic);
  }

  console.log("Generating article for:", topicSuggestion.topic);

  const article = await generateArticle(
    topicSuggestion.topic,
    topicSuggestion.categoryName
  );

  if (!article) {
    console.error("Failed to generate article");
    process.exit(1);
  }

  const supabase = createClient(url, key);

  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", topicSuggestion.categorySlug)
    .single();

  const slug = slugify(article.title);
  const payload = {
    title: article.title,
    slug,
    content: article.content,
    excerpt: article.excerpt,
    seo_title: article.seo_title,
    seo_description: article.seo_description,
    category_id: category?.id ?? null,
    status: "draft",
    tags: [],
  };

  const { data, error } = await supabase
    .from("articles")
    .insert(payload)
    .select("id, slug, title")
    .single();

  if (error) {
    console.error("Supabase error:", error.message);
    process.exit(1);
  }

  console.log("✅ Article created!");
  console.log("  ID:", data.id);
  console.log("  Slug:", data.slug);
  console.log("  Title:", data.title);
  console.log("  Status: draft (publish from admin)");
}

main().catch(console.error);
