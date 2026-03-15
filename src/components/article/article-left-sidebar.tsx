import { AdSense } from "@/components/ads/adsense";

/**
 * Left sidebar for article layout — advertisement only.
 * Renders only when NEXT_PUBLIC_ADSENSE_LEFT_SIDEBAR_SLOT is set.
 */
export function ArticleLeftSidebar() {
  const slotId = process.env.NEXT_PUBLIC_ADSENSE_LEFT_SIDEBAR_SLOT;
  if (!slotId) return null;

  return (
    <aside
      className="hidden lg:block lg:col-span-1 lg:sticky lg:top-24 lg:self-start"
      aria-label="Advertisement"
    >
      <div className="rounded-2xl bg-muted/30 border border-border/50 p-4 shadow-sm">
        <AdSense
          slotId={slotId}
          format="vertical"
          className="min-w-[160px]"
        />
      </div>
    </aside>
  );
}
