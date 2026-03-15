import { Suspense } from "react";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { ArticleCardSkeletonGrid } from "@/components/article/article-card-skeleton";
import { ArticlesGrid } from "@/app/articles/articles-grid";

export const metadata = {
  title: "Articles | Akelapan",
  description:
    "Emotional support, motivation और life advice के लिए हिंदी articles।",
};

export default function ArticlesPage() {
  return (
    <Container className="py-12 sm:py-16">
      <SectionHeader
        title="सभी Articles"
        subtitle="अपनी ज़रूरत के हिसाब से पढ़ें"
      />
      <Suspense fallback={<ArticleCardSkeletonGrid count={9} />}>
        <ArticlesGrid />
      </Suspense>
    </Container>
  );
}
