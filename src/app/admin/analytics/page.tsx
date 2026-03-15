import Link from "next/link";
import {
  FileText,
  Mail,
  Eye,
  TrendingUp,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAnalyticsStats, getTopArticlesByViews } from "@/lib/db/analytics";

export default async function AdminAnalyticsPage() {
  const [stats, topArticles] = await Promise.all([
    getAnalyticsStats(),
    getTopArticlesByViews(10),
  ]);

  const statCards = [
    {
      label: "Total Articles",
      value: stats.totalArticles,
      icon: FileText,
      sub: `${stats.publishedArticles} published`,
    },
    {
      label: "Total Views",
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      sub: "All time",
    },
    {
      label: "Newsletter Subscribers",
      value: stats.newsletterCount,
      icon: Mail,
      sub: "Active",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <BarChart3 className="size-6" />
          Analytics
        </h1>
        <Button variant="outline" asChild>
          <Link href="/admin">Back to Dashboard</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-lg border border-border bg-card p-6"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <card.icon className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className="text-2xl font-bold text-foreground">
                  {card.value}
                </p>
                <p className="text-xs text-muted-foreground">{card.sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
          <TrendingUp className="size-5" />
          Top Articles by Views
        </h2>
        {topArticles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 font-medium">Article</th>
                  <th className="text-left py-3 font-medium">Category</th>
                  <th className="text-right py-3 font-medium">Views</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {topArticles.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30"
                  >
                    <td className="py-3">
                      <Link
                        href={`/articles/${encodeURIComponent(a.slug)}`}
                        className="font-medium hover:text-primary line-clamp-1"
                      >
                        {a.title}
                      </Link>
                    </td>
                    <td className="py-3 text-muted-foreground">{a.category}</td>
                    <td className="py-3 text-right font-medium">
                      {a.views.toLocaleString()}
                    </td>
                    <td className="py-3">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/articles/${a.id}/edit`}>
                          <ArrowRight className="size-4" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted-foreground py-8 text-center">
            No view data yet. Views are tracked when readers open articles.
          </p>
        )}
      </div>
    </div>
  );
}
