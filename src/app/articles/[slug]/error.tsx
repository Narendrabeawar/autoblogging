"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ErrorFallback } from "@/components/ui/error-fallback";
import { Button } from "@/components/ui/button";

export default function ArticleSlugError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Article error:", error);
  }, [error]);

  return (
    <ErrorFallback
      title="आर्टिकल नहीं मिला"
      message="यह आर्टिकल लोड नहीं हो पाया। पुनः प्रयास करें या सभी आर्टिकल्स देखें।"
      onRetry={reset}
      showHome
    >
      <Button asChild variant="outline" className="gap-2">
        <Link href="/articles">सभी Articles</Link>
      </Button>
    </ErrorFallback>
  );
}
