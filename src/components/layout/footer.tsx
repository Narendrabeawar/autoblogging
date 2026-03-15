"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Container } from "@/components/layout/container";
import { NewsletterSignup } from "@/components/newsletter/newsletter-signup";
import { cn } from "@/lib/utils";

const footerLinks = {
  content: [
    { href: "/articles", hrefEn: "/en/articles", label: "All Articles" },
    { href: "/stories", hrefEn: "/en/stories", label: "Community Stories" },
    { href: "/quiz", hrefEn: "/quiz", label: "Self Assessment" },
    { href: "/category/loneliness", hrefEn: "/en/category/loneliness", label: "Loneliness" },
    { href: "/category/breakup", hrefEn: "/en/category/breakup", label: "Breakup" },
    { href: "/category/motivation", hrefEn: "/en/category/motivation", label: "Motivation" },
    { href: "/category/relationships", hrefEn: "/en/category/relationships", label: "Relationships" },
  ],
  support: [
    { href: "/about", hrefEn: "/about", label: "About Us" },
    { href: "/contact", hrefEn: "/contact", label: "Contact" },
    { href: "/crisis", hrefEn: "/crisis", label: "Crisis Resources" },
    { href: "/privacy", hrefEn: "/privacy", label: "Privacy Policy" },
  ],
};

export function Footer() {
  const pathname = usePathname();
  const isEn = pathname.startsWith("/en");
  const base = isEn ? "/en" : "";

  const linkHref = (h: string, hEn: string) => (isEn ? hEn : h);

  const tagline = isEn
    ? "With you in your loneliness. Emotional support and life guidance in Hindi and English."
    : "आपके अकेलेपन में आपका साथ। Emotional support और life guidance के लिए हिंदी में।";

  const copyright = isEn
    ? `© ${new Date().getFullYear()} Akelapan. All rights reserved. This is not a substitute for professional medical advice.`
    : `© ${new Date().getFullYear()} Akelapan. सभी अधिकार सुरक्षित। यह पेशेवर चिकित्सा सलाह का विकल्प नहीं है।`;

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mt-20 border-t border-border bg-muted/40"
    >
      <Container>
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 md:grid-cols-4 md:gap-8 md:py-14">
          <div className="sm:col-span-2 md:col-span-1">
            <Link
              href={isEn ? "/en" : "/"}
              className="inline-flex items-center gap-2 font-semibold text-foreground hover:text-primary transition-colors"
            >
              <Heart className="size-5 text-primary" aria-hidden />
              Akelapan
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {tagline}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-foreground/80">
              Content
            </h4>
            <ul className="space-y-3">
              {footerLinks.content.map((link) => (
                <li key={link.href}>
                  <Link
                    href={linkHref(link.href, link.hrefEn)}
                    className={cn(
                      "text-sm text-muted-foreground transition-colors hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-foreground/80">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-2 md:col-span-1">
            <NewsletterSignup variant="card" locale={isEn ? "en" : "hi"} />
          </div>
        </div>

        <div className="border-t border-border py-5 text-center text-sm text-muted-foreground">
          <p className="max-w-2xl mx-auto leading-relaxed">{copyright}</p>
        </div>
      </Container>
    </motion.footer>
  );
}
