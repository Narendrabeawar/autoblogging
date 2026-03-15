# Step 11: UI/UX Plan — Next.js Best Practices

Akelapan.com के लिए best-in-class UI/UX का plan, **Next.js 16 App Router** और modern front-end practices के अनुसार।

---

## Status: Kya ho chuka, kya baki hai

### ✅ Ho chuka (Done)

**Phase A — Quick wins (complete)**

- **loading.tsx**: `app/loading.tsx`, `app/articles/loading.tsx`, `app/articles/[slug]/loading.tsx`, `app/category/[slug]/loading.tsx` — spinner/skeletons add ho chuke।
- **error.tsx**: `app/error.tsx`, `app/articles/error.tsx`, `app/articles/[slug]/error.tsx`, `app/category/[slug]/error.tsx` + reusable `ErrorFallback` (Hindi copy, Retry, होम)।
- **Mobile menu**: Navbar में hamburger → open/close, overlay, link list, Escape to close, aria labels।
- **Skip link**: `SkipLink` component + `main#main-content` layout में।
- **Active nav link**: `usePathname()` se current route highlight (primary color)।

**Category cards (extra)**

- Card height kam (aspect 5/2, compact content)।
- Heading card ke andar (image overlay), navy blue bold, description `text-base`।
- Card se white padding hata di (Card `py-0 gap-0`)।

**Pehle se present**

- Layout, theme, fonts, motion, ArticleCard, reading progress, share, helpful, related।

### ⏳ Baki (Remaining)

**Phase B — Skeletons & streaming** ✅

- Reusable `ArticleCardSkeleton` / `CategoryCardSkeleton` components (loading.tsx में inline hai, alag component optional)।
- Home + articles list + article detail par **Suspense** boundaries + skeleton fallback।
- `next/image` par `placeholder="blur"` / blurDataURL jahan possible।

**Phase C — Polish & a11y** ✅

- Global **focus-visible** ring (buttons/links already have some; site-wide consistency check)।
- **Reduced motion**: `prefers-reduced-motion: reduce` — animations kam/off।
- **Color contrast**: Primary/muted/foreground WCAG AA check।
- **Crisis page**: Layout + contrast + helplines prominent।
- **Breadcrumbs**: Article page par Home > Category > Article (optional)।

**Phase D — Emotional & consistency** ✅

- Empty states: consistent illustration/copy (articles, category, stories)।
- Form feedback: contact, newsletter, quiz — success/error messages।
- Micro-copy: Hindi/English per locale।
- Optional: dark mode toggle (theme CSS already)।

**Page-wise baki**

- Home: Featured Articles ko Suspense me wrap karna; empty state already friendly।
- Articles/Category: Empty state with illustration/icon + CTA (optional upgrade)।
- Article detail: Breadcrumb (optional); related articles skeleton when loading।
- Stories/Quiz/Crisis/About/Contact: Forms labels + error states; Crisis minimal + high contrast।
- Footer: Newsletter load par layout shift check।

**Next.js / SEO**

- Open Graph / Twitter images jahan missing (article, category)।
- Streaming: Suspense boundaries for heavy sections।

---

## 1. Vision & Principles

- **Emotional safety first**: UI calming, warm, और भरोसेमंद लगे — user को लगे कि यह जगह सुरक्षित है।
- **Next.js 16 aligned**: App Router, Server Components, streaming, और performance patterns का सही use।
- **Accessible & inclusive**: WCAG 2.1, keyboard nav, screen readers, और हिंदी/English दोनों typography।
- **Fast & smooth**: LCP, FID, CLS optimize; meaningful animations without jank।

---

## 2. Current State (Summary)

| Area           | Status | Notes                                                           |
| -------------- | ------ | --------------------------------------------------------------- |
| Layout         | ✅     | Root layout, Navbar, Footer, Container — structure अच्छा है     |
| Theming        | ✅     | OKLCH palette, light/dark, warm teal/lavender/amber             |
| Fonts          | ✅     | Geist + Noto Sans Devanagari — Hindi support                    |
| Motion         | ✅     | Framer Motion on Navbar, Footer, ArticleCard, AnimatedContainer |
| Components     | ✅     | Button, Card, shadcn-style; ArticleCard, CategoryCard           |
| Mobile nav     | ⚠️     | Menu icon दिखता है लेकिन mobile menu open नहीं होता             |
| Loading states | ⚠️     | ज्यादातर pages पर explicit loading/skeleton नहीं                |
| Error/Empty    | ⚠️     | notFound + कुछ empty states; consistent error UI कम             |
| Article page   | ✅     | Reading progress, share, helpful, related — features अच्छे      |

---

## 3. Next.js 16 Practices to Apply

### 3.1 App Router & Data Loading

- **Server Components by default**: Pages जहाँ data fetch हो (articles, category, article detail) वहाँ RSC रखें; client only जहाँ interactivity चाहिए (forms, toggles, modals).
- **Streaming**: Heavy pages (e.g. article list + sidebar) के लिए `<Suspense>` boundaries और `loading.tsx` use करें ताकि shell तुरंत दिखे।
- **loading.tsx per route**:  
  `app/loading.tsx`, `app/articles/loading.tsx`, `app/articles/[slug]/loading.tsx`, `app/category/[slug]/loading.tsx` — skeleton या spinner।
