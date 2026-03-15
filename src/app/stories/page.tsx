import Link from "next/link";
import { PenLine, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { EmptyState } from "@/components/ui/empty-state";
import { getApprovedStories } from "@/lib/db/stories";
import { StoryCard } from "./story-card";

export const metadata = {
  title: "Community Stories | Akelapan",
  description:
    "आपके जैसे लोगों की कहानियाँ। अकेलेपन, breakup और recovery की real stories।",
};

export default async function StoriesPage() {
  const stories = await getApprovedStories(20);

  return (
    <Container className="py-12 sm:py-16">
      <SectionHeader
        title="Community Stories"
        subtitle="आपके जैसे लोगों की कहानियाँ — अकेलेपन और recovery की real journeys"
      />

      <div className="max-w-2xl mx-auto mb-12 p-4 rounded-lg bg-primary/5 border border-primary/20">
        <p className="text-sm text-muted-foreground">
          यहाँ shared stories हमारे readers की हैं। ये सभी consent के साथ
          publish की गई हैं। आपकी कहानी भी दूसरों को प्रेरणा दे सकती है।
        </p>
      </div>

      <div className="flex justify-end mb-8">
        <Button asChild>
          <Link href="/stories/submit" className="gap-2">
            <PenLine className="size-4" />
            अपनी कहानी साझा करें
          </Link>
        </Button>
      </div>

      {stories.length > 0 ? (
        <div className="space-y-6">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<PenLine className="size-8" />}
          title="अभी तक कोई story publish नहीं हुई।"
          description="पहली कहानी आप लिख सकते हैं! आपकी कहानी दूसरों को प्रेरणा दे सकती है।"
          action={{ label: "अपनी कहानी साझा करें", href: "/stories/submit" }}
          secondaryAction={{ label: "Articles पढ़ें", href: "/articles" }}
        />
      )}
    </Container>
  );
}
