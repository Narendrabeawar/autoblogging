"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BLUR_DATA_URL } from "@/lib/constants";

interface CategoryCardProps {
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  index?: number;
  className?: string;
  /** e.g. "/en" for English routes */
  basePath?: string;
}

export function CategoryCard({
  name,
  slug,
  icon = "💭",
  description,
  image,
  imageAlt,
  index = 0,
  className,
  basePath = "",
}: CategoryCardProps) {
  const categoryHref = basePath ? `${basePath}/category/${slug}` : `/category/${slug}`;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={cn("group", className)}
    >
      <Link href={categoryHref}>
        <Card className="h-full overflow-hidden rounded-xl border-border/60 bg-card py-0 gap-0 shadow-sm hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
          <CardContent className="p-0 flex flex-col">
            <div className="relative aspect-[5/2] w-full overflow-hidden rounded-t-xl bg-gradient-to-br from-primary/10 via-accent/10 to-background [&_img]:object-cover">
              {image ? (
                <Image
                  src={image}
                  alt={imageAlt || name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl opacity-60">{icon}</span>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white/90 to-transparent px-3 py-2">
                <h3 className="font-bold text-base text-[#1e3a5f] drop-shadow-sm group-hover:text-[#0f2744] transition-colors">
                  {name}
                </h3>
              </div>
            </div>

            <div className="p-3 flex flex-col gap-1.5">
              {description && (
                <p className="text-base text-muted-foreground line-clamp-2 leading-normal">
                  {description}
                </p>
              )}
              <span className="inline-flex items-center gap-1 text-xs font-medium text-primary mt-1">
                Explore
                <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
