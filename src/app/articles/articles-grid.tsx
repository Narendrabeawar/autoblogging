import { BookOpen } from "lucide-react";
import { ArticleCard } from "@/components/article/article-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getPublishedArticles } from "@/lib/db/articles";

export async function ArticlesGrid() {
  const articles = await getPublishedArticles();

  if (articles.length === 0) {
    return (
      <EmptyState
        icon={<BookOpen className="size-8" />}
        title="अभी कोई articles नहीं हैं।"
        description="जल्द ही नया content आएगा। Categories में देखें या होम पर वापस जाएं।"
        action={{ label: "होम पर जाएं", href: "/" }}
        secondaryAction={{ label: "Categories देखें", href: "/#categories" }}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article, i) => (
        <ArticleCard
          key={article.slug}
          title={article.title}
          slug={article.slug}
          excerpt={article.excerpt}
          category={article.category}
          categorySlug={article.categorySlug}
          featuredImage={article.featuredImage}
          publishedAt={article.publishedAt ?? undefined}
          index={i}
        />
      ))}
    </div>
  );
}
