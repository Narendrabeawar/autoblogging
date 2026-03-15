import Link from "next/link";
import { ClipboardList, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { EmptyState } from "@/components/ui/empty-state";
import { getActiveQuizzes } from "@/lib/db/quizzes";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Self Assessment | Akelapan",
  description:
    "अपनी emotional state का आकलन करें। Loneliness और mental wellness के लिए free assessments।",
};

export default async function QuizPage() {
  const quizzes = await getActiveQuizzes();

  return (
    <Container className="py-12 sm:py-16">
      <SectionHeader
        title="Self Assessment"
        subtitle="अपनी emotional state समझने के लिए ये छोटे assessments करें"
      />

      <div className="max-w-2xl mx-auto mb-12 p-4 rounded-lg bg-primary/5 border border-primary/20">
        <p className="text-sm text-muted-foreground">
          ये assessments पेशेवर निदान नहीं हैं। ये सिर्फ आपको अपनी feelings
          समझने में मदद करते हैं। अगर आपको लगातार परेशानी हो तो किसी counselor
          से बात करें।
        </p>
      </div>

      {quizzes.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {quizzes.map((quiz) => (
            <Card
              key={quiz.id}
              className="border-border/60 hover:border-primary/30 transition-all"
            >
              <CardHeader>
                <div className="flex items-center gap-2 text-primary mb-2">
                  <ClipboardList className="size-5" />
                </div>
                <CardTitle>{quiz.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {quiz.description}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild className="w-full sm:w-auto">
                  <Link href={`/quiz/${quiz.slug}`} className="gap-2">
                    शुरू करें
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<ClipboardList className="size-8" />}
          title="जल्द ही assessments उपलब्ध होंगे।"
          description="इस बीच आप articles पढ़ सकते हैं या community stories देख सकते हैं।"
          action={{ label: "Articles पढ़ें", href: "/articles" }}
          secondaryAction={{ label: "Community Stories", href: "/stories" }}
        />
      )}
    </Container>
  );
}
