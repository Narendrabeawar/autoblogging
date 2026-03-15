import { notFound } from "next/navigation";
import Link from "next/link";
import { FileText } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { ArticleCard } from "@/components/article/article-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CATEGORIES } from "@/lib/constants";
import { getArticlesByCategorySlug } from "@/lib/db/articles";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  return {
    title: category ? `${category.name} | Akelapan` : "Category | Akelapan",
    description: category
      ? `${category.name} से जुड़े articles - emotional support और guidance`
      : "Articles by category",
  };
}

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ slug: cat.slug }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const { articles } = await getArticlesByCategorySlug(slug);

  return (
    <Container className="py-12 sm:py-16">
      <SectionHeader
        title={category.name}
        subtitle={`${category.name} से जुड़े सभी articles`}
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
              />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild variant="outline">
              <Link href="/articles">सभी Categories देखें</Link>
            </Button>
          </div>
        </>
      ) : (
        <EmptyState
          icon={<FileText className="size-8" />}
          title={`${category.name} में अभी कोई articles नहीं हैं।`}
          description="दूसरी categories में देखें या सभी articles ब्राउज़ करें।"
          action={{ label: "सभी Articles देखें", href: "/articles" }}
          secondaryAction={{ label: "होम पर जाएं", href: "/" }}
        />
      )}
    </Container>
  );
}
