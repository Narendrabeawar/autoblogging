"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Sets document.documentElement.lang from pathname so /en routes get lang="en"
 * without making root layout dynamic (no headers() in layout).
 */
export function HtmlLangSync() {
  const pathname = usePathname();
  useEffect(() => {
    const lang = pathname?.startsWith("/en") ? "en" : "hi";
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [pathname]);
  return null;
}
