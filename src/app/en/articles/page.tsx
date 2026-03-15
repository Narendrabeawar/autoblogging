import Link from "next/link";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { ArticleCard } from "@/components/article/article-card";
import { Button } from "@/components/ui/button";
import { getPublishedArticles } from "@/lib/db/articles";

const EN_BASE = "/en";

export const metadata = {
  title: "Articles | Akelapan (English)",
  description:
    "Emotional support, motivation and life advice articles in English.",
};

export default async function EnArticlesPage() {
  const articles = await getPublishedArticles(100, "en");

  return (
    <Container className="py-12 sm:py-16">
      <SectionHeader
        title="All Articles"
        subtitle="Browse by your needs"
      />
      {articles.length > 0 ? (
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
              basePath={EN_BASE}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">No English articles yet.</p>
          <p className="mt-2 text-sm">
            Browse Hindi content from the home page.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/">Go to Hindi home</Link>
          </Button>
        </div>
      )}
    </Container>
  );
}
