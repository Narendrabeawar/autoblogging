/**
 * AI-powered trend-aware topic finder.
 * Uses Gemini to suggest article topics based on:
 * - Current season/month in India
 * - What people search on Google/YouTube (AI inference)
 * - Category balance
 * - Unique, engaging titles
 */
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface AITopicSuggestion {
  topic: string;
  title: string;
  categorySlug: string;
  categoryName: string;
  reason?: string;
}

const CATEGORIES = [
  { slug: "loneliness", name: "Loneliness" },
  { slug: "breakup", name: "Breakup" },
  { slug: "relationships", name: "Relationships" },
  { slug: "friendship", name: "Friendship" },
  { slug: "self-improvement", name: "Self Improvement" },
  { slug: "mental-strength", name: "Mental Strength" },
  { slug: "motivation", name: "Motivation" },
  { slug: "life-advice", name: "Life Advice" },
];

function getGemini() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");
  return new GoogleGenerativeAI(key);
}

export async function findAITopics(
  count: number,
  options?: {
    categorySlug?: string;
    excludeTopics?: string[];
  }
): Promise<AITopicSuggestion[]> {
  const month = new Date().toLocaleString("hi-IN", { month: "long" });
  const categoriesList = CATEGORIES.map((c) => `${c.name} (${c.slug})`).join(", ");
  const excludeHint = options?.excludeTopics?.length
    ? `\nAvoid these already-covered topics: ${options.excludeTopics.slice(0, 20).join(", ")}`
    : "";

  const categoryFilter =
    options?.categorySlug && options.categorySlug !== "all"
      ? `\nIMPORTANT: Only suggest topics for category slug "${options.categorySlug}". Pick the matching categoryName from the list.`
      : `\nDistribute topics across different categories. Vary the categories.`;

  const prompt = `You are a content strategist for Akelapan - a Hindi emotional support website (loneliness, breakup, relationships, motivation).

Generate exactly ${count} unique article topic suggestions. Consider:
1. Current month: ${month} - seasonal themes, festivals, exam season, etc. in India
2. What people search on Google/YouTube about: अकेलापन, breakup, relationships, motivation, mental health
3. Trending questions on Quora, Reddit India about loneliness and relationships
4. Practical, relatable problems Indians face
5. SEO-friendly - what would someone type in Google?

Categories available: ${categoriesList}
${categoryFilter}
${excludeHint}

Return ONLY valid JSON array. Each object must have:
{
  "topic": "Main topic/keyword in Hindi (what to write about)",
  "title": "Engaging article title in Hindi (click-worthy, 5-10 words)",
  "categorySlug": "one of: loneliness, breakup, relationships, friendship, self-improvement, mental-strength, motivation, life-advice",
  "categoryName": "Matching category name in English",
  "reason": "Brief reason why this topic is relevant now (optional)"
}

Example:
{"topic": "वैलेंटाइन डे पर अकेले कैसे रहें", "title": "वैलेंटाइन डे पर अकेले? ये 7 तरीके आपको बेहतर महसूस कराएंगे", "categorySlug": "loneliness", "categoryName": "Loneliness", "reason": "Feb theme"}

Return ONLY the JSON array, no markdown or extra text.`;

  const genAI = getGemini();
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    generationConfig: {
      temperature: 0.9,
      maxOutputTokens: 4096,
    },
  });

  const result = await model.generateContent([
    "Output only valid JSON array. No explanations.",
    prompt,
  ]);

  const text = result.response.text()?.trim();
  if (!text) return [];

  const cleaned = text.replace(/^```json\s*|\s*```$/g, "").trim();
  try {
    const parsed = JSON.parse(cleaned) as AITopicSuggestion[];
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (p) =>
          p.topic &&
          p.title &&
          p.categorySlug &&
          CATEGORIES.some((c) => c.slug === p.categorySlug)
      )
      .slice(0, count)
      .map((p) => ({
        ...p,
        categoryName:
          CATEGORIES.find((c) => c.slug === p.categorySlug)?.name ?? p.categoryName,
      }));
  } catch {
    return [];
  }
}
