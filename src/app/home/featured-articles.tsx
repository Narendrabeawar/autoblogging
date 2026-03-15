import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { ArticleCard } from "@/components/article/article-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getPublishedArticles } from "@/lib/db/articles";

export async function FeaturedArticles() {
  const featuredArticles = (await getPublishedArticles(6)) ?? [];

  return (
    <section className="pt-10 sm:pt-14 pb-16 sm:pb-24">
      <Container>
        <SectionHeader
          title="Featured Articles"
          subtitle="सबसे लोकप्रिय और मददगार articles"
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
                />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Button asChild variant="outline" size="lg">
                <Link href="/articles">
                  <Sparkles className="size-5 mr-2" />
                  सभी Articles देखें
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <EmptyState
            icon={<Sparkles className="size-8" />}
            title="जल्द ही articles आएंगे।"
            description="आप अकेले नहीं हैं। Categories देखें या बाद में वापस आएं।"
            action={{ label: "Categories देखें", href: "/#categories" }}
            secondaryAction={{ label: "सभी Articles", href: "/articles" }}
          />
        )}
      </Container>
    </section>
  );
}
