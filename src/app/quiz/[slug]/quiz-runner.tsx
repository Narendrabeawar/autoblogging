"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { QuizQuestion } from "@/lib/db/quizzes";

interface Quiz {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  result_intro: string | null;
  questions: QuizQuestion[];
}

interface QuizRunnerProps {
  quiz: Quiz;
}

export function QuizRunner({ quiz }: QuizRunnerProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: string; message: string } | null>(
    null
  );

  const question = quiz.questions[currentIndex];
  const isLast = currentIndex === quiz.questions.length - 1;
  const canProceed = question && answers[question.id] !== undefined;

  async function handleNext() {
    if (!question) return;

    if (isLast) {
      setLoading(true);
      const scores = quiz.questions.map((q) => {
        const ans = answers[q.id];
        const opt = q.options.find((o) => o.value === ans);
        return opt?.score ?? 0;
      });
      const totalScore = scores.reduce((a, b) => a + b, 0);

      try {
        const res = await fetch("/api/quiz/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quizId: quiz.id,
            answers: Object.fromEntries(
              quiz.questions.map((q) => [q.id, answers[q.id] ?? ""])
            ),
            totalScore,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setResult({
            type: data.resultType,
            message: data.resultMessage,
          });
        } else {
          setResult({
            type: "error",
            message:
              "Results could not be saved. Here's your summary based on your answers.",
          });
        }
      } catch {
        setResult({
          type: "error",
          message: "Something went wrong. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  function handleBack() {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }

  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="border-primary/30">
          <CardHeader>
            <h2 className="text-2xl font-bold text-foreground">
              आपके परिणाम
            </h2>
            <p className="text-muted-foreground">{quiz.result_intro}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              className={`p-4 rounded-lg ${
                result.type === "error"
                  ? "bg-destructive/10 border border-destructive/20"
                  : result.type === "low"
                    ? "bg-green-500/10 border border-green-500/20"
                    : result.type === "medium"
                      ? "bg-amber-500/10 border border-amber-500/20"
                      : "bg-primary/10 border border-primary/20"
              }`}
            >
              <p className="text-foreground leading-relaxed">{result.message}</p>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => router.push("/quiz")}
              >
                दूसरे Assessments
              </Button>
              <Button onClick={() => router.push("/articles")}>
                Articles पढ़ें
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!question) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No questions available.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          सवाल {currentIndex + 1} / {quiz.questions.length}
        </p>
        <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{
              width: `${((currentIndex + 1) / quiz.questions.length) * 100}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-border/60">
            <CardHeader>
              <h2 className="text-xl font-semibold text-foreground">
                {question.question_text}
              </h2>
            </CardHeader>
            <CardContent className="space-y-3">
              {question.options.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                    answers[question.id] === opt.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={opt.value}
                    checked={answers[question.id] === opt.value}
                    onChange={() =>
                      setAnswers((a) => ({ ...a, [question.id]: opt.value }))
                    }
                    className="sr-only"
                  />
                  <span
                    className={`size-4 rounded-full border-2 flex items-center justify-center ${
                      answers[question.id] === opt.value
                        ? "border-primary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {answers[question.id] === opt.value && (
                      <span className="size-2 rounded-full bg-primary" />
                    )}
                  </span>
                  <span className="text-foreground">{opt.label}</span>
                </label>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-8">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentIndex === 0}
        >
          पीछे
        </Button>
        <Button onClick={handleNext} disabled={!canProceed || loading}>
          {loading ? "प्रोसेस हो रहा है…" : isLast ? "परिणाम देखें" : "आगे"}
        </Button>
      </div>
    </div>
  );
}
