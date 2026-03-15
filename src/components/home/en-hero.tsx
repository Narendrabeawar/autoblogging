import Link from "next/link";
import Image from "next/image";
import { BookOpen, PenLine, ClipboardList, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

const HERO_IMAGE = "/images/hero-theme.webp";
const EN_BASE = "/en";

export function EnHero() {
  return (
    <section
      className="relative flex min-h-[75vh] sm:min-h-[85vh] items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Theme background image — same warm visual as Hindi home */}
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/90"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"
          aria-hidden
        />
      </div>

      <Container className="relative z-10 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          {/* Tagline for global readers */}
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Globe className="size-4" aria-hidden />
            For readers worldwide
          </p>

          {/* Main headline — emotional, clear for US/international */}
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-tight">
            You&apos;re not alone
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              in your loneliness
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl sm:leading-relaxed">
            Breakup recovery, motivation, and life guidance — in plain English.
            <br className="hidden sm:block" />
            <span className="font-medium text-foreground/90">
              Real support, no judgment. Start reading or take a quick self-check.
            </span>
          </p>

          {/* CTAs — all /en where relevant */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
            <Button
              asChild
              size="lg"
              className="w-full min-w-[200px] text-base shadow-lg sm:w-auto"
            >
              <Link href={`${EN_BASE}/articles`} className="gap-2">
                <BookOpen className="size-5" aria-hidden />
                Read articles
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full min-w-[200px] border-2 bg-background/80 text-base backdrop-blur sm:w-auto"
            >
              <Link href={`${EN_BASE}/stories`} className="gap-2">
                <PenLine className="size-5" aria-hidden />
                Community Stories
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full min-w-[200px] border-2 bg-background/80 text-base backdrop-blur sm:w-auto"
            >
              <Link href="/quiz" className="gap-2">
                <ClipboardList className="size-5" aria-hidden />
                Self Assessment
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
