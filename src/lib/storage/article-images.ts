import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { slugifyEnglish } from "@/lib/slugify";

const BUCKET_NAME = "article-images";

function getStorageClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase env. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) to .env.local"
    );
  }

  return createSupabaseClient(url, key);
}

export async function uploadArticleImageFromDataUrl(
  dataUrl: string,
  title: string
): Promise<string | null> {
  if (!dataUrl.startsWith("data:image/")) return null;

  const [meta, base64] = dataUrl.split(",");
  if (!base64) return null;

  const mimeMatch = meta.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64$/);
  const mimeType = mimeMatch?.[1] ?? "image/png";
  const extension =
    mimeType === "image/jpeg"
      ? "jpg"
      : mimeType === "image/webp"
      ? "webp"
      : "png";

  const fileName =
    slugifyEnglish(title || "article") || `article-${Date.now().toString(36)}`;
  const filePath = `articles/${fileName}-${Date.now().toString(36)}.${extension}`;

  const buffer = Buffer.from(base64, "base64");
  const supabase = getStorageClient();

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, buffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) {
    console.error("Error uploading article image to storage:", error.message);
    return null;
  }

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
  return data.publicUrl ?? null;
}

