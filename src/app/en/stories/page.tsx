import Link from "next/link";
import { PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { EmptyState } from "@/components/ui/empty-state";
import { getApprovedStories } from "@/lib/db/stories";
import { StoryCard } from "@/app/stories/story-card";

const EN_BASE = "/en";

export const metadata = {
  title: "Community Stories | Akelapan",
  description:
    "Stories from people like you — real journeys of loneliness, breakup and recovery. Share your story.",
};

export default async function EnStoriesPage() {
  const stories = await getApprovedStories(20);

  return (
    <Container className="py-12 sm:py-16">
      <SectionHeader
        title="Community Stories"
        subtitle="Stories from people like you — real journeys of loneliness and recovery"
      />

      <div className="max-w-2xl mx-auto mb-12 p-4 rounded-lg bg-primary/5 border border-primary/20">
        <p className="text-sm text-muted-foreground">
          The stories shared here are from our readers. All are published with
          consent. Your story can inspire others too.
        </p>
      </div>

      <div className="flex justify-end mb-8">
        <Button asChild>
          <Link href={`${EN_BASE}/stories/submit`} className="gap-2">
            <PenLine className="size-4" />
            Share your story
          </Link>
        </Button>
      </div>

      {stories.length > 0 ? (
        <div className="space-y-6">
          {stories.map((story, i) => (
            <StoryCard key={story.id} story={story} index={i} basePath={EN_BASE} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<PenLine className="size-8" />}
          title="No stories published yet."
          description="You can write the first one! Your story can inspire others."
          action={{ label: "Share your story", href: `${EN_BASE}/stories/submit` }}
          secondaryAction={{ label: "Read articles", href: `${EN_BASE}/articles` }}
        />
      )}
    </Container>
  );
}
