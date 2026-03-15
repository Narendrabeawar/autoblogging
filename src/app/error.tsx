"use client";

import { useEffect } from "react";
import { ErrorFallback } from "@/components/ui/error-fallback";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <ErrorFallback
      title="कुछ गड़बड़ हो गई"
      message="साइट लोड करते समय समस्या आई। कृपया पुनः प्रयास करें।"
      onRetry={reset}
      showHome
    />
  );
}
