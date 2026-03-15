import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { updateStoryStatus } from "@/lib/db/stories-admin";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { storyId, action } = body;

    if (!storyId || !action || !["approve", "reject"].includes(action)) {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }

    const success = await updateStoryStatus(
      storyId,
      action === "approve" ? "approved" : "rejected"
    );

    if (!success) {
      return Response.json(
        { error: "Failed to update" },
        { status: 500 }
      );
    }

    return Response.json({ success: true });
  } catch {
    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
