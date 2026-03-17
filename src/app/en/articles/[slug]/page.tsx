import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { CategoryBadge } from "@/components/article/category-badge";
import { ArticleHelpful } from "@/components/article/article-helpful";
import { ArticleShare } from "@/components/article/article-share";
import { RelatedArticles } from "@/components/article/related-articles";
import { ReadingProgress } from "@/components/article/reading-progress";
import { AdSense } from "@/components/ads/adsense";
import { AffiliateSection } from "@/components/ads/affiliate-section";
import { getArticleBySlug, getRelatedArticles, getHindiVersionSlug, getPublishedArticles, getPublishedArticleSlugs } from "@/lib/db/articles";
import { ArticleSchema } from "@/components/seo/article-schema";
import { ArticleViewTracker } from "@/components/article/article-view-tracker";
import { getTopArticlesByViews } from "@/lib/db/analytics";
import { ArticleSidebar } from "@/components/article/article-sidebar";
import { ArticleLeftSidebar } from "@/components/article/article-left-sidebar";

export const revalidate = 86400;

const EN_BASE = "/en";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

function normalizeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://akelapan.com";

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  const s = normalizeSlug(slug);
  const [article, hiSlug] = await Promise.all([
    getArticleBySlug(s, "en"),
    getHindiVersionSlug(s),
  ]);
  const enUrl = `${SITE_URL}/en/articles/${encodeURIComponent(s)}`;
  const hiUrl = hiSlug
    ? `${SITE_URL}/articles/${encodeURIComponent(hiSlug)}`
    : `${SITE_URL}/articles`;

  const title = article?.seo_title ?? article?.title ?? "Article";
  const description = article?.seo_description ?? article?.excerpt ?? "Read on Akelapan";
  const ogImage = article?.featured_image?.startsWith("http")
    ? article.featured_image
    : article?.featured_image
      ? `${SITE_URL}${article.featured_image}`
      : `${SITE_URL}/images/og-default.png`;

  return {
    title,
    description,
    keywords: [
      article?.category ?? "emotional support",
      "loneliness",
      "english",
      "akelapan",
      "mental health",
    ],
    alternates: { canonical: enUrl, languages: { "hi-IN": hiUrl, "en-IN": enUrl } },
    openGraph: {
      type: "article",
      locale: "en_IN",
      url: enUrl,
      siteName: "Akelapan",
      title,
      description,
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630, alt: article?.title ?? "Akelapan" }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getPublishedArticleSlugs(5000, "en");
  return slugs.map((a) => ({ slug: a.slug }));
}

export default async function EnArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(normalizeSlug(slug), "en");

  if (!article) {
    notFound();
  }

  const [relatedArticles, popularByViews, hiSlug, recentEn] = await Promise.all([
    getRelatedArticles(article.slug, article.category_id, 5, "en"),
    getTopArticlesByViews(5, "en"),
    getHindiVersionSlug(article.slug),
    getPublishedArticles(5, "en"),
  ]);
  const popular =
    popularByViews.length > 0
      ? popularByViews
      : recentEn.map((a) => ({ slug: a.slug, title: a.title }));

  return (
    <>
      <ArticleSchema
        title={article.title}
        excerpt={article.excerpt}
        slug={article.slug}
        publishedAt={article.published_at}
        image={article.featured_image}
        basePath={EN_BASE}
        language="en"
      />
      <article>
        <ArticleViewTracker slug={article.slug} />
        <ReadingProgress />
        <div className="border-b border-border bg-muted/20">
          <Container className="py-8 sm:py-12">
            <Button variant="ghost" size="sm" asChild className="mb-6">
              <Link href={`${EN_BASE}/articles`} className="gap-2">
                <ArrowLeft className="size-4" />
                Back to Articles
              </Link>
            </Button>

            <div className="max-w-3xl">
              <CategoryBadge
                label={article.category}
                slug={article.categorySlug}
                className="mb-4"
                basePath={EN_BASE}
              />
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                {article.title}
              </h1>
              <p className="text-muted-foreground mb-4">{article.excerpt}</p>
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="size-4" />
                {article.published_at
                  ? new Date(article.published_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "—"}
              </span>
              {hiSlug && (
                <p className="mt-3 text-sm text-muted-foreground">
                  <Link
                    href={`/articles/${encodeURIComponent(hiSlug)}`}
                    className="hover:text-foreground underline"
                  >
                    Read in Hindi
                  </Link>
                </p>
              )}
            </div>
          </Container>
        </div>

        <Container className="py-8 sm:py-12">
          <div
            className={`grid grid-cols-1 gap-10 ${process.env.NEXT_PUBLIC_ADSENSE_LEFT_SIDEBAR_SLOT ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
          >
            {process.env.NEXT_PUBLIC_ADSENSE_LEFT_SIDEBAR_SLOT && (
              <ArticleLeftSidebar />
            )}
            <div className="lg:col-span-2 space-y-8">
              {article.featured_image && (
                <div className="relative aspect-video w-full max-w-4xl mx-auto">
                  <Image
                    src={article.featured_image}
                    alt={article.title}
                    fill
                    className="object-cover rounded-xl"
                    priority
                  />
                </div>
              )}

              <div
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              <div className="max-w-3xl mx-auto mt-8 flex justify-center">
                <AdSense
                  slotId={process.env.NEXT_PUBLIC_ADSENSE_ARTICLE_SLOT}
                  format="horizontal"
                />
              </div>

              <div className="max-w-3xl mx-auto mt-12 space-y-6">
                <ArticleShare
                  title={article.title}
                  url={`${EN_BASE}/articles/${encodeURIComponent(article.slug)}`}
                />
                <ArticleHelpful articleSlug={article.slug} />
              </div>

              {relatedArticles.length > 0 && (
                <RelatedArticles
                  articles={relatedArticles}
                  basePath={EN_BASE}
                  title="Related articles"
                  subtitle="You might also like"
                />
              )}

              <AffiliateSection />
            </div>

            <ArticleSidebar
              popular={popular}
              basePath={EN_BASE}
            />
          </div>
        </Container>
      </article>
    </>
  );
}
