import { createClient } from "@/lib/supabase/server";

export interface UserStoryAdmin {
  id: string;
  title: string;
  content: string;
  author_name: string | null;
  author_display: string;
  consent_given: boolean;
  status: string;
  theme: string | null;
  created_at: string;
  published_at: string | null;
  admin_notes: string | null;
}

export async function getAllStoriesForAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_stories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data ?? []) as UserStoryAdmin[];
}

export async function updateStoryStatus(
  id: string,
  status: "approved" | "rejected",
  adminNotes?: string
) {
  const supabase = await createClient();
  const updates: Record<string, unknown> = {
    status,
    admin_notes: adminNotes ?? null,
  };
  if (status === "approved") {
    updates.published_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("user_stories")
    .update(updates)
    .eq("id", id);

  return !error;
}
