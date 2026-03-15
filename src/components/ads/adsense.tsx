"use client";

import Script from "next/script";

/**
 * Google AdSense component.
 * Add NEXT_PUBLIC_ADSENSE_CLIENT_ID to .env.local (e.g. ca-pub-xxxxxxxxxx)
 * Add ad slot IDs for each unit.
 */
interface AdSenseProps {
  slotId?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
}

export function AdSense({ slotId, format = "auto", className = "" }: AdSenseProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  if (!clientId) return null;
  if (!slotId) return null;

  return (
    <div
      className={`min-h-[100px] min-w-[320px] ${className}`}
      suppressHydrationWarning
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={format === "auto"}
      />
      <Script
        id="adsense-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (adsbygoogle = window.adsbygoogle || []).push({});
          `,
        }}
      />
    </div>
  );
}
