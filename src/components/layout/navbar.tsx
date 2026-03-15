"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/articles", label: "Articles" },
  { href: "/stories", label: "Stories" },
  { href: "/quiz", label: "Assessment" },
  { href: "/category/loneliness", label: "Loneliness" },
  { href: "/category/breakup", label: "Breakup" },
  { href: "/category/motivation", label: "Motivation" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/" || pathname === "/en";
  return pathname === href || pathname.startsWith(href + "/");
}

function navHref(href: string, isEn: boolean) {
  if (href === "/") return isEn ? "/en" : "/";
  return isEn ? `/en${href}` : href;
}

export function Navbar() {
  const pathname = usePathname();
  const isEn = pathname.startsWith("/en");
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const focusables = menuRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])'
    );
    const first = focusables?.[0];
    first?.focus();
  }, [mobileOpen]);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md"
    >
      <Container>
        <nav className="flex h-16 items-center justify-between" aria-label="Main">
          <Link
            href={isEn ? "/en" : "/"}
            className="flex items-center gap-2 font-semibold text-lg text-foreground hover:text-primary transition-colors"
          >
            <Heart className="size-6 text-primary" aria-hidden />
            <span>Akelapan</span>
          </Link>

          <div className="hidden md:flex items-center gap-5">
            {navLinks.map((link) => {
              const active = isActive(pathname, link.href);
              const href = navHref(link.href, isEn);
              return (
                <Link
                  key={link.href}
                  href={href}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="flex items-center gap-0.5 rounded-full border border-border bg-muted/50 px-1 py-0.5" role="group" aria-label="Site language">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-7 rounded-full px-2.5 text-xs font-medium",
                  !isEn ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
                asChild
              >
                <Link href="/">हिन्दी</Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-7 rounded-full px-2.5 text-xs font-medium",
                  isEn ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
                asChild
              >
                <Link href="/en">English</Link>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden md:inline-flex gap-1.5" asChild>
              <Link href="/admin">
                <LayoutDashboard className="size-4" aria-hidden />
                Admin
              </Link>
            </Button>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen((o) => !o)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? (
                <X className="size-5" aria-hidden />
              ) : (
                <Menu className="size-5" aria-hidden />
              )}
            </Button>
            <Button asChild size="sm" className="hidden md:inline-flex">
              <Link href={isEn ? "/en/articles" : "/articles"}>Read Articles</Link>
            </Button>
          </div>
        </nav>
      </Container>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              role="presentation"
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              id="mobile-menu"
              ref={menuRef}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile menu"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed left-0 right-0 top-16 z-40 border-b border-border bg-background shadow-lg md:hidden"
            >
              <div className="container mx-auto max-w-lg px-4 py-4">
                <ul className="flex flex-col gap-1">
                  {navLinks.map((link) => {
                    const active = isActive(pathname, link.href);
                    const href = navHref(link.href, isEn);
                    return (
                      <li key={link.href}>
                        <Link
                          href={href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "block rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                            active
                              ? "bg-primary/10 text-primary"
                              : "text-foreground hover:bg-muted"
                          )}
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                  <span className="text-xs text-muted-foreground mr-1">Site:</span>
                  <Button variant={!isEn ? "default" : "outline"} size="sm" asChild>
                    <Link href="/" onClick={() => setMobileOpen(false)}>हिन्दी</Link>
                  </Button>
                  <Button variant={isEn ? "default" : "outline"} size="sm" asChild>
                    <Link href="/en" onClick={() => setMobileOpen(false)}>English</Link>
                  </Button>
                </div>
                <div className="mt-3 flex flex-col gap-2">
                  <Button asChild className="w-full" size="lg">
                    <Link href={isEn ? "/en/articles" : "/articles"} onClick={() => setMobileOpen(false)}>
                      Read Articles
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full" size="lg">
                    <Link href="/admin" onClick={() => setMobileOpen(false)}>
                      <LayoutDashboard className="size-4 mr-2" aria-hidden />
                      Admin
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
