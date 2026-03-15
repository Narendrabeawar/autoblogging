import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArticlesListClient } from "./articles-list-client";

export default async function AdminArticlesPage() {
  const supabase = await createClient();
  const { data: articles } = await supabase
    .from("articles")
    .select(
      `
      id,
      title,
      slug,
      status,
      language,
      published_at,
      created_at,
      categories (name, slug)
    `
    )
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Articles</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/articles/generate" className="gap-2">
              ✨ Generate (AI)
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/articles/new" className="gap-2">
              <Plus className="size-4" />
              New Article
            </Link>
          </Button>
        </div>
      </div>

      {articles?.length ? (
        <ArticlesListClient articles={articles} />
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>No articles yet.</p>
            <Button asChild className="mt-4">
              <Link href="/admin/articles/new">Create first article</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
