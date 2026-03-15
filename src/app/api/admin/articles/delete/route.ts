import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST { ids: string[] } — delete one or more articles by id.
 * Requires authenticated admin.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const raw = body.ids ?? body.id;
  const ids = Array.isArray(raw)
    ? raw.filter((x): x is string => typeof x === "string")
    : typeof raw === "string"
      ? [raw]
      : [];

  if (ids.length === 0) {
    return Response.json(
      { error: "Missing ids (array) or id (string)" },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("articles").delete().in("id", ids);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true, deleted: ids.length });
}
