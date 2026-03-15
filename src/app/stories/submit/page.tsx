"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function SubmitStoryPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const author_name = formData.get("author_name") as string;
    const author_display = formData.get("author_display") as string;
    const consent_given = formData.get("consent") === "on";
    const theme = formData.get("theme") as string;

    try {
      const res = await fetch("/api/stories/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          author_name: author_name || undefined,
          author_display: author_display || "Anonymous",
          consent_given,
          theme: theme || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "कुछ गलत हो गया");
        return;
      }

      setSuccess(true);
      form.reset();
    } catch {
      setError("कनेक्शन में समस्या। बाद में कोशिश करें।");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <Container className="py-12 sm:py-16">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <div className="inline-flex p-4 rounded-full bg-green-500/10">
            <CheckCircle className="size-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            धन्यवाद! आपकी कहानी सबमिट हो गई
          </h1>
          <p className="text-muted-foreground">
            हमारी टीम आपकी कहानी की समीक्षा करेगी। मॉडरेशन के बाद इसे Community
            Stories में publish किया जाएगा।
          </p>
          <Button asChild variant="outline">
            <Link href="/stories" className="gap-2">
              <ArrowLeft className="size-4" />
              सभी Stories देखें
            </Link>
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-12 sm:py-16">
      <Button variant="ghost" size="sm" asChild className="mb-8">
        <Link href="/stories" className="gap-2">
          <ArrowLeft className="size-4" />
          वापस Stories
        </Link>
      </Button>

      <SectionHeader
        title="अपनी कहानी साझा करें"
        subtitle="आपकी journey दूसरों को प्रेरणा दे सकती है"
      />

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">ध्यान दें:</strong> सभी stories
            मॉडरेशन के बाद ही publish होंगी। आपका नाम गोपनीय रखा जा सकता है।
            सबमिट करने पर आप consent दे रहे हैं कि आपकी कहानी Akelapan पर share
            की जा सकती है।
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <div>
            <Label htmlFor="title">कहानी का शीर्षक *</Label>
            <Input
              id="title"
              name="title"
              required
              minLength={5}
              maxLength={200}
              placeholder="उदाहरण: अकेलेपन से बाहर निकलने की मेरी कहानी"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="content">आपकी कहानी *</Label>
            <Textarea
              id="content"
              name="content"
              required
              minLength={50}
              maxLength={5000}
              rows={10}
              placeholder="अपनी कहानी विस्तार से लिखें... (कम से कम 50 शब्द)"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="author_display">कैसे दिखाना चाहेंगे? *</Label>
            <Input
              id="author_display"
              name="author_display"
              placeholder="Anonymous या आपका नाम"
              defaultValue="Anonymous"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="author_name">आपका असली नाम (गोपनीय, optional)</Label>
            <Input
              id="author_name"
              name="author_name"
              placeholder="सिर्फ हमारे लिए"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="theme">Theme (optional)</Label>
            <Input
              id="theme"
              name="theme"
              placeholder="उदाहरण: Loneliness, Breakup, Recovery"
              className="mt-2"
            />
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="consent"
              name="consent"
              required
              className="mt-1 rounded border-border"
            />
            <Label htmlFor="consent" className="text-sm cursor-pointer">
              मैं consent देता/देती हूँ कि मेरी कहानी Akelapan पर publish की जा
              सकती है। मैं समझता/समझती हूँ कि यह पेशेवर सलाह का विकल्प नहीं है।
            </Label>
          </div>

          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? "सबमिट हो रहा है…" : "कहानी साझा करें"}
          </Button>
        </form>
      </div>
    </Container>
  );
}
