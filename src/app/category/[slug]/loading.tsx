import { Container } from "@/components/layout/container";
import { ArticleCardSkeletonGrid } from "@/components/article/article-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategorySlugLoading() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="mb-10 space-y-2">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-5 w-80 max-w-full" />
      </div>
      <ArticleCardSkeletonGrid count={6} />
    </Container>
  );
}
