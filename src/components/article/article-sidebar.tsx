import Link from "next/link";
import { Compass, TrendingUp } from "lucide-react";
import { AdSense } from "@/components/ads/adsense";
import { CATEGORIES } from "@/lib/constants";

export type PopularArticle = { slug: string; title: string };

interface ArticleSidebarProps {
  popular: PopularArticle[];
  basePath?: string;
  exploreLabel?: string;
  popularLabel?: string;
}

export function ArticleSidebar({
  popular,
  basePath = "",
  exploreLabel = "Explore topics",
  popularLabel = "Popular articles",
}: ArticleSidebarProps) {
  const categoryHref = (slug: string) => `${basePath}/category/${slug}`;
  const articleHref = (slug: string) => `${basePath}/articles/${encodeURIComponent(slug)}`;

  return (
    <aside
      className="lg:col-span-1 flex flex-col gap-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto"
      aria-label="Article sidebar"
    >
      {/* Sponsored — minimal, modern block */}
      <section
        className="rounded-2xl bg-gradient-to-b from-muted/50 to-muted/30 dark:from-muted/20 dark:to-muted/10 border border-border/50 p-4 shadow-sm"
        aria-label="Sponsored"
      >
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground/80 mb-3 font-medium">
          Sponsored
        </p>
        <AdSense
          slotId={process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT}
          format="vertical"
        />
      </section>

      {/* Explore topics — pill-style links */}
      <section
        className="rounded-2xl border border-border/50 bg-card/80 dark:bg-card/50 p-5 shadow-sm backdrop-blur-sm"
        aria-labelledby="sidebar-explore-heading"
      >
        <h2
          id="sidebar-explore-heading"
          className="flex items-center gap-2 text-sm font-semibold text-foreground mb-4"
        >
          <Compass className="size-4 text-primary" aria-hidden />
          {exploreLabel}
        </h2>
        <ul className="flex flex-wrap gap-2" role="list">
          {CATEGORIES.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={categoryHref(cat.slug)}
                className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 dark:bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <span aria-hidden="true" className="text-base leading-none">
                  {cat.icon}
                </span>
                <span>{cat.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Popular articles — numbered list with hover */}
      {popular.length > 0 && (
        <section
          className="rounded-2xl border border-border/50 bg-card/80 dark:bg-card/50 p-5 shadow-sm backdrop-blur-sm"
          aria-labelledby="sidebar-popular-heading"
        >
          <h2
            id="sidebar-popular-heading"
            className="flex items-center gap-2 text-base font-semibold text-emerald-900 dark:text-emerald-200 mb-4"
          >
            <TrendingUp className="size-4 text-primary" aria-hidden />
            {popularLabel}
          </h2>
          <ul className="space-y-0.5" role="list">
            {popular.map((p, i) => (
              <li key={p.slug}>
                <Link
                  href={articleHref(p.slug)}
                  className="group flex gap-3 rounded-lg px-2 py-2.5 -mx-2 text-base text-emerald-900 dark:text-emerald-200 transition-colors hover:bg-muted/50 hover:text-emerald-950 dark:hover:text-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                >
                  <span
                    className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary tabular-nums"
                    aria-hidden
                  >
                    {i + 1}
                  </span>
                  <span className="line-clamp-2">
                    {p.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </aside>
  );
}
