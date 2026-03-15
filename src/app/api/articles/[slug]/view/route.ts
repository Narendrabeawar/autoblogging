import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) return NextResponse.json({ ok: false }, { status: 400 });

    const supabase = await createClient();
    const { data: article } = await supabase
      .from("articles")
      .select("id")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (!article) return NextResponse.json({ ok: false }, { status: 404 });

    await supabase.rpc("increment_article_view", {
      p_article_id: article.id,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
