import Link from "next/link";
import { FileText, Plus, BarChart3, Eye, Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPublishedArticles } from "@/lib/db/articles";
import { getAnalyticsStats } from "@/lib/db/analytics";

export default async function AdminDashboardPage() {
  let articles: Awaited<ReturnType<typeof getPublishedArticles>> = [];
  let stats: Awaited<ReturnType<typeof getAnalyticsStats>> | null = null;
  let loadError = false;
  try {
    const [articlesData, statsData] = await Promise.all([
      getPublishedArticles(20),
      getAnalyticsStats(),
    ]);
    articles = articlesData;
    stats = statsData;
  } catch {
    loadError = true;
    stats = {
      publishedArticles: 0,
      totalViews: 0,
      newsletterCount: 0,
    };
  }

  return (
    <div className="space-y-8">
      {loadError && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40 p-4 flex items-center gap-2 text-amber-800 dark:text-amber-200 text-sm">
          <AlertCircle className="size-4 shrink-0" />
          <span>Could not load full data (connection issue). Refresh the page to retry.</span>
        </div>
      )}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Button asChild>
          <Link href="/admin/articles/new" className="gap-2">
            <Plus className="size-4" />
            New Article
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/admin/analytics"
          className="rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-colors"
        >
          <p className="text-sm text-muted-foreground">Published</p>
          <p className="text-xl font-bold">{stats.publishedArticles}</p>
        </Link>
        <Link
          href="/admin/analytics"
          className="rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-colors"
        >
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Eye className="size-3.5" /> Views
          </p>
          <p className="text-xl font-bold">{(stats?.totalViews ?? 0).toLocaleString()}</p>
        </Link>
        <Link
          href="/admin/analytics"
          className="rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-colors"
        >
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Mail className="size-3.5" /> Subscribers
          </p>
          <p className="text-xl font-bold">{stats?.newsletterCount ?? 0}</p>
        </Link>
        <Link
          href="/admin/analytics"
          className="rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-colors flex items-center gap-2"
        >
          <BarChart3 className="size-5 text-primary" />
          <span className="text-sm font-medium">View Analytics</span>
        </Link>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
          <FileText className="size-5" />
          Recent Articles
        </h2>
        {articles.length > 0 ? (
          <ul className="space-y-2">
            {articles.map((a) => (
              <li key={a.slug} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <Link
                  href={`/articles/${encodeURIComponent(a.slug)}`}
                  className="hover:text-primary font-medium"
                >
                  {a.title}
                </Link>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/articles/${a.id}/edit`}>Edit</Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground py-4">
            No articles yet. Create your first article to get started.
          </p>
        )}
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/admin/articles">View all articles</Link>
        </Button>
      </div>
    </div>
  );
}
