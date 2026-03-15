/**
 * Auto-publish script: Generate N articles and optionally publish them.
 * Usage: pnpm run auto-publish [count]
 * Default: 1 article
 *
 * Set AUTO_PUBLISH=true to auto-publish (otherwise saves as draft)
 */
import { createClient } from "@supabase/supabase-js";
import { generateArticle } from "../src/lib/ai/article-generator";
import {
  getRandomEvergreenTopic,
  getAllEvergreenTopics,
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
  const count = parseInt(process.argv[2] ?? "1", 10);
  const autoPublish = process.env.AUTO_PUBLISH === "true";

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!process.env.GEMINI_API_KEY) {
    console.error("Error: GEMINI_API_KEY required");
    process.exit(1);
  }

  if (!url || !key) {
    console.error("Error: Supabase credentials required");
    process.exit(1);
  }

  const supabase = createClient(url, key);
  const topics = getAllEvergreenTopics();
  const usedIndices = new Set<number>();

  console.log(`Generating ${count} article(s)... (auto-publish: ${autoPublish})`);

  for (let i = 0; i < count; i++) {
    let topic: TopicSuggestion;
    if (usedIndices.size >= topics.length) {
      topic = getRandomEvergreenTopic();
    } else {
      let idx: number;
      do {
        idx = Math.floor(Math.random() * topics.length);
      } while (usedIndices.has(idx));
      usedIndices.add(idx);
      topic = topics[idx];
    }

    console.log(`[${i + 1}/${count}] Generating: ${topic.topic}`);

    try {
      const article = await generateArticle(topic.topic, topic.categoryName);
      if (!article) {
        console.error("  Skipped (generation failed)");
        continue;
      }

      const { data: category } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", topic.categorySlug)
        .single();

      const slug = slugify(article.title);
      const payload = {
        title: article.title,
        slug: `${slug}-${Date.now().toString(36)}`,
        content: article.content,
        excerpt: article.excerpt,
        seo_title: article.seo_title,
        seo_description: article.seo_description,
        category_id: category?.id ?? null,
        status: autoPublish ? "published" : "draft",
        published_at: autoPublish ? new Date().toISOString() : null,
        tags: [],
      };

      const { error } = await supabase.from("articles").insert(payload);

      if (error) {
        console.error("  Error:", error.message);
      } else {
        console.log(`  ✅ Created (${payload.status})`);
      }
    } catch (err) {
      console.error("  Error:", err);
    }

    if (i < count - 1) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  console.log("Done!");
}

main().catch(console.error);
