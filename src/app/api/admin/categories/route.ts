import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { slugifyEnglish } from "@/lib/slugify";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, sort_order")
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ categories: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const rawName = String(body.name ?? "").trim();

  if (!rawName) {
    return NextResponse.json(
      { error: "Name is required" },
      { status: 400 }
    );
  }

  let baseSlug: string =
    (body.slug && String(body.slug).trim()) || slugifyEnglish(rawName) || "category";

  // ensure slug uniqueness by appending suffix if needed
  let slug = baseSlug;
  let suffix = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data: existing, error: existingError } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existingError) {
      return NextResponse.json(
        { error: existingError.message },
        { status: 500 }
      );
    }

    if (!existing) break;
    slug = `${baseSlug}-${suffix++}`;
  }

  const { data: last } = await supabase
    .from("categories")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextSortOrder =
    (Array.isArray(last) && last[0]?.sort_order ? last[0].sort_order : 0) + 1;

  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: rawName,
      slug,
      sort_order: nextSortOrder,
    })
    .select("id, name, slug, sort_order")
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ category: data });
}

