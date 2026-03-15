"use client";

import { useEffect } from "react";
import { ErrorFallback } from "@/components/ui/error-fallback";

export default function ArticlesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Articles error:", error);
  }, [error]);

  return (
    <ErrorFallback
      title="Articles लोड नहीं हो पाए"
      message="आर्टिकल्स लोड करते समय समस्या आई। पुनः प्रयास करें या होम पर जाएं।"
      onRetry={reset}
      showHome
    />
  );
}
