import { NextRequest } from "next/server";
import { saveQuizResult } from "@/lib/db/quizzes";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quizId, answers, totalScore } = body;

    if (!quizId || !answers || typeof totalScore !== "number") {
      return Response.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    const result = await saveQuizResult(quizId, answers, totalScore);

    if (!result.success) {
      return Response.json(
        { error: result.error ?? "Failed to save" },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      resultType: result.resultType,
      resultMessage: result.resultMessage,
    });
  } catch {
    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
