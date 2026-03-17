import { Suspense } from "react";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { CategoryCard } from "@/components/article/category-card";
import { ArticleCardSkeletonGrid } from "@/components/article/article-card-skeleton";
import { CATEGORIES } from "@/lib/constants";
import { FeaturedArticles } from "@/app/home/featured-articles";
import { Hero } from "@/components/home/hero";
import { getHeroTickerArticles } from "@/lib/db/articles";

export default async function Home() {
  const tickerArticles = await getHeroTickerArticles(80, "hi");
  const trendingItems = tickerArticles.map((a) => ({
    title: a.title,
    href: `/articles/${encodeURIComponent(a.slug)}`,
    imageUrl: a.featuredImage,
  }));

  return (
    <>
      <Hero trendingItems={trendingItems} />

      <section id="categories" className="pt-10 sm:pt-14 pb-16 sm:pb-24 bg-muted/30">
        <Container>
          <SectionHeader
            title="Categories"
            subtitle="अपनी ज़रूरत के हिसाब से content चुनें"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {CATEGORIES.map((cat, i) => (
              <CategoryCard
                key={cat.slug}
                name={cat.name}
                slug={cat.slug}
                icon={cat.icon}
                description={cat.description}
                image={"image" in cat ? cat.image : undefined}
                imageAlt={"imageAlt" in cat ? cat.imageAlt : undefined}
                index={i}
              />
            ))}
          </div>
        </Container>
      </section>

      <Suspense
        fallback={
          <section className="pt-10 sm:pt-14 pb-16 sm:pb-24">
            <Container>
              <SectionHeader
                title="Featured Articles"
                subtitle="सबसे लोकप्रिय और मददगार articles"
              />
              <ArticleCardSkeletonGrid count={6} />
            </Container>
          </section>
        }
      >
        <FeaturedArticles />
      </Suspense>
    </>
  );
}
