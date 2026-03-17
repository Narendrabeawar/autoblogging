import Link from "next/link";
import { BookOpen, Check, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllStoriesForAdmin } from "@/lib/db/stories-admin";
import { StoryActions } from "./story-actions";

const PAGE_SIZE = 50;

interface AdminStoriesPageProps {
  searchParams?: Promise<{ page?: string }>;
}

export default async function AdminStoriesPage({
  searchParams,
}: AdminStoriesPageProps) {
  const params = (await searchParams) ?? {};
  const currentPage = Math.max(
    1,
    Number.parseInt(params.page ?? "1", 10) || 1
  );

  const stories = await getAllStoriesForAdmin(PAGE_SIZE);

  const pending = stories.filter((s) => s.status === "pending");
  const approved = stories.filter((s) => s.status === "approved");
  const rejected = stories.filter((s) => s.status === "rejected");

  const hasNextPage = stories.length === PAGE_SIZE;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Community Stories</h1>
        <Button variant="outline" asChild>
          <Link href="/stories" className="gap-2" target="_blank">
            <BookOpen className="size-4" />
            View Public Page
          </Link>
        </Button>
      </div>

      {pending.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="size-5 text-amber-500" />
              Pending ({pending.length})
            </CardTitle>
            <CardDescription>
              Stories awaiting moderation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {pending.map((story) => (
                <li
                  key={story.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-border"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{story.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {story.author_display} •{" "}
                      {new Date(story.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {story.content.slice(0, 150)}…
                    </p>
                  </div>
                  <StoryActions
                    storyId={story.id}
                    status={story.status}
                    consentGiven={story.consent_given}
                  />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {approved.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <Check className="size-5" />
              Approved ({approved.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {approved.map((story) => (
                <li
                  key={story.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <Link
                    href={`/stories/${story.id}`}
                    target="_blank"
                    className="hover:text-primary font-medium truncate flex-1"
                  >
                    {story.title}
                  </Link>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {story.published_at
                      ? new Date(story.published_at).toLocaleDateString()
                      : "—"}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {rejected.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-muted-foreground">
              <X className="size-5" />
              Rejected ({rejected.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {rejected.map((story) => (
                <li
                  key={story.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <span className="font-medium truncate flex-1">
                    {story.title}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {new Date(story.created_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {stories.length === 0 && (
        <div className="text-center py-16 rounded-lg border border-dashed border-border">
          <p className="text-muted-foreground">
            No community stories submitted yet.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between pt-4">
        <Button
          variant="outline"
          asChild
          disabled={currentPage <= 1}
        >
          <Link
            href={
              currentPage <= 2
                ? "/admin/stories"
                : `/admin/stories?page=${currentPage - 1}`
            }
          >
            Previous
          </Link>
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {currentPage}
        </span>
        <Button
          variant="outline"
          asChild
          disabled={!hasNextPage}
        >
          <Link href={`/admin/stories?page=${currentPage + 1}`}>
            Next
          </Link>
        </Button>
      </div>
    </div>
  );
}
