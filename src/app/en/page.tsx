import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { CategoryCard } from "@/components/article/category-card";
import { ArticleCard } from "@/components/article/article-card";
import { EnHero } from "@/components/home/en-hero";
import { CATEGORIES } from "@/lib/constants";
import { getPublishedArticles, getHeroTickerArticles } from "@/lib/db/articles";

const EN_BASE = "/en";

export default async function EnHome() {
  const [featuredArticles, tickerArticles] = await Promise.all([
    getPublishedArticles(6, "en"),
    getHeroTickerArticles(80, "en"),
  ]);
  const source = tickerArticles.length > 0 ? tickerArticles : featuredArticles;
  const trendingItems = source.map((a) => ({
    title: a.title,
    href: `${EN_BASE}/articles/${encodeURIComponent(a.slug)}`,
    imageUrl: a.featuredImage,
  }));

  return (
    <>
      <EnHero trendingItems={trendingItems} />

      <section className="py-16 sm:py-24 bg-muted/30">
        <Container>
          <SectionHeader
            title="Categories"
            subtitle="Choose content that fits your needs"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {CATEGORIES.map((cat, i) => (
              <CategoryCard
                key={cat.slug}
                name={cat.name}
                slug={cat.slug}
                icon={cat.icon}
                description={(cat as { description: string; descriptionEn?: string }).descriptionEn ?? (cat as { description: string }).description}
                image={"image" in cat ? cat.image : undefined}
                imageAlt={"imageAlt" in cat ? cat.imageAlt : undefined}
                index={i}
                basePath={EN_BASE}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeader
            title="Featured Articles"
            subtitle="Most popular and helpful articles"
          />
          {featuredArticles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredArticles.map((article, i) => (
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
                <Button asChild variant="outline" size="lg">
                  <Link href={`${EN_BASE}/articles`}>
                    <Sparkles className="size-5 mr-2" />
                    View all articles
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>No English articles yet. Browse Hindi content from the home page.</p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/">Go to Hindi home</Link>
              </Button>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
