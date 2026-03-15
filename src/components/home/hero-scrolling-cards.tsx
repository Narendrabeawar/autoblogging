"use client";

import Link from "next/link";
import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/constants";

export interface HeroTickerItem {
  title: string;
  href: string;
  imageUrl: string | null;
}

const CARD_WIDTH = 208;

export function HeroScrollingCards({ items }: { items: HeroTickerItem[] }) {
  if (!items.length) return null;

  return (
    <div
      className="relative w-full overflow-hidden py-2"
      aria-label="Popular articles"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)",
      }}
    >
      <div className="flex w-max animate-hero-ticker items-stretch gap-4">
        {[1, 2].map((copy) => (
          <div key={copy} className="flex items-stretch gap-4 pr-4">
            {items.map((item, i) => (
              <Link
                key={`${copy}-${item.href}-${i}`}
                href={item.href}
                className="flex flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm transition-colors hover:border-primary/40 hover:shadow-md"
                style={{
                  width: CARD_WIDTH,
                  minWidth: CARD_WIDTH,
                  maxWidth: CARD_WIDTH,
                }}
              >
                <div className="relative aspect-square w-full overflow-hidden bg-muted">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes={`${CARD_WIDTH}px`}
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-4xl text-muted-foreground/50">
                      📄
                    </div>
                  )}
                </div>
                <p className="line-clamp-2 overflow-hidden px-3 py-2.5 text-sm font-medium leading-snug text-foreground break-words">
                  {item.title}
                </p>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
