/**
 * Full Auto: AI finds topics, generates articles, publishes.
 * Usage: pnpm run full-auto [count]
 * Example: pnpm run full-auto 5
 *
 * Set AUTO_PUBLISH=true to publish immediately (default: draft)
 */
import { createClient } from "@supabase/supabase-js";
import { generateArticle } from "../src/lib/ai/article-generator";
import { generateArticleImage } from "../src/lib/ai/image-generator";
import { findAITopics } from "../src/lib/ai/trend-topic-finder";
import { slugifyEnglish } from "../src/lib/slugify";
import { uploadArticleImageFromDataUrl } from "../src/lib/storage/article-images";

function slugify(text: string): string {
  const base = slugifyEnglish(text) || "article";
  return `${base}-${Date.now().toString(36)}`;
}

async function main() {
  const count = Math.min(
    Math.max(parseInt(process.argv[2] ?? "3", 10) || 3, 1),
    20
  );
  const autoPublish = process.env.AUTO_PUBLISH === "true";
  const generateImage = process.env.GENERATE_IMAGE === "true";

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

  console.log(
    `\n🚀 Full Auto: Generating ${count} article(s)... (publish: ${autoPublish}, image: ${generateImage})\n`
  );

  const existingTitles = await supabase
    .from("articles")
    .select("title")
    .limit(100);
  const excludeTopics =
    existingTitles.data?.map((r) => r.title).filter(Boolean) ?? [];

  const topics = await findAITopics(count, { excludeTopics });

  if (topics.length === 0) {
    console.error("AI could not generate topics. Try again.");
    process.exit(1);
  }

  console.log("Topics from AI:");
  topics.forEach((t, i) =>
    console.log(`  ${i + 1}. ${t.title} [${t.categorySlug}]`)
  );
  console.log("");

  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i];
    console.log(`[${i + 1}/${topics.length}] Generating: ${topic.title}`);

    try {
      const article = await generateArticle(topic.topic, topic.categoryName);
      if (!article) {
        console.error("  ❌ Generation failed");
        continue;
      }

      const { data: category } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", topic.categorySlug)
        .single();

      let featuredImage: string | null = null;
      if (generateImage) {
        const dataUrl =
          (await generateArticleImage(article.title, "hope")) ?? null;
        if (dataUrl) {
          featuredImage =
            (await uploadArticleImageFromDataUrl(
              dataUrl,
              article.title
            )) ?? null;
        }
      }

      const articleSlug = slugify(article.title);
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
      });

      if (error) {
        console.error("  ❌", error.message);
      } else {
        console.log(`  ✅ Created (${autoPublish ? "published" : "draft"})`);
      }
    } catch (err) {
      console.error("  ❌", err);
    }

    if (i < topics.length - 1) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  console.log("\nDone!");
}

main().catch(console.error);
