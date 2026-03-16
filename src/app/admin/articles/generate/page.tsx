"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";
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

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

export default function GenerateArticlePage() {
  const [topic, setTopic] = useState("");
  const [categorySlug, setCategorySlug] = useState("loneliness");
  const [language, setLanguage] = useState<"hi" | "en" | "both">("hi");
  const [generateImage, setGenerateImage] = useState(false);
  const [targetWords, setTargetWords] = useState<string>("");
  const [autoPublish, setAutoPublish] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([
    { id: "loneliness", name: "Loneliness", slug: "loneliness" },
    { id: "breakup", name: "Breakup", slug: "breakup" },
    { id: "relationships", name: "Relationships", slug: "relationships" },
    { id: "friendship", name: "Friendship", slug: "friendship" },
    { id: "self-improvement", name: "Self Improvement", slug: "self-improvement" },
    { id: "mental-strength", name: "Mental Strength", slug: "mental-strength" },
    { id: "motivation", name: "Motivation", slug: "motivation" },
    { id: "life-advice", name: "Life Advice", slug: "life-advice" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    async function loadCategories() {
      try {
        const res = await fetch("/api/admin/categories");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && Array.isArray(data.categories)) {
          setCategories((prev) => {
            // merge existing defaults with server categories (avoid duplicates)
            const bySlug = new Map<string, CategoryOption>();
            for (const c of prev) bySlug.set(c.slug, c);
            for (const c of data.categories as CategoryOption[]) {
              bySlug.set(c.slug, c);
            }
            return Array.from(bySlug.values());
          });
        }
      } catch {
        // ignore – fall back to defaults
      }
    }
    loadCategories();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleAddCategory() {
    const name = window.prompt("New category name?");
    if (!name) return;
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok || !data.category) {
        alert(data.error ?? "Failed to create category");
        return;
      }
      setCategories((prev) => [...prev, data.category]);
      setCategorySlug(data.category.slug);
    } catch {
      alert("Something went wrong while creating category");
    }
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/generate-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          categorySlug: categorySlug || "loneliness",
          language,
          generateImage,
          autoPublish,
          targetWords: targetWords ? Number(targetWords) : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Generation failed");
        setLoading(false);
        return;
      }

      if (data.both) {
        router.push("/admin/articles");
        router.refresh();
      } else {
        router.push(`/admin/articles/${data.articleId}/edit`);
        router.refresh();
      }
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col px-4 py-8">
      <div className="w-full">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-1">
          <Link href="/admin/articles" className="gap-2">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
      </div>

      <Card className="w-full overflow-hidden border-2 shadow-lg shadow-primary/5 dark:shadow-none">
        <CardHeader className="space-y-2 border-b bg-muted/30 pb-6">
          <CardTitle className="flex items-center gap-3 text-xl">
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary/15">
              <Sparkles className="size-6 text-primary" />
            </span>
            AI Article Generator
          </CardTitle>
          <CardDescription className="text-base">
            Uses Google Gemini to generate a 1200–1500 word article in Hindi or English by default. You can also set a custom target word count. Requires GEMINI_API_KEY in .env.local
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language" className="text-sm font-medium">Article language</Label>
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
            <div className="space-y-2">
              <Label htmlFor="topic" className="text-sm font-medium">Topic</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={
                  language === "en"
                    ? "e.g. How to cope with loneliness"
                    : "e.g. अकेलेपन से कैसे निपटें"
                }
                className="h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Category
              </Label>
              <div className="flex gap-2">
                <select
                  id="category"
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  className="h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="outline"
                  className="whitespace-nowrap"
                  onClick={handleAddCategory}
                >
                  + New
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetWords" className="text-sm font-medium">
                Target words (optional)
              </Label>
              <Input
                id="targetWords"
                type="number"
                min={500}
                max={3000}
                value={targetWords}
                onChange={(e) => setTargetWords(e.target.value)}
                placeholder="e.g. 2000"
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty for default 1200–1500 words. Approximate only; AI may vary slightly.
              </p>
            </div>
            <div className="flex flex-wrap gap-6 rounded-lg border border-border/60 bg-muted/20 p-4">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  id="generateImage"
                  checked={generateImage}
                  onChange={(e) => setGenerateImage(e.target.checked)}
                  className="size-4 rounded border-input"
                />
                <span className="text-sm">
                  Generate featured image (Imagen 4, uses extra credits)
                </span>
              </label>
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  id="autoPublish"
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
              className="w-full gap-2 sm:w-auto sm:min-w-[200px]"
            >
              <Sparkles className="size-5" />
              {loading ? "Generating..." : "Generate Article"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
