import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SkipLink } from "@/components/layout/skip-link";
import { HtmlLangSync } from "@/components/layout/html-lang-sync";
import { AdSenseScript } from "@/components/ads/adsense-script";
import { OrganizationSchema } from "@/components/seo/organization-schema";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoDevanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://akelapan.com";
const SITE_NAME = "Akelapan";
const DEFAULT_DESCRIPTION =
  "आपके अकेलेपन में आपका साथ। Loneliness, breakup, relationships, motivation और life advice हिंदी में।";
const KEYWORDS = [
  "loneliness",
  "breakup",
  "motivation",
  "hindi",
  "emotional support",
  "mental health",
  "relationships",
  "life advice",
  "अकेलापन",
  "akelapan",
];

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | Emotional Support & Life Guidance in Hindi`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: KEYWORDS,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  metadataBase: new URL(SITE_URL),
  alternates: {
    types: {
      "application/rss+xml": `${SITE_URL}/feed.xml`,
    },
  },
  openGraph: {
    type: "website",
    locale: "hi_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Emotional Support & Life Guidance in Hindi`,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: "/images/og-default.png", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Emotional Support & Life Guidance`,
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var k='akelapan-theme';var t=localStorage.getItem(k);var d=document.documentElement;var dark=t==='dark'||(!t&&typeof window!=='undefined'&&window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(dark)d.classList.add('dark');else d.classList.remove('dark');})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoDevanagari.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <HtmlLangSync />
        <SkipLink />
        <OrganizationSchema />
        <AdSenseScript />
        <Navbar />
        <main id="main-content" className="min-h-screen">
          <Suspense fallback={null}>{children}</Suspense>
        </main>
        <Footer />
      </body>
    </html>
  );
}
