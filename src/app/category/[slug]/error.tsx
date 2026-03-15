"use client";

import { useEffect } from "react";
import { ErrorFallback } from "@/components/ui/error-fallback";

export default function CategorySlugError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Category error:", error);
  }, [error]);

  return (
    <ErrorFallback
      title="कैटेगरी लोड नहीं हुई"
      message="इस कैटेगरी के आर्टिकल्स लोड करते समय समस्या आई। पुनः प्रयास करें।"
      onRetry={reset}
      showHome
    />
  );
}
