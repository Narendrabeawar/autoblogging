import { GoogleGenerativeAI } from "@google/generative-ai";
import { slugifyEnglish } from "@/lib/slugify";

function slugifyFallback(text: string): string {
  const base = slugifyEnglish(text) || "article";
  return `${base}-${Date.now().toString(36)}`;
}

function getGemini() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set in environment");
  return new GoogleGenerativeAI(key);
}

const ARTICLE_PROMPT_HI = `You are an expert Hindi content writer for an emotional support website (Akelapan) focused on loneliness, relationships, breakup, and motivation.

Write a detailed SEO optimized article about: **{TOPIC}**

Article must include:
- Emotional, empathetic tone
- Practical, actionable advice
- Real-life relatable examples (in Hindi context)
- Clear H2 headings for each section
- Introduction (problem/context)
- Main content with 4-6 sections
- Conclusion with hope and next steps
- FAQ section with 3-5 questions and answers at the end

Target word count: {WORD_COUNT} words.

Audience: People feeling lonely or emotionally distressed in India.

Language: Hindi (Devanagari script).

Format the response as JSON with these exact keys:
{
  "title": "Article title in Hindi",
  "excerpt": "2-3 sentence summary in Hindi (max 150 chars)",
  "content": "Full HTML content with <h2>, <p>, <ul>, <li> tags. Include FAQ as last section with <h2>सामान्य प्रश्न</h2>",
  "seo_title": "SEO title (60 chars max)",
  "seo_description": "Meta description (155 chars max)",
  "slug": "url-friendly-english-slug-from-title-romanized-hindi-lowercase-hyphens-only"
}

IMPORTANT: "slug" must be in English only - romanize the Hindi title (e.g. "जब मैं अकेला महसूस करता हूँ" → "jab-main-akela-mahsoos-karta-hun"). Use lowercase, hyphens for spaces, no special characters.

Return ONLY valid JSON, no markdown or extra text.`;

const ARTICLE_PROMPT_EN = `You are an expert content writer for an emotional support website (Akelapan) focused on loneliness, relationships, breakup, and motivation. Write in English for an Indian audience.

Write a detailed SEO optimized article about: **{TOPIC}**

Article must include:
- Emotional, empathetic tone
- Practical, actionable advice
- Real-life relatable examples (Indian context)
- Clear H2 headings for each section
- Introduction (problem/context)
- Main content with 4-6 sections
- Conclusion with hope and next steps
- FAQ section with 3-5 questions and answers at the end

Target word count: {WORD_COUNT} words.

Audience: People feeling lonely or emotionally distressed in India (English readers).

Language: English.

Format the response as JSON with these exact keys:
{
  "title": "Article title in English",
  "excerpt": "2-3 sentence summary in English (max 150 chars)",
  "content": "Full HTML content with <h2>, <p>, <ul>, <li> tags. Include FAQ as last section with <h2>Frequently Asked Questions</h2>",
  "seo_title": "SEO title (60 chars max)",
  "seo_description": "Meta description (155 chars max)",
  "slug": "url-friendly-slug-from-title-lowercase-hyphens-only"
}

IMPORTANT: "slug" must be lowercase English, hyphens for spaces, no special characters.

Return ONLY valid JSON, no markdown or extra text.`;

export interface GeneratedArticle {
  title: string;
  excerpt: string;
  content: string;
  seo_title: string;
  seo_description: string;
  slug: string;
}

export type ArticleGeneratorLanguage = "hi" | "en";

export async function generateArticle(
  topic: string,
  categoryHint?: string,
  language: ArticleGeneratorLanguage = "hi",
  targetWordCount?: number
): Promise<GeneratedArticle | null> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment");
  }

  const promptTemplate =
    language === "en" ? ARTICLE_PROMPT_EN : ARTICLE_PROMPT_HI;

  const safeWordCount = (() => {
    if (!targetWordCount || Number.isNaN(targetWordCount)) return "1200-1500";
    const clamped = Math.max(500, Math.min(targetWordCount, 3000));
    // allow a bit of range so model has flexibility
    const min = Math.round(clamped * 0.85);
    const max = Math.round(clamped * 1.15);
    return `${min}-${max}`;
  })();

  const fullPrompt = promptTemplate
    .replace("{TOPIC}", topic)
    .replace(
      "**{TOPIC}**",
      categoryHint ? `**${topic}** (Category: ${categoryHint})` : `**${topic}**`
    )
    .replace("{WORD_COUNT}", safeWordCount);

  const genAI = getGemini();
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8192,
    },
  });

  const result = await model.generateContent([
    "You are a helpful assistant that outputs only valid JSON. No explanations.",
    fullPrompt,
  ]);

  const response = result.response;
  const text = response.text()?.trim();
  if (!text) return null;

  const cleanedText = text.replace(/^```json\s*|\s*```$/g, "").trim();

  try {
    const parsed = JSON.parse(cleanedText) as GeneratedArticle;
    if (!parsed.title || !parsed.content) return null;
    return parsed;
  } catch {
    return null;
  }
}
