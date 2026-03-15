export default function EditArticleLoading() {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="h-8 w-48 animate-pulse rounded bg-muted" />
      <div className="space-y-4">
        <div className="h-10 w-full animate-pulse rounded bg-muted" />
        <div className="h-10 w-full animate-pulse rounded bg-muted" />
        <div className="h-24 w-full animate-pulse rounded bg-muted" />
        <div className="h-64 w-full animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
