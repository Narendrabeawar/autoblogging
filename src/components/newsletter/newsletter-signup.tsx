"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const COPY = {
  hi: {
    heading: "Newsletter में जुड़ें",
    description: "Motivation, emotional support और नए articles सीधे अपने inbox में पाएं।",
    loading: "जोड़ रहे हैं...",
    subscribe: "Subscribe",
    successDefault: "धन्यवाद!",
    errorDefault: "कुछ गलत हो गया।",
    errorNetwork: "कनेक्शन में समस्या। बाद में कोशिश करें।",
  },
  en: {
    heading: "Join the Newsletter",
    description: "Get motivation, emotional support, and new articles in your inbox.",
    loading: "Joining...",
    subscribe: "Subscribe",
    successDefault: "Thank you!",
    errorDefault: "Something went wrong.",
    errorNetwork: "Connection issue. Please try again later.",
  },
};

interface NewsletterSignupProps {
  className?: string;
  variant?: "inline" | "card";
  locale?: "hi" | "en";
}

export function NewsletterSignup({ className, variant = "inline", locale = "hi" }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const t = COPY[locale];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? t.errorDefault);
        return;
      }

      setStatus("success");
      setMessage(data.message ?? t.successDefault);
      setEmail("");
    } catch {
      setStatus("error");
      setMessage(t.errorNetwork);
    }
  };

  const isCard = variant === "card";

  return (
    <div
      className={cn(
        isCard && "rounded-xl border border-border bg-card p-5",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <Mail className="size-5 text-primary" />
        <h3 className="font-semibold text-foreground">{t.heading}</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{t.description}</p>

      {status === "success" ? (
        <p className="text-sm text-green-600 font-medium">{message}</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
            className="flex-1"
            required
          />
          <Button type="submit" disabled={status === "loading"}>
            {status === "loading" ? t.loading : t.subscribe}
          </Button>
        </form>
      )}

      {status === "error" && message && (
        <p className="text-sm text-destructive mt-2">{message}</p>
      )}
    </div>
  );
}
