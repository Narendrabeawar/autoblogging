import { GoogleGenerativeAI } from "@google/generative-ai";

function getGemini() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set in environment");
  return new GoogleGenerativeAI(key);
}

export interface TranslateArticleResult {
  title: string;
  content: string;
  excerpt?: string;
  seo_title?: string;
  seo_description?: string;
}

/**
 * Translate Hindi article (title + HTML content) to English using Gemini.
 * Returns title, content, and optional excerpt/seo fields.
 */
export async function translateArticleToEnglish(
  title: string,
  content: string,
  existingExcerpt?: string | null
): Promise<TranslateArticleResult> {
  const genAI = getGemini();
  const modelId =
    process.env.GEMINI_TRANSLATE_MODEL || "gemini-3-flash-preview";
  const model = genAI.getGenerativeModel({
    model: modelId,
    generationConfig: {
      temperature: 0.5,
      maxOutputTokens: 8192,
    },
  });

  const prompt = `You are a careful translator.

Translate the following Hindi article into natural, emotionally warm English.

CRITICAL RULES:
- The input is HTML. Preserve ALL HTML tags and structure (<h1>, <h2>, <p>, <ul>, <li>, <strong>, <em>, <a> etc.).
- Only translate the visible text content. Do NOT remove or add headings, lists, or sections.
- Keep the meaning, tone and formatting as close as possible to the original.

Return ONLY valid JSON with this exact shape:
{
  "title": "English title",
  "excerpt": "2-3 sentence summary in English (max 150 chars)",
  "seo_title": "SEO title in English (60 chars max)",
  "seo_description": "Meta description in English (155 chars max)",
  "content": "<full html translated>"
}`;

  const result = await model.generateContent([
    "You are a helpful assistant that outputs only valid JSON. No explanations.",
    prompt,
    JSON.stringify({ title, html: content, existingExcerpt: existingExcerpt ?? "" }),
  ]);

  const response = result.response;
  if (!response.candidates?.length) {
    const blockReason = response.promptFeedback?.blockReason;
    throw new Error(blockReason ? `Blocked: ${blockReason}` : "No response from model");
  }
  const text = response.text()?.trim();
  if (!text) throw new Error("Empty translation response");

  const cleaned = text.replace(/^```json\s*|\s*```$/g, "").trim();
  let parsed: {
    title?: string;
    content?: string;
    excerpt?: string;
    seo_title?: string;
    seo_description?: string;
  };
  try {
    parsed = JSON.parse(cleaned) as typeof parsed;
  } catch (e) {
    throw new Error("Invalid JSON from translator");
  }
  if (!parsed.content) throw new Error("Translator did not return content");

  return {
    title: parsed.title ?? title,
    content: parsed.content,
    excerpt: parsed.excerpt,
    seo_title: parsed.seo_title,
    seo_description: parsed.seo_description,
  };
}
