"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StoryActionsProps {
  storyId: string;
  status: string;
  consentGiven: boolean;
}

export function StoryActions({
  storyId,
  status,
  consentGiven,
}: StoryActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  async function handleAction(action: "approve" | "reject") {
    setLoading(action);
    try {
      const res = await fetch("/api/admin/stories/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storyId, action }),
      });
      if (res.ok) router.refresh();
    } finally {
      setLoading(null);
    }
  }

  if (status !== "pending") return null;

  return (
    <div className="flex gap-2 shrink-0">
      {!consentGiven && (
        <span className="text-xs text-amber-600 self-center">No consent</span>
      )}
      <Button
        size="sm"
        variant="outline"
        className="text-green-600 hover:bg-green-500/10"
        onClick={() => handleAction("approve")}
        disabled={!!loading}
      >
        {loading === "approve" ? "…" : <Check className="size-4" />}
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="text-destructive hover:bg-destructive/10"
        onClick={() => handleAction("reject")}
        disabled={!!loading}
      >
        {loading === "reject" ? "…" : <X className="size-4" />}
      </Button>
    </div>
  );
}
