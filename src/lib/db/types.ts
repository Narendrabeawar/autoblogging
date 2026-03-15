export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  icon: string | null;
  color: string | null;
  sort_order: number;
  created_at: string;
}

export type ArticleLanguage = "hi" | "en";

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  category_id: string | null;
  tags: string[];
  featured_image: string | null;
  seo_title: string | null;
  seo_description: string | null;
  status: "draft" | "published";
  created_at: string;
  published_at: string | null;
  language?: ArticleLanguage;
  original_id?: string | null;
  categories?: Category | null;
}

export interface ArticleWithCategory extends Article {
  categories: Category | null;
}
