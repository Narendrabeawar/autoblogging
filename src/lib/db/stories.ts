import { createClient } from "@/lib/supabase/server";

export interface UserStory {
  id: string;
  title: string;
  content: string;
  author_name: string | null;
  author_display: string;
  theme: string | null;
  published_at: string | null;
  created_at: string;
}

export async function getApprovedStories(limit = 50) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_stories")
    .select("id, title, content, author_display, theme, published_at, created_at")
    .eq("status", "approved")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return (data ?? []) as UserStory[];
}

export async function getStoryById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_stories")
    .select("id, title, content, author_display, theme, published_at, created_at")
    .eq("id", id)
    .eq("status", "approved")
    .single();

  if (error || !data) return null;
  return data as UserStory;
}

export async function submitStory(story: {
  title: string;
  content: string;
  author_name?: string;
  author_display?: string;
  consent_given: boolean;
  theme?: string;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_stories")
    .insert({
      title: story.title,
      content: story.content,
      author_name: story.author_name ?? null,
      author_display: story.author_display ?? "Anonymous",
      consent_given: story.consent_given,
      theme: story.theme ?? null,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, id: data?.id };
}
