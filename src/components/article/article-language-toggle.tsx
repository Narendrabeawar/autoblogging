"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ArticleLanguageToggleProps {
  slug: string;
  initialHtml: string;
}

type Lang = "hi" | "en";

export function ArticleLanguageToggle({
  slug,
  initialHtml,
}: ArticleLanguageToggleProps) {
  const [lang, setLang] = useState<Lang>("hi");
  const [html, setHtml] = useState<string>(initialHtml);
  const [loading, setLoading] = useState(false);
  const [loadedEn, setLoadedEn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function switchLang(next: Lang) {
    if (next === lang) return;
    setError(null);

    if (next === "hi") {
      setLang("hi");
      setHtml(initialHtml);
      return;
    }

    if (loadedEn) {
      setLang("en");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/articles/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, targetLang: "en" }),
      });
      const data = await res.json();
      if (!res.ok || !data.content) {
        setError(data.error ?? "Translation failed");
        return;
      }
      setHtml(data.content as string);
      setLang("en");
      setLoadedEn(true);
    } catch {
      setError("Translation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="inline-flex items-center gap-2 rounded-full bg-muted/60 p-1 text-xs">
        <span className="px-2 text-muted-foreground">Language</span>
        <Button
          type="button"
          size="sm"
          variant={lang === "hi" ? "default" : "ghost"}
          className="h-7 px-3 text-xs"
          onClick={() => switchLang("hi")}
        >
          हिन्दी
        </Button>
        <Button
          type="button"
          size="sm"
          variant={lang === "en" ? "default" : "ghost"}
          className="h-7 px-3 text-xs"
          onClick={() => switchLang("en")}
          disabled={loading}
        >
          English
        </Button>
      </div>
      {error && (
        <p className="text-xs text-destructive">
          {error}
        </p>
      )}
      <div
        className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

