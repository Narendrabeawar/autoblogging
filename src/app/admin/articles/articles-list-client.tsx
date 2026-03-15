"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateEnVersionButton } from "./create-en-version-button";

type ArticleRow = {
  id: string;
  title: string;
  slug: string;
  status: string;
  language?: string;
  published_at: string | null;
  created_at: string;
  categories: { name?: string; slug?: string } | { name?: string; slug?: string }[] | null;
};

export function ArticlesListClient({
  articles,
}: {
  articles: ArticleRow[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [singleDeletingId, setSingleDeletingId] = useState<string | null>(null);

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === articles.length) setSelected(new Set());
    else setSelected(new Set(articles.map((a) => a.id)));
  };

  async function deleteIds(ids: string[]) {
    const res = await fetch("/api/admin/articles/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Delete failed");
      return;
    }
    setSelected(new Set());
    router.refresh();
  }

  async function handleBulkDelete() {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} article(s)? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deleteIds(Array.from(selected));
    } finally {
      setDeleting(false);
    }
  }

  async function handleSingleDelete(e: React.MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Delete this article? This cannot be undone.")) return;
    setSingleDeletingId(id);
    try {
      await deleteIds([id]);
    } finally {
      setSingleDeletingId(null);
    }
  }

  if (!articles.length) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={selected.size === articles.length && articles.length > 0}
            onChange={toggleAll}
            className="rounded border-input size-4"
          />
          Select all
        </label>
        {selected.size > 0 && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            disabled={deleting}
          >
            <Trash2 className="size-4 mr-1" />
            Delete selected ({selected.size})
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {articles.map((a) => {
          const lang = a.language ?? "hi";
          const isHindi = lang === "hi";
          const articleUrl =
            lang === "en"
              ? `/en/articles/${encodeURIComponent(a.slug)}`
              : `/articles/${encodeURIComponent(a.slug)}`;
          const cat = Array.isArray(a.categories) ? a.categories[0] : a.categories;
          const isDeleting = singleDeletingId === a.id;

          return (
            <Card key={a.id}>
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <input
                    type="checkbox"
                    checked={selected.has(a.id)}
                    onChange={() => toggleOne(a.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded border-input size-4 mt-1 shrink-0"
                  />
                  <div className="min-w-0">
                    <CardTitle className="text-base">
                      <Link
                        href={articleUrl}
                        className="hover:text-primary"
                        target="_blank"
                      >
                        {a.title}
                      </Link>
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        {isHindi ? "हिंदी" : "EN"}
                      </span>
                    </CardTitle>
                    <CardDescription>
                      {cat?.name ?? "Uncategorized"} •{" "}
                      <span
                        className={
                          a.status === "published"
                            ? "text-green-600"
                            : "text-muted-foreground"
                        }
                      >
                        {a.status}
                      </span>
                      {a.published_at &&
                        ` • ${new Date(a.published_at).toLocaleDateString()}`}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  {isHindi && <CreateEnVersionButton slug={a.slug} />}
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/admin/articles/${a.id}/edit`}
                      prefetch={false}
                    >
                      <Pencil className="size-4 mr-1" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={(e) => handleSingleDelete(e, a.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