- **error.tsx**: हर major segment पर `error.tsx` — user-friendly message + “Try again” / “Go home”।

### 3.2 Images & Media

- **next/image**: सभी article/category images `<Image>` से; `sizes`, `priority` (above-fold), `placeholder="blur"` जहाँ possible.
- **Aspect ratio**: Card images के लिए consistent aspect (e.g. 16/9) — already है; responsive `sizes` maintain करें।
- **Blur placeholder**: Base64 blur या `blurDataURL` for better CLS।

### 3.3 Fonts & Typography

- **next/font**: Already Geist + Noto Sans Devanagari — `display: swap` और preload ठीक से (Next handles).
- **Line length**: Article body के लिए max-width (e.g. 65–70ch) — readability; prose container में already constraint हो सकता है।
- **Hierarchy**: `prose` में h1/h2/h3 consistent; Devanagari में line-height 1.6–1.8 रखें।

### 3.4 Navigation & Routing

- **`<Link>` everywhere**: External के अलावा सभी internal links `<Link>` से — prefetch (default true)।
- **Active state**: Navbar में current path के लिए active link highlight (e.g. `usePathname()` + different style).
- **Mobile menu**: Hamburger click पर slide-down या sheet menu; keyboard close (Escape) और focus trap।

### 3.5 Metadata & SEO (UI impact)

- **Metadata**: Dynamic `generateMetadata` article/category पर — already; Open Graph / Twitter images set करें जहाँ missing।
- **Structured data**: ArticleSchema, Organization — already; UI में “visible” SEO content (breadcrumbs, clear headings) align रखें।

---

## 4. UX Improvements by Area

### 4.1 Performance & Perceived Speed

- **Skeletons**: Articles list, article body, category grid — card skeleton और text-placeholder skeleton।
- **Streaming**: Home: hero तुरंत, “Featured Articles” in Suspense; Articles page: list in Suspense।
- **No layout shift**: Images with dimensions/blur; buttons/icons with min size; footer fixed height या stable layout।
- **Critical CSS**: Tailwind + globals already; above-the-fold hero/buttons को avoid large blocking CSS।

### 4.2 Accessibility (a11y)

- **Color contrast**: Primary/muted/foreground check (WCAG AA); links पर underline या clear focus ring।
- **Focus**: All interactive elements focusable; Navbar, Footer, Cards, Buttons — `focus-visible:ring-2` style।
- **Skip link**: “Skip to main content” top of page (keyboard users).
- **Landmarks**: `<main>`, `<nav>`, `<footer>`, article `<article>` — already; headings order (h1 → h2 → h3) consistent।
- **Screen reader**: Decorative icons `aria-hidden`; CTA buttons/links descriptive (e.g. “Read article …”).

### 4.3 Mobile & Responsive

- **Touch targets**: Buttons/links min 44×44px; spacing between nav links।
- **Mobile menu**: Full implementation — open/close, overlay, list of links, language/theme if any।
- **Viewport**: No horizontal scroll; container padding on small screens (already px-4 sm:px-6 lg:px-8).
- **Article read**: Font size 16px+ on mobile; comfortable line-height।

### 4.4 Visual Hierarchy & Consistency

- **One primary CTA per section**: Hero — “Articles पढ़ें” primary; बाकी secondary/outline।
- **Section rhythm**: Section padding consistent (e.g. py-16 sm:py-24); SectionHeader reuse।
- **Cards**: Same border/radius/shadow pattern; hover state same across ArticleCard, CategoryCard।
- **Spacing scale**: Tailwind scale (4, 6, 8, 12, 16, 24) consistently; no random values।

### 4.5 Motion & Micro-interactions

- **Reduced motion**: `prefers-reduced-motion: media` — animations disable या बहुत हल्की।
- **Purposeful motion**: Page load पर light fade/slide (already); scroll पर stagger (ArticleCard) — keep।
- **Button/link feedback**: Hover/active state clear; optional subtle scale या color transition।
- **No auto-play**: No distracting carousel/auto-play without user control; crisis page पर especially calm।

### 4.6 Emotional Design (Akelapan-specific)

- **Warm, hopeful tone**: Copy और empty states में supportive language (“जल्द ही articles आएंगे” जैसा).
- **Crisis page**: सबसे calm, clear, high-contrast; prominent helpline numbers; no flashy elements।
- **Trust cues**: About, Privacy, Contact easily reachable; footer में clear।
- **Devanagari prominence**: Hindi-first UI में headings/CTAs में Devanagari; English route (/en) में English।

---

## 5. Page-wise Checklist

### Home

- [ ] Hero: one clear headline + one primary CTA; secondary CTAs visually lighter।
- [ ] Categories: grid responsive; hover/focus state; optional short loading skeleton।
- [ ] Featured articles: skeleton while loading; empty state message friendly।
- [ ] `loading.tsx`: hero skeleton या minimal spinner।

