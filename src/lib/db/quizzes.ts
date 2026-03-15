import { createClient } from "@/lib/supabase/server";

export interface QuizOption {
  value: string;
  label: string;
  score: number;
}

export interface QuizQuestion {
  id: string;
  question_text: string;
  sort_order: number;
  options: QuizOption[];
}

export interface Quiz {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  result_intro: string | null;
  sort_order: number;
}

export async function getActiveQuizzes() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quizzes")
    .select("id, title, slug, description")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) return [];
  return (data ?? []) as Quiz[];
}

export async function getQuizBySlug(slug: string) {
  const supabase = await createClient();
  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .select("id, title, slug, description, result_intro")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (quizError || !quiz) return null;

  const { data: questions, error: qError } = await supabase
    .from("quiz_questions")
    .select("id, question_text, sort_order, options")
    .eq("quiz_id", quiz.id)
    .order("sort_order", { ascending: true });

  if (qError) return { ...quiz, questions: [] };

  return {
    ...quiz,
    questions: (questions ?? []) as QuizQuestion[],
  };
}

export async function saveQuizResult(
  quizId: string,
  answers: Record<string, string>,
  totalScore: number
) {
  const supabase = await createClient();

  let resultType = "low";
  let resultMessage = "";

  if (totalScore <= 5) {
    resultType = "low";
    resultMessage =
      "आपकी emotional state अच्छी लग रही है। फिर भी, अगर कभी अकेलापन महसूस हो तो हमारे articles और community stories पढ़ें।";
  } else if (totalScore <= 10) {
    resultType = "medium";
    resultMessage =
      "आपको कभी-कभी अकेलापन महसूस हो सकता है। यह सामान्य है। अपने करीबी लोगों से बात करें और हमारे motivation वाले articles पढ़ें।";
  } else {
    resultType = "high";
    resultMessage =
      "आपको अक्सर अकेलापन महसूस होता है। याद रखें: आप अकेले नहीं हैं। हमारे loneliness और mental strength articles पढ़ें। अगर लगातार उदासी रहे तो किसी counselor से बात करने पर विचार करें।";
  }

  const { error } = await supabase.from("quiz_results").insert({
    quiz_id: quizId,
    answers,
    result_type: resultType,
    result_message: resultMessage,
  });

  if (error) return { success: false, error: error.message };
  return {
    success: true,
    resultType,
    resultMessage,
  };
}
