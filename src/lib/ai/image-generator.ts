import { GoogleGenAI } from "@google/genai";

function getGenAI() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenAI({ apiKey: key });
}

const IMAGE_STYLES = [
  "soft, warm, emotional, hopeful",
  "calm, reflective, peaceful",
  "minimalist, gentle lighting",
];

export async function generateArticleImage(
  title: string,
  mood: "loneliness" | "hope" | "reflection" | "comfort" = "hope"
): Promise<string | null> {
  const ai = getGenAI();
  if (!ai) return null;

  const style = IMAGE_STYLES[Math.floor(Math.random() * IMAGE_STYLES.length)];

  const prompt = `Emotional support illustration for article about "${title}".
Mood: ${mood}. Style: ${style}.
Absolutely NO text, letters, numbers or characters in any language (no Japanese, Chinese, Korean, English or Hindi text). Pure illustration only.
Abstract, calming, suitable for mental health content.
Soft colors, gentle, non-distressing.`;

  try {
    const response = await ai.models.generateImages({
      model: "imagen-4.0-fast-generate-001",
      prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: "16:9",
      },
    });

    const image = response.generatedImages?.[0];
    const bytes = image?.image?.imageBytes;

    if (!bytes) return null;

    const base64 = typeof bytes === "string" ? bytes : Buffer.from(bytes).toString("base64");
    return `data:image/png;base64,${base64}`;
  } catch {
    return null;
  }
}
