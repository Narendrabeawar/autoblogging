import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArticleForm } from "@/components/admin/article-form";
import { getCategories } from "@/lib/db/categories";
import { DeleteArticleButton } from "../delete-article-button";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  let article: {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    category_id: string | null;
    status: string;
  } | null = null;
  let categories: Awaited<ReturnType<typeof getCategories>> = [];

  try {
    const [supabase, cats] = await Promise.all([
      createClient(),
      getCategories(),
    ]);
    categories = cats;
    const { data, error } = await supabase
      .from("articles")
      .select("id, title, slug, content, excerpt, category_id, status")
      .eq("id", id)
      .single();
    if (!error && data) article = data;
  } catch {
    return (
      <div className="max-w-3xl space-y-6">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 flex flex-col gap-4">
          <p className="flex items-center gap-2 font-medium text-destructive">
            <AlertCircle className="size-5" />
            Could not load article (connection error).
          </p>
          <p className="text-sm text-muted-foreground">
            Refresh the page or try again later. If it keeps failing, check your
            network and Supabase connection.
          </p>
          <Button asChild variant="outline">
            <Link href="/admin/articles">Back to Articles</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!article) {
    notFound();
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit Article</h1>
        <DeleteArticleButton id={article.id} />
      </div>
      <ArticleForm
        categories={categories}
        article={{
          id: article.id,
          title: article.title,
          slug: article.slug,
          content: article.content,
          excerpt: article.excerpt ?? "",
          category_id: article.category_id,
          status: article.status,
        }}
      />
    </div>
  );
}
