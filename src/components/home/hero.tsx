import Link from "next/link";
import Image from "next/image";
import { BookOpen, PenLine, ClipboardList, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { HeroScrollingCards, type HeroTickerItem } from "./hero-scrolling-cards";

const HERO_IMAGE = "/images/hero-theme.webp";

export function Hero({ trendingItems = [] }: { trendingItems?: HeroTickerItem[] }) {
  return (
    <section
      className="relative flex min-h-[75vh] sm:min-h-[85vh] items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Theme background image */}
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Overlay for readability: soft gradient so text pops */}
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
          {/* Tagline badge */}
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Heart className="size-4" aria-hidden />
            Emotional support in Hindi
          </p>

          {/* Main headline */}
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-tight">
            आपके अकेलेपन में
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              आपका साथ
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl sm:leading-relaxed">
            Breakup advice, motivation और life guidance — सब कुछ हिंदी में।
            <br className="hidden sm:block" />
            <span className="font-medium text-foreground/90">आप अकेले नहीं हैं।</span>
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
            <Button
              asChild
              size="lg"
              className="w-full min-w-[200px] text-base shadow-lg sm:w-auto"
            >
              <Link href="/articles" className="gap-2">
                <BookOpen className="size-5" aria-hidden />
                Articles पढ़ें
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full min-w-[200px] border-2 bg-background/80 text-base backdrop-blur sm:w-auto"
            >
              <Link href="/stories" className="gap-2">
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
        {/* Centered 6xl scrolling cards with fade edges */}
        <div className="mx-auto mt-12 max-w-6xl overflow-hidden">
          <HeroScrollingCards items={trendingItems} />
        </div>
      </Container>
    </section>
  );
}
