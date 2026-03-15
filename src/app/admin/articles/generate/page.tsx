"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function GenerateArticlePage() {
  const [topic, setTopic] = useState("");
  const [categorySlug, setCategorySlug] = useState("loneliness");
  const [language, setLanguage] = useState<"hi" | "en" | "both">("hi");
  const [generateImage, setGenerateImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

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
    <div className="max-w-xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/articles" className="gap-2">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
      </div>

      <h1 className="text-2xl font-semibold flex items-center gap-2">
        <Sparkles className="size-6 text-primary" />
        AI Article Generator
      </h1>

      <form onSubmit={handleGenerate} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="language">Article language</Label>
          <select
            id="language"
            value={language}
            onChange={(e) =>
              setLanguage(e.target.value as "hi" | "en" | "both")
            }
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="hi">हिंदी (Hindi)</option>
            <option value="en">English</option>
            <option value="both">दोनों (Hindi + English both)</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="topic">Topic</Label>
          <Input
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={
              language === "en"
                ? "e.g. How to cope with loneliness"
                : "e.g. अकेलेपन से कैसे निपटें"
            }
            required
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="generateImage"
            checked={generateImage}
            onChange={(e) => setGenerateImage(e.target.checked)}
            className="rounded border-input"
          />
          <Label htmlFor="generateImage" className="cursor-pointer">
            Generate featured image (Imagen 4, uses extra credits)
          </Label>
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="loneliness">Loneliness</option>
            <option value="breakup">Breakup</option>
            <option value="relationships">Relationships</option>
            <option value="friendship">Friendship</option>
            <option value="self-improvement">Self Improvement</option>
            <option value="mental-strength">Mental Strength</option>
            <option value="motivation">Motivation</option>
            <option value="life-advice">Life Advice</option>
          </select>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={loading} className="gap-2">
          <Sparkles className="size-4" />
          {loading ? "Generating..." : "Generate Article"}
        </Button>
      </form>

      <p className="text-sm text-muted-foreground">
        Uses Google Gemini to generate a 1200-1500 word article in Hindi or
        English. Requires GEMINI_API_KEY in .env.local
      </p>
    </div>
  );
}
