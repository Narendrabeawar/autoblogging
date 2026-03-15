"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, User } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { UserStory } from "@/lib/db/stories";

interface StoryCardProps {
  story: UserStory;
  index?: number;
  /** e.g. "/en" for English routes so links go to /en/stories/... */
  basePath?: string;
}

export function StoryCard({ story, index = 0, basePath = "" }: StoryCardProps) {
  const storiesPath = `${basePath}/stories`;
  const readLabel = basePath === "/en" ? "Read full story" : "पूरी कहानी पढ़ें";
  const excerpt =
    story.content.length > 200
      ? story.content.slice(0, 200).trim() + "…"
      : story.content;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <Card className="border-border/60 hover:border-primary/30 transition-all">
        <CardHeader>
          <h2 className="text-xl font-semibold text-foreground line-clamp-2">
            <Link
              href={`/stories/${story.id}`}
              className="hover:text-primary transition-colors"
            >
              {story.title}
            </Link>
          </h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="size-4" />
            <span>{story.author_display}</span>
            {story.theme && (
              <>
                <span>•</span>
                <span>{story.theme}</span>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-3">{excerpt}</p>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" size="sm" asChild className="gap-1">
            <Link href={`${storiesPath}/${story.id}`}>
              {readLabel}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.article>
  );
}
