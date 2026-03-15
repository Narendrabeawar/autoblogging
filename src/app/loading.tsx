import { Container } from "@/components/layout/container";

export default function RootLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" aria-hidden>
      <div className="flex flex-col items-center gap-4">
        <div
          className="size-10 animate-spin rounded-full border-2 border-primary border-t-transparent"
          aria-hidden
        />
        <p className="text-sm text-muted-foreground">लोड हो रहा है...</p>
      </div>
    </div>
  );
}
