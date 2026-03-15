"use client";

import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "akelapan_helpful";

interface ArticleHelpfulProps {
  articleSlug: string;
  className?: string;
}

export function ArticleHelpful({ articleSlug, className }: ArticleHelpfulProps) {
  const [vote, setVote] = useState<"yes" | "no" | null>(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem(STORAGE_KEY) ?? "{}"
      ) as Record<string, "yes" | "no">;
      setVote(stored[articleSlug] ?? null);
    } catch {
      /* ignore */
    }
  }, [articleSlug]);

  const handleVote = (value: "yes" | "no") => {
    if (vote) return;
    setVote(value);
    try {
      const stored = JSON.parse(
        localStorage.getItem(STORAGE_KEY) ?? "{}"
      ) as Record<string, "yes" | "no">;
      stored[articleSlug] = value;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-start sm:items-center gap-3 py-6 border-t border-border",
        className
      )}
    >
      <span className="text-sm font-medium text-foreground">
        क्या यह लेख मददगार था?
      </span>
      <div className="flex gap-2">
        <Button
          variant={vote === "yes" ? "default" : "outline"}
          size="sm"
          onClick={() => handleVote("yes")}
          disabled={!!vote}
          className="gap-1.5"
        >
          <ThumbsUp className="size-4" />
          हाँ
        </Button>
        <Button
          variant={vote === "no" ? "secondary" : "outline"}
          size="sm"
          onClick={() => handleVote("no")}
          disabled={!!vote}
          className="gap-1.5"
        >
          <ThumbsDown className="size-4" />
          नहीं
        </Button>
      </div>
      {vote && (
        <span className="text-sm text-muted-foreground">
          धन्यवाद! आपकी राय हमारे लिए महत्वपूर्ण है।
        </span>
      )}
    </div>
  );
}
