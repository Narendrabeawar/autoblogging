import { ArticleForm } from "@/components/admin/article-form";
import { getCategories } from "@/lib/db/categories";

export default async function NewArticlePage() {
  const categories = await getCategories();

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">New Article</h1>
      <ArticleForm categories={categories} />
    </div>
  );
}
