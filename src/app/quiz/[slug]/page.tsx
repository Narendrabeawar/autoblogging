import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { getQuizBySlug } from "@/lib/db/quizzes";
import { QuizRunner } from "./quiz-runner";

interface QuizPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: QuizPageProps) {
  const { slug } = await params;
  const quiz = await getQuizBySlug(slug);
  return {
    title: quiz ? `${quiz.title} | Self Assessment | Akelapan` : "Assessment | Akelapan",
    description: quiz?.description ?? "Self assessment on Akelapan",
  };
}

export default async function QuizSlugPage({ params }: QuizPageProps) {
  const { slug } = await params;
  const quiz = await getQuizBySlug(slug);

  if (!quiz) {
    notFound();
  }

  return (
    <Container className="py-12 sm:py-16">
      <Button variant="ghost" size="sm" asChild className="mb-8">
        <Link href="/quiz" className="gap-2">
          <ArrowLeft className="size-4" />
          वापस Assessments
        </Link>
      </Button>
      <QuizRunner quiz={quiz} />
    </Container>
  );
}
