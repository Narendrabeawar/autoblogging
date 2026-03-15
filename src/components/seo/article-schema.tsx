const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://akelapan.com";

interface ArticleSchemaProps {
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: string | null;
  image?: string | null;
  /** e.g. "/en" for English article page */
  basePath?: string;
  /** Schema inLanguage, default "hi" */
  language?: "hi" | "en";
}

export function ArticleSchema({
  title,
  excerpt,
  slug,
  publishedAt,
  image,
  basePath = "",
  language = "hi",
}: ArticleSchemaProps) {
  const path = basePath ? `${basePath}/articles/${encodeURIComponent(slug)}` : `/articles/${encodeURIComponent(slug)}`;
  const url = `${SITE_URL}${path}`;
  const imageUrl = image?.startsWith("http")
    ? image
    : image?.startsWith("data:")
    ? undefined
    : image
    ? `${SITE_URL}${image}`
    : undefined;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: excerpt,
    url,
    datePublished: publishedAt || undefined,
    publisher: {
      "@type": "Organization",
      name: "Akelapan",
      url: SITE_URL,
    },
    ...(imageUrl && { image: imageUrl }),
    inLanguage: language,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
