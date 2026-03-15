import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { getStoryById } from "@/lib/db/stories";

const EN_BASE = "/en";

interface StoryPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: StoryPageProps) {
  const { id } = await params;
  const story = await getStoryById(id);
  return {
    title: story ? `${story.title} | Community Stories | Akelapan` : "Story | Akelapan",
    description: story
      ? story.content.slice(0, 160) + (story.content.length > 160 ? "…" : "")
      : "Community story on Akelapan",
  };
}

export default async function EnStoryPage({ params }: StoryPageProps) {
  const { id } = await params;
  const story = await getStoryById(id);

  if (!story) {
    notFound();
  }

  return (
    <Container className="py-12 sm:py-16">
      <Button variant="ghost" size="sm" asChild className="mb-8">
        <Link href={`${EN_BASE}/stories`} className="gap-2">
          <ArrowLeft className="size-4" />
          Back to Stories
        </Link>
      </Button>

      <article className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <User className="size-4" />
            <span>{story.author_display}</span>
            {story.theme && (
              <>
                <span>•</span>
                <span>{story.theme}</span>
              </>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            {story.title}
          </h1>
          {story.published_at && (
            <p className="text-sm text-muted-foreground mt-2">
              {new Date(story.published_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
        </div>

        <div className="prose prose-lg max-w-none prose-p:text-muted-foreground prose-p:leading-relaxed">
          <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
            {story.content}
          </div>
        </div>
      </article>
    </Container>
  );
}
