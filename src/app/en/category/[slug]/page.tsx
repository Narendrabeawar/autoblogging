import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { ArticleCard } from "@/components/article/article-card";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/constants";
import { getArticlesByCategorySlug } from "@/lib/db/articles";

const EN_BASE = "/en";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  return {
    title: category ? `${category.name} | Akelapan (English)` : "Category | Akelapan",
    description: category
      ? `Articles about ${category.name} — emotional support and guidance`
      : "Articles by category",
  };
}

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ slug: cat.slug }));
}

export default async function EnCategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const { articles } = await getArticlesByCategorySlug(slug, 50, "en");

  return (
    <Container className="py-12 sm:py-16">
      <SectionHeader
        title={category.name}
        subtitle={`All articles in ${category.name}`}
      />
      {articles.length > 0 ? (
        <>
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
          <div className="mt-12 text-center">
            <Button asChild variant="outline">
              <Link href={`${EN_BASE}/articles`}>View all categories</Link>
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">
            No English articles in {category.name} yet.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link href={`${EN_BASE}/articles`}>View all articles</Link>
          </Button>
        </div>
      )}
    </Container>
  );
}
