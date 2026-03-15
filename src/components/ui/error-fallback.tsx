"use client";

import Link from "next/link";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

interface ErrorFallbackProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHome?: boolean;
  children?: React.ReactNode;
}

export function ErrorFallback({
  title = "कुछ गड़बड़ हो गई",
  message = "पेज लोड करते समय समस्या आई। कृपया पुनः प्रयास करें या होम पर जाएं।",
  onRetry,
  showHome = true,
  children,
}: ErrorFallbackProps) {
  return (
    <Container className="flex min-h-[60vh] items-center justify-center py-16">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="size-8" aria-hidden />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          <p className="text-muted-foreground">{message}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {onRetry && (
            <Button onClick={onRetry} variant="default" className="gap-2">
              <RefreshCw className="size-4" />
              पुनः प्रयास करें
            </Button>
          )}
          {children}
          {showHome && (
            <Button asChild variant="outline" className="gap-2">
              <Link href="/">
                <Home className="size-4" />
                होम पर जाएं
              </Link>
            </Button>
          )}
        </div>
      </div>
    </Container>
  );
}
