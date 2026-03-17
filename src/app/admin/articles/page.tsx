import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArticlesListClient } from "./articles-list-client";

const PAGE_SIZE = 50;

interface AdminArticlesPageProps {
  searchParams?: Promise<{ page?: string }>;
}

export default async function AdminArticlesPage({
  searchParams,
}: AdminArticlesPageProps) {
  const params = (await searchParams) ?? {};
  const currentPage = Math.max(
    1,
    Number.parseInt(params.page ?? "1", 10) || 1
  );
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

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
    .order("created_at", { ascending: false })
    .range(from, to);

  const hasNextPage = (articles?.length ?? 0) === PAGE_SIZE;

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
        <>
          <ArticlesListClient articles={articles} />
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              asChild
              disabled={currentPage <= 1}
            >
              <Link
                href={
                  currentPage <= 2
                    ? "/admin/articles"
                    : `/admin/articles?page=${currentPage - 1}`
                }
              >
                Previous
              </Link>
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage}
            </span>
            <Button
              variant="outline"
              asChild
              disabled={!hasNextPage}
            >
              <Link href={`/admin/articles?page=${currentPage + 1}`}>
                Next
              </Link>
            </Button>
          </div>
        </>
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
