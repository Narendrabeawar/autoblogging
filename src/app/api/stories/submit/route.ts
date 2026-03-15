import { NextRequest } from "next/server";
import { submitStory } from "@/lib/db/stories";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, author_name, author_display, consent_given, theme } =
      body;

    if (!title || typeof title !== "string" || title.trim().length < 5) {
      return Response.json(
        { error: "Title must be at least 5 characters" },
        { status: 400 }
      );
    }

    if (!content || typeof content !== "string" || content.trim().length < 50) {
      return Response.json(
        { error: "Content must be at least 50 characters" },
        { status: 400 }
      );
    }

    if (!consent_given) {
      return Response.json(
        { error: "You must give consent to share your story" },
        { status: 400 }
      );
    }

    const result = await submitStory({
      title: title.trim().slice(0, 200),
      content: content.trim().slice(0, 5000),
      author_name: author_name?.trim() || undefined,
      author_display: author_display?.trim() || "Anonymous",
      consent_given: true,
      theme: theme?.trim() || undefined,
    });

    if (!result.success) {
      return Response.json(
        { error: result.error ?? "Failed to submit" },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message:
        "आपकी कहानी सबमिट हो गई है। मॉडरेशन के बाद हम इसे publish करेंगे।",
    });
  } catch {
    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
