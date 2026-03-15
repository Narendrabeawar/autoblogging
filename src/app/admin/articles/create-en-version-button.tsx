"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CreateEnVersionButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleCreateEn() {
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/articles/translate-and-save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage("English version saved as draft.");
        router.refresh();
      } else if (res.status === 409) {
        setMessage("English version already exists.");
      } else {
        setMessage(data.error ?? "Failed");
      }
    } catch {
      setMessage("Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleCreateEn}
        disabled={loading}
        className="gap-1"
      >
        <Languages className="size-4" />
        {loading ? "…" : "Create EN"}
      </Button>
      {message && (
        <span className="text-xs text-muted-foreground">{message}</span>
      )}
    </div>
  );
}
