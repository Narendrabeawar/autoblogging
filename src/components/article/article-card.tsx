"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CategoryBadge } from "@/components/article/category-badge";
import { cn } from "@/lib/utils";
import { BLUR_DATA_URL } from "@/lib/constants";

export interface ArticleCardProps {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  categorySlug?: string;
  featuredImage?: string | null;
  publishedAt?: string;
  className?: string;
  index?: number;
  /** e.g. "/en" for English routes so links go to /en/articles/... */
  basePath?: string;
}

const articlesPath = (basePath: string) =>
  basePath ? `${basePath}/articles` : "/articles";

export function ArticleCard({
  title,
  slug,
  excerpt,
  category,
  categorySlug,
  featuredImage,
  publishedAt,
  className,
  index = 0,
  basePath = "",
}: ArticleCardProps) {
  const toArticles = articlesPath(basePath);
  const isEn = basePath === "/en";
  const dateLocale = isEn ? "en-IN" : "hi-IN";
  const readLabel = isEn ? "Read" : "पढ़ें";
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={cn("group", className)}
    >
      <Card className="h-full overflow-hidden border-border/60 bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300">
        <div className="relative aspect-video overflow-hidden bg-muted">
          <Link href={`${toArticles}/${encodeURIComponent(slug)}`} className="block absolute inset-0 z-0">
            {featuredImage ? (
              featuredImage.startsWith("data:") ? (
                <img
                  src={featuredImage}
                  alt={title}
                  className="absolute inset-0 size-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <Image
                  src={featuredImage}
                  alt={title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                />
              )
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                <span className="text-4xl opacity-30">💭</span>
              </div>
            )}
          </Link>
          <div className="absolute top-3 left-3 z-10">
            <CategoryBadge
              label={category}
              slug={categorySlug ?? category.toLowerCase().replace(/\s+/g, "-")}
              basePath={basePath}
            />
          </div>
        </div>
        <CardHeader>
          <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
            <Link href={`${toArticles}/${encodeURIComponent(slug)}`} className="hover:opacity-90">
              {title}
            </Link>
          </CardTitle>
          <CardDescription className="line-clamp-2">{excerpt}</CardDescription>
        </CardHeader>
        <CardFooter className="flex items-center justify-between pt-0">
          {publishedAt && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="size-3.5" />
              {new Date(publishedAt).toLocaleDateString(dateLocale, {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          )}
          <Button variant="ghost" size="sm" asChild className="gap-1">
            <Link href={`${toArticles}/${encodeURIComponent(slug)}`}>
              {readLabel}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.article>
  );
}
