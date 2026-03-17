import type { MetadataRoute } from "next";
import {
  getPublishedArticleSlugsAllLanguages,
} from "@/lib/db/articles";
import { CATEGORIES } from "@/lib/constants";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://akelapan.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getPublishedArticleSlugsAllLanguages(2000);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/en`, lastModified: new Date(), changeFrequency: "daily", priority: 0.95 },
    { url: `${BASE_URL}/articles`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/en/articles`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/crisis`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/stories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/en/stories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/stories/submit`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/quiz`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    ...CATEGORIES.map((c) => ({
      url: `${BASE_URL}/category/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...CATEGORIES.map((c) => ({
      url: `${BASE_URL}/en/category/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url:
      a.language === "en"
        ? `${BASE_URL}/en/articles/${encodeURIComponent(a.slug)}`
        : `${BASE_URL}/articles/${encodeURIComponent(a.slug)}`,
    lastModified: a.published_at ? new Date(a.published_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...articlePages];
}
