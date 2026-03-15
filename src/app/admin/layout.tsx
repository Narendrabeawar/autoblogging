import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Heart, LayoutDashboard, FileText, LogOut, Sparkles, BarChart3, BookOpen, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user: { id: string } | null = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data?.user ?? null;
  } catch {
    // ECONNRESET / network error - show layout without auth so page can load
  }

  return (
    <div className="min-h-screen bg-background">
      {user ? (
        <>
          <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
            <div className="flex h-14 items-center justify-between px-4 lg:px-8">
              <Link
                href="/admin"
                className="flex items-center gap-2 font-semibold"
              >
                <Heart className="size-5 text-primary" />
                Akelapan Admin
              </Link>
              <nav className="flex items-center gap-4">
                <Link
                  href="/admin"
                  className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
                >
                  <LayoutDashboard className="size-4" />
                  Dashboard
                </Link>
                <Link
                  href="/admin/articles"
                  className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
                >
                  <FileText className="size-4" />
                  Articles
                </Link>
                <Link
                  href="/admin/articles/generate"
                  className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
                >
                  <Sparkles className="size-4" />
                  Generate
                </Link>
                <Link
                  href="/admin/auto"
                  className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
                >
                  <Zap className="size-4" />
                  Full Auto
                </Link>
                <Link
                  href="/admin/analytics"
                  className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
                >
                  <BarChart3 className="size-4" />
                  Analytics
                </Link>
                <Link
                  href="/admin/stories"
                  className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
                >
                  <BookOpen className="size-4" />
                  Stories
                </Link>
                <form action="/admin/logout" method="POST">
                  <Button variant="ghost" size="sm" type="submit">
                    <LogOut className="size-4 mr-1" />
                    Logout
                  </Button>
                </form>
              </nav>
            </div>
          </header>
          <main className="p-4 lg:p-8">
            <div className="mx-auto w-full max-w-4xl">{children}</div>
          </main>
        </>
      ) : (
        <>{children}</>
      )}
    </div>
  );
}
