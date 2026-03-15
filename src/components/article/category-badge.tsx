import Link from "next/link";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  label: string;
  slug: string;
  className?: string;
  /** e.g. "/en" for English routes */
  basePath?: string;
}

export function CategoryBadge({
  label,
  slug,
  className,
  basePath = "",
}: CategoryBadgeProps) {
  const categoryHref = basePath ? `${basePath}/category/${slug}` : `/category/${slug}`;
  return (
    <Link
      href={categoryHref}
      className={cn(
        "inline-flex items-center rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground backdrop-blur-sm",
        "hover:bg-primary transition-colors",
        className
      )}
    >
      {label}
    </Link>
  );
}
