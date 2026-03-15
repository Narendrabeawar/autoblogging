"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CATEGORIES = [
  { value: "all", label: "सभी (AI चुनेगा)" },
  { value: "loneliness", label: "Loneliness" },
  { value: "breakup", label: "Breakup" },
  { value: "relationships", label: "Relationships" },
  { value: "friendship", label: "Friendship" },
  { value: "self-improvement", label: "Self Improvement" },
  { value: "mental-strength", label: "Mental Strength" },
  { value: "motivation", label: "Motivation" },
  { value: "life-advice", label: "Life Advice" },
];

interface ResultItem {
  title: string;
  slug: string;
  /** English article slug when both HI+EN were created (EN has its own slug) */
  enSlug?: string;
  status: string;
  error?: string;
  both?: boolean;
}

export default function FullAutoPage() {
  const router = useRouter();
  const [count, setCount] = useState(5);
  const [categorySlug, setCategorySlug] = useState("all");
  const [language, setLanguage] = useState<"hi" | "en" | "both">("hi");
  const [autoPublish, setAutoPublish] = useState(false);
  const [generateImage, setGenerateImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<ResultItem[] | null>(null);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResults(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/full-auto-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          count: Math.min(Math.max(count, 1), 20),
          categorySlug,
          language,
          autoPublish,
          generateImage,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Generation failed");
        setLoading(false);
        return;
      }

      setResults(data.results ?? []);
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center px-4 py-8">
      <div className="w-full">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-1">
          <Link href="/admin" className="gap-2">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
      </div>

      <Card className="w-full overflow-hidden border-2 shadow-lg shadow-primary/5 dark:shadow-none">
        <CardHeader className="space-y-2 border-b bg-muted/30 pb-6">
          <CardTitle className="flex items-center gap-3 text-xl">
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary/15">
              <Zap className="size-6 text-primary" />
            </span>
            Full Auto Article Generator
          </CardTitle>
          <CardDescription className="text-base leading-relaxed">
            AI खुद topics ढूंढेगा (trends, season, search patterns), best titles बनाएगा, और articles generate करेगा। आप बस count बताएं।
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <form onSubmit={handleGenerate} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="count" className="text-sm font-medium">
                  कितने articles बनाने हैं? (1–20)
                </Label>
                <Input
                  id="count"
                  type="number"
                  min={1}
                  max={20}
                  value={count}
                  className="h-11"
                  onChange={(e) =>
                    setCount(Math.min(20, Math.max(1, parseInt(e.target.value, 10) || 1)))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Category (optional)
                </Label>
                <select
                  id="category"
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  className="h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language" className="text-sm font-medium">
                Article language
              </Label>
              <select
                id="language"
                value={language}
                onChange={(e) =>
                  setLanguage(e.target.value as "hi" | "en" | "both")
                }
                className="h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <option value="hi">हिंदी (Hindi)</option>
                <option value="en">English</option>
                <option value="both">दोनों (Hindi + English both)</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-6 rounded-lg border border-border/60 bg-muted/20 p-4">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={generateImage}
                  onChange={(e) => setGenerateImage(e.target.checked)}
                  className="size-4 rounded border-input"
                />
                <span className="text-sm">
                  Featured image बनाएं (Imagen 4, extra credits)
                </span>
              </label>
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={autoPublish}
                  onChange={(e) => setAutoPublish(e.target.checked)}
                  className="size-4 rounded border-input"
                />
                <span className="text-sm">
                  तुरंत publish करें (वरना draft रहेगा)
                </span>
              </label>
            </div>

            {error && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="w-full gap-2 sm:w-auto sm:min-w-[220px]"
            >
              <Zap className="size-5" />
              {loading
                ? "AI काम कर रहा है… (2–3 min लग सकता है)"
                : "Start Full Auto"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {results && results.length > 0 && (
        <Card className="mt-8 w-full border-2 shadow-md">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle>Results</CardTitle>
            <CardDescription>
              {results.filter((r) => r.status !== "failed").length} created,{" "}
              {results.filter((r) => r.status === "failed").length} failed
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-1">
              {results.map((r, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-lg py-3 px-2 transition-colors hover:bg-muted/40"
                >
                  {r.status === "failed" ? (
                    <XCircle className="size-5 text-destructive shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle className="size-5 text-green-600 shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{r.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.status}
                      {r.error && ` — ${r.error}`}
                    </p>
                  </div>
                  {r.slug && (
                    <span className="flex gap-1 shrink-0">
                      {r.both ? (
                        <>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/articles/${r.slug}`} target="_blank">
                              हिंदी
                            </Link>
                          </Button>
                          {r.enSlug ? (
                            <Button variant="ghost" size="sm" asChild>
                              <Link
                                href={`/en/articles/${encodeURIComponent(r.enSlug)}`}
                                target="_blank"
                              >
                                EN
                              </Link>
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground" title="English version not created">
                              EN (failed)
                            </span>
                          )}
                        </>
                      ) : (
                        <Button variant="ghost" size="sm" asChild>
                          <Link
                            href={
                              language === "en"
                                ? `/en/articles/${r.slug}`
                                : `/articles/${r.slug}`
                            }
                            target="_blank"
                          >
                            View
                          </Link>
                        </Button>
                      )}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <p className="mt-8 max-w-xl text-center text-sm text-muted-foreground">
        AI considers: current month/season, Google/YouTube search trends, Quora/Reddit questions, and SEO. Topics are unique and varied.
      </p>
    </div>
  );
}