### Articles List

- [ ] `loading.tsx`: grid of article card skeletons।
- [ ] Empty state: illustration या icon + message + CTA to categories/home।
- [ ] Pagination or “Load more” if added — accessible and clear।

### Article Detail

- [ ] `loading.tsx`: article header + body skeleton (image + lines).
- [ ] Reading progress bar — already; ensure not covering content।
- [ ] Breadcrumb: Home > Category > Article (optional but good for nav + SEO).
- [ ] Related articles: same card style; skeleton when loading।
- [ ] Language toggle (hi/en): clear, accessible।

### Category

- [ ] Same as articles list: loading skeleton, empty state।
- [ ] Category hero: title + short description; consistent with SectionHeader।

### Stories / Quiz / Crisis / About / Contact

- [ ] Each has clear heading and one main purpose; forms with labels and error states।
- [ ] Crisis: minimal design; no heavy animation; high contrast।

### Navbar

- [ ] Mobile menu: open/close, links, focus trap, Escape to close।
- [ ] Active link style (current path).
- [ ] Sticky: scroll पर background/blur (already); ensure no overlap with content।

### Footer

- [ ] Links grouped; newsletter signup visible।
- [ ] No layout shift when newsletter form loads (if client component).

---

## 6. Implementation Phases

### Phase A — Quick wins (1–2 days)

1. Add **loading.tsx** for main routes: `app/loading.tsx`, `app/articles/loading.tsx`, `app/articles/[slug]/loading.tsx`, `app/category/[slug]/loading.tsx`.
2. Add **error.tsx** for same segments with friendly message + recovery link.
3. **Mobile menu**: Navbar में hamburger पर click से menu open/close; Link list + overlay.
4. **Skip link**: “Skip to main content” at top of body.
5. **Active nav link**: `usePathname()` से current path highlight in Navbar.

### Phase B — Skeletons & streaming (1–2 days)

1. Create reusable **ArticleCardSkeleton** and **CategoryCardSkeleton** (or generic card skeleton).
2. Wrap “Featured Articles” (home) and articles list in **Suspense** with skeleton fallback.
3. Article detail: **Suspense** for main content with article skeleton.
4. Ensure **next/image** everywhere for article/category images; add `placeholder="blur"` where you have blur hash or static blur.

### Phase C — Polish & a11y (1–2 days)

1. **Focus styles**: Global `focus-visible` ring (e.g. `ring-2 ring-primary ring-offset-2`) on buttons, links, inputs.
2. **Reduced motion**: CSS `prefers-reduced-motion: reduce` — reduce or disable Framer Motion.
3. **Color contrast**: Check primary, secondary, muted text on background; fix if below AA.
4. **Crisis page**: Review layout and contrast; ensure helplines stand out.
5. **Breadcrumbs** on article page (optional): Home > Category > Article.

### Phase D — Emotional & consistency (ongoing)

1. Empty states: consistent illustration/copy across articles, category, stories.
2. Form feedback: success/error messages for contact, newsletter, quiz submit.
3. Micro-copy: button labels, error messages in Hindi/English as per locale.
4. Optional: dark mode toggle in Navbar/Footer (theme already in CSS).

---

## 7. File / Component Map (Suggested)

| Purpose        | File / Component                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------------------- |
| Route loading  | `app/loading.tsx`, `app/articles/loading.tsx`, `app/articles/[slug]/loading.tsx`, `app/category/[slug]/loading.tsx` |
| Route error    | `app/error.tsx`, `app/articles/error.tsx`, …                                                                        |
| Skeletons      | `components/ui/skeleton.tsx`, `components/article/article-card-skeleton.tsx`                                        |
| Mobile nav     | `components/layout/navbar.tsx` (expand) or `components/layout/mobile-menu.tsx`                                      |
| Skip link      | `components/layout/skip-link.tsx` (in layout)                                                                       |
| Breadcrumb     | `components/layout/breadcrumb.tsx` (article page)                                                                   |
| Reduced motion | `components/providers/motion-provider.tsx` or CSS only in `globals.css`                                             |

---

## 8. Success Criteria

- **LCP** < 2.5s on article and home (mobile).
- **No layout shift**: CLS < 0.1 on key pages.
- **Lighthouse Accessibility** ≥ 90 (after a11y phase).
- **Mobile menu** works on touch and keyboard.
- **All main flows** (home → articles → article → category) have loading and error handling.
- **Emotional fit**: Feels calm, warm, and trustworthy for a Hindi emotional-support audience.

---

## 9. Next Steps

1. Phase A से start करें — loading, error, mobile menu, skip link, active nav.
2. Phir Phase B (skeletons + streaming).
3. Phase C (a11y + crisis + focus + reduced motion).
4. Phase D को iterative लें (empty states, copy, optional dark toggle).

इस plan को **06-Technical-Setup.md** और **09-User-Engagement.md** के साथ align रखें — performance और engagement metrics same direction में रहेंगे।
