"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { slugifyEnglish } from "@/lib/slugify";
import type { Category } from "@/lib/db/types";

interface ArticleFormProps {
  categories: Category[];
  article?: {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    category_id: string | null;
    status: string;
  };
}

export function ArticleForm({ categories, article }: ArticleFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [content, setContent] = useState(article?.content ?? "");
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [categoryId, setCategoryId] = useState(article?.category_id ?? "");
  const [status, setStatus] = useState(article?.status ?? "draft");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (!article) setSlug(slugifyEnglish(v) || "");
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const payload = {
      title,
      slug: slug || slugifyEnglish(title) || `article-${Date.now().toString(36)}`,
      content,
      excerpt: excerpt || null,
      category_id: categoryId || null,
      status,
      published_at: status === "published" ? new Date().toISOString() : null,
    };

    if (article) {
      const { error: err } = await supabase
        .from("articles")
        .update(payload)
        .eq("id", article.id);
      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
      if (status === "published") {
        fetch("/api/admin/articles/ping-sitemap", { method: "POST" }).catch(() => {});
      }
      router.push("/admin/articles");
    } else {
      const { error: err } = await supabase.from("articles").insert(payload);
      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
      if (status === "published") {
        fetch("/api/admin/articles/ping-sitemap", { method: "POST" }).catch(() => {});
      }
      router.push("/admin/articles");
    }
    router.refresh();
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Article title"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="article-slug"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Short summary"
          rows={2}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Content (HTML)</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="<p>Article content...</p>"
          rows={12}
          className="font-mono text-sm"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : article ? "Update" : "Create"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/articles">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
