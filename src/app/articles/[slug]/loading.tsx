import { Container } from "@/components/layout/container";

export default function ArticleSlugLoading() {
  return (
    <Container className="py-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="h-4 w-32 rounded bg-muted animate-pulse" />
        <div className="aspect-video w-full rounded-xl bg-muted animate-pulse" />
        <div className="space-y-2">
          <div className="h-9 w-full max-w-[85%] rounded bg-muted animate-pulse" />
          <div className="h-5 w-48 rounded bg-muted animate-pulse" />
        </div>
        <div className="space-y-3 pt-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-4 w-full rounded bg-muted animate-pulse"
              style={{ width: i === 4 ? "70%" : "100%" }}
            />
          ))}
        </div>
      </div>
    </Container>
  );
}
