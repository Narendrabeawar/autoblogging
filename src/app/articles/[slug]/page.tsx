import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { CategoryBadge } from "@/components/article/category-badge";
import { ArticleHelpful } from "@/components/article/article-helpful";
import { ArticleShare } from "@/components/article/article-share";
import { RelatedArticles } from "@/components/article/related-articles";
import { ReadingProgress } from "@/components/article/reading-progress";
import { AdSense } from "@/components/ads/adsense";
import { AffiliateSection } from "@/components/ads/affiliate-section";
import { getArticleBySlug, getRelatedArticles, hasEnglishVersion, getEnglishVersionSlug, getPublishedArticleSlugs } from "@/lib/db/articles";
import { ArticleSchema } from "@/components/seo/article-schema";
import { ArticleViewTracker } from "@/components/article/article-view-tracker";
import { getTopArticlesByViews } from "@/lib/db/analytics";
import { ArticleSidebar } from "@/components/article/article-sidebar";
import { ArticleLeftSidebar } from "@/components/article/article-left-sidebar";
import { BLUR_DATA_URL } from "@/lib/constants";

export const revalidate = 86400;

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
  const [article, hasEn, enSlug] = await Promise.all([
    getArticleBySlug(s),
    hasEnglishVersion(s),
    getEnglishVersionSlug(s),
  ]);
  const hiUrl = `${SITE_URL}/articles/${encodeURIComponent(s)}`;
  const languages: Record<string, string> = { "hi-IN": hiUrl };
  if (hasEn && enSlug) languages["en-IN"] = `${SITE_URL}/en/articles/${encodeURIComponent(enSlug)}`;

  const title = article?.seo_title ?? article?.title ?? "Article";
  const description = article?.seo_description ?? article?.excerpt ?? "Read on Akelapan";
  const ogImage = article?.featured_image?.startsWith("http")
    ? article.featured_image
    : article?.featured_image?.startsWith("data:")
      ? undefined
      : article?.featured_image
        ? `${SITE_URL}${article.featured_image}`
        : `${SITE_URL}/images/og-default.png`;

  return {
    title,
    description,
    keywords: [
      article?.category ?? "emotional support",
      "loneliness",
      "hindi",
      "akelapan",
      "mental health",
    ],
    alternates: { canonical: hiUrl, languages },
    openGraph: {
      type: "article",
      locale: "hi_IN",
      url: hiUrl,
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
  const slugs = await getPublishedArticleSlugs(5000, "hi");
  return slugs.map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(normalizeSlug(slug));

  if (!article) {
    notFound();
  }

  const [relatedArticles, popular, enSlug] = await Promise.all([
    getRelatedArticles(
      article.slug,
      article.category_id,
      5
    ),
    getTopArticlesByViews(5),
    getEnglishVersionSlug(article.slug),
  ]);

  return (
    <>
      <ArticleSchema
        title={article.title}
        excerpt={article.excerpt}
        slug={article.slug}
        publishedAt={article.published_at}
        image={article.featured_image}
      />
      <article>
        <ArticleViewTracker slug={article.slug} />
        <ReadingProgress />
        <div className="border-b border-border bg-muted/20">
          <Container className="py-8 sm:py-12">
            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: "Articles", href: "/articles" },
                {
                  label: article.category,
                  href: `/category/${article.categorySlug}`,
                },
                { label: article.title, href: "#" },
              ]}
              className="mb-6"
            />
            <Button variant="ghost" size="sm" asChild className="mb-6">
              <Link href="/articles" className="gap-2">
                <ArrowLeft className="size-4" />
                वापस Articles
              </Link>
            </Button>

            <div className="max-w-3xl">
              <CategoryBadge
                label={article.category}
                slug={article.categorySlug}
                className="mb-4"
              />
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                {article.title}
              </h1>
              <p className="text-muted-foreground mb-4">{article.excerpt}</p>
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="size-4" />
                {article.published_at
                  ? new Date(article.published_at).toLocaleDateString(
                      "hi-IN",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )
                  : "—"}
              </span>
              {enSlug && (
                <p className="mt-3 text-sm text-muted-foreground">
                  <Link
                    href={`/en/articles/${encodeURIComponent(enSlug)}`}
                    className="hover:text-foreground underline"
                  >
                    Read in English
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
                  {article.featured_image.startsWith("data:") ? (
                    <img
                      src={article.featured_image}
                      alt={article.title}
                      className="size-full object-cover rounded-xl"
                    />
                  ) : (
                    <Image
                      src={article.featured_image}
                      alt={article.title}
                      fill
                      className="object-cover rounded-xl"
                      priority
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                    />
                  )}
                </div>
              )}

              <div
                className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground dark:prose-invert"
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
                  url={`/articles/${encodeURIComponent(article.slug)}`}
                />
                <ArticleHelpful articleSlug={article.slug} />
              </div>

              {relatedArticles.length > 0 && (
                <RelatedArticles articles={relatedArticles} />
              )}

              <AffiliateSection />
            </div>

            <ArticleSidebar
              popular={popular}
              basePath=""
              exploreLabel="विषय देखें"
              popularLabel="लोकप्रिय लेख"
            />
          </div>
        </Container>
      </article>
    </>
  );
}
