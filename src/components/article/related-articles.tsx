import Link from "next/link";
import { ArticleCard } from "./article-card";
import { SectionHeader } from "@/components/layout/section-header";

interface RelatedArticle {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  featuredImage?: string | null;
  publishedAt?: string | null;
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
  /** e.g. "/en" for English routes */
  basePath?: string;
  title?: string;
  subtitle?: string;
}

export function RelatedArticles({
  articles,
  basePath = "",
  title = "संबंधित लेख",
  subtitle = "इन लेखों को भी पढ़ें",
}: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 border-t border-border">
      <SectionHeader title={title} subtitle={subtitle} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
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
            basePath={basePath}
          />
        ))}
      </div>
    </section>
  );
}
