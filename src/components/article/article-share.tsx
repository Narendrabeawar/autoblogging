"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Share2, MessageCircle, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FALLBACK_ORIGIN =
  typeof process.env.NEXT_PUBLIC_SITE_URL === "string" && process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL
    : "https://akelapan.com";

interface ArticleShareProps {
  title: string;
  url: string;
  className?: string;
}

export function ArticleShare({ title, url, className }: ArticleShareProps) {
  const [copied, setCopied] = useState(false);
  const [fullUrl, setFullUrl] = useState(() => FALLBACK_ORIGIN.replace(/\/$/, "") + url);

  useEffect(() => {
    setFullUrl(window.location.origin + url);
  }, [url]);

  const whatsappText = encodeURIComponent(`${title}\n\n${fullUrl}`);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
        <Share2 className="size-4" />
        शेयर करें
      </span>
      <div className="flex gap-1.5">
        <Button variant="outline" size="sm" asChild>
          <Link
            href={`https://wa.me/?text=${whatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="gap-1.5"
          >
            <MessageCircle className="size-4" />
            WhatsApp
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="gap-1.5"
        >
          {copied ? (
            <>
              <Check className="size-4 text-green-600" />
              कॉपी हो गया
            </>
          ) : (
            <>
              <Copy className="size-4" />
              लिंक कॉपी करें
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
