# LunaXStar Search Acquisition Recovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Repair LunaXStar's search indexing foundation, strengthen the proven Solar Return landing page, make the natal chart usable on mobile, and record anonymous chart-conversion events without changing astrology calculations or the desktop chart design.

**Architecture:** Server-safe SEO helpers will produce route metadata and a deterministic blog index policy shared by article metadata and the generated sitemap. Calculator pages remain client components; route layouts own metadata and structured data, while an isolated analytics helper records non-personal funnel events. Natal mobile work is isolated in a page stylesheet so desktop chart geometry and calculation code remain untouched.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Node.js built-in test assertions, Tailwind CSS, Google Analytics 4, Vercel.

---

## File Structure

### New files

- `src/lib/seoMetadata.ts` - canonical URL construction and shared page metadata factory.
- `src/lib/blogIndexPolicy.ts` - deterministic article quality and robots policy.
- `src/app/sitemap.ts` - generated sitemap for core tools and approved articles.
- `src/components/HomePageClient.tsx` - existing client homepage moved out of the server route entry.
- `src/app/bazi/layout.tsx` - English-first BaZi metadata and canonical.
- `src/components/SolarReturnSeoContent.tsx` - visible explanatory and FAQ content for the Solar Return landing page.
- `src/app/natal/natal-mobile.css` - responsive-only natal layout overrides.
- `src/lib/analytics.ts` - browser-safe, non-personal GA4 event helper.
- `scripts/test-seo-metadata.mjs` - metadata factory and source regression checks.
- `scripts/test-blog-index-policy.mjs` - index policy and sitemap inclusion tests.
- `scripts/test-solar-return-content.mjs` - Solar Return search-content regression checks.
- `scripts/test-analytics.mjs` - GA4 event payload tests.
- `scripts/test-natal-mobile-css.mjs` - responsive selector and desktop-isolation checks.

### Modified files

- `src/app/layout.tsx` - remove inherited canonical/hreflang and switch document language to English-first.
- `src/app/page.tsx` - server route entry with homepage metadata that renders `HomePageClient`.
- `src/app/natal/layout.tsx` - self-canonical natal metadata.
- `src/app/solar-return/layout.tsx` - self-canonical Solar Return metadata and FAQ schema.
- `src/app/transits/layout.tsx` - self-canonical English-first Astrology Calendar metadata.
- `src/app/tarot/layout.tsx` - self-canonical English-first Tarot metadata.
- `src/app/compatibility/layout.tsx` - self-canonical English-first compatibility metadata.
- `src/app/blog/layout.tsx` - blog-index self-canonical metadata.
- `src/app/blog/[slug]/page.tsx` - robots policy, corrected alternates, and related internal links.
- `src/app/solar-return/page.tsx` - search-focused heading/content and analytics calls.
- `src/app/natal/page.tsx` - mobile classes and analytics calls only.
- `package.json` - one repeatable acquisition test command.
- `public/sitemap.xml` - removed after the generated sitemap route replaces it.

---

### Task 1: Add the metadata factory and correct core-route canonicals

**Files:**
- Create: `src/lib/seoMetadata.ts`
- Create: `scripts/test-seo-metadata.mjs`
- Create: `src/components/HomePageClient.tsx`
- Create: `src/app/bazi/layout.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/natal/layout.tsx`
- Modify: `src/app/solar-return/layout.tsx`
- Modify: `src/app/transits/layout.tsx`
- Modify: `src/app/tarot/layout.tsx`
- Modify: `src/app/compatibility/layout.tsx`
- Modify: `src/app/blog/layout.tsx`
- Modify: `package.json`

- [ ] **Step 1: Write the failing metadata test**

Create `scripts/test-seo-metadata.mjs`:

```js
import assert from "node:assert/strict";
import fs from "node:fs";
import { createPageMetadata, siteUrl } from "../src/lib/seoMetadata.ts";

const natal = createPageMetadata({
  path: "/natal",
  title: "Free Birth Chart Calculator",
  description: "Create a free birth chart.",
});

assert.equal(siteUrl("/natal"), "https://lunaxstar.com/natal");
assert.equal(natal.alternates?.canonical, "https://lunaxstar.com/natal");
assert.equal(natal.openGraph?.url, "https://lunaxstar.com/natal");
assert.equal(natal.alternates?.languages, undefined);

const rootLayout = fs.readFileSync("src/app/layout.tsx", "utf8");
assert.doesNotMatch(rootLayout, /languages:\s*\{/);
assert.match(rootLayout, /<html lang="en"/);

for (const route of ["natal", "solar-return", "bazi", "transits", "tarot", "compatibility", "blog"]) {
  const layout = fs.readFileSync(`src/app/${route}/layout.tsx`, "utf8");
  assert.match(layout, new RegExp(`path:\\s*["']/${route}["']`));
}

console.log("SEO metadata tests passed");
```

- [ ] **Step 2: Add the failing test command and run it**

Add to `package.json` scripts:

```json
"test:seo-metadata": "node --experimental-strip-types scripts/test-seo-metadata.mjs"
```

Run:

```bash
npm run test:seo-metadata
```

Expected: FAIL because `src/lib/seoMetadata.ts` and `src/app/bazi/layout.tsx` do not exist.

- [ ] **Step 3: Implement the metadata factory**

Create `src/lib/seoMetadata.ts`:

```ts
import type { Metadata } from "next";

export const SITE_ORIGIN = "https://lunaxstar.com";

export function siteUrl(path: string): string {
  return new URL(path, SITE_ORIGIN).toString().replace(/\/$/, path === "/" ? "" : "/");
}

type PageMetadataInput = {
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  type?: "website" | "article";
};

export function createPageMetadata({
  path,
  title,
  description,
  keywords = [],
  type = "website",
}: PageMetadataInput): Metadata {
  const canonical = siteUrl(path);
  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type,
      url: canonical,
      siteName: "LunaXStar",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
```

- [ ] **Step 4: Split the client homepage from the metadata-owning route entry**

Move the current homepage component without changing its rendered content:

```bash
mv src/app/page.tsx src/components/HomePageClient.tsx
```

Create `src/app/page.tsx`:

```tsx
import HomePageClient from "@/components/HomePageClient";
import { createPageMetadata } from "@/lib/seoMetadata";

export const metadata = createPageMetadata({
  path: "/",
  title: "Free Birth Chart & BaZi Calculator | LunaXStar",
  description: "Create a free Western birth chart or BaZi chart with real astronomical calculations. No signup required.",
  keywords: ["free birth chart", "natal chart calculator", "BaZi calculator", "astrology chart"],
});

export default function HomePage() {
  return <HomePageClient />;
}
```

- [ ] **Step 5: Remove false global locale signals**

In `src/app/layout.tsx`:

- Remove the root `alternates` object.
- Keep `metadataBase`, global icons, manifest, and robots defaults.
- Change `<html lang="zh">` to `<html lang="en">`.
- Change the global default title and description to English-first fallback copy; route metadata will override these values.

The resulting metadata opening must include:

```ts
export const metadata: Metadata = {
  title: {
    default: "Free Birth Chart & BaZi Calculator | LunaXStar",
    template: "%s | LunaXStar",
  },
  description: "Free Western astrology and BaZi calculators with real astronomical calculations. No signup required.",
  metadataBase: new URL("https://lunaxstar.com"),
```

- [ ] **Step 6: Give every core route a self-canonical**

Use `createPageMetadata` in each core layout. For example, `src/app/natal/layout.tsx` must begin with:

```ts
import { createPageMetadata } from "@/lib/seoMetadata";

export const metadata = createPageMetadata({
  path: "/natal",
  title: "Free Birth Chart Calculator - Natal Chart Analysis",
  description: "Generate a free professional natal chart with planets, houses, aspects, and traditional techniques. No signup required.",
  keywords: ["free birth chart", "natal chart calculator", "astrology chart", "rising sign calculator"],
});
```

Use these exact route paths and English-first titles:

```ts
// /solar-return
"Free Solar Return Chart Calculator (2026) - No Sign Up"

// /bazi
"Free BaZi Calculator - Four Pillars Chart & Luck Cycles"

// /transits
"Astrology Calendar - Moon Phases, Retrogrades & Transits"

// /tarot
"Free Online Tarot Reading - No Sign Up"

// /compatibility
"Free Astrology Compatibility Calculator - Synastry & Zodiac"

// /blog
"Astrology Guides - Birth Charts, BaZi & Timing Techniques"
```

Preserve existing valid JSON-LD blocks and update their URL/name fields to match the route metadata.

- [ ] **Step 7: Run the metadata test and build**

Run:

```bash
npm run test:seo-metadata
npm run build
```

Expected: test prints `SEO metadata tests passed`; Next.js production build exits 0.

- [ ] **Step 8: Commit metadata corrections**

```bash
git add package.json scripts/test-seo-metadata.mjs src/lib/seoMetadata.ts src/app/layout.tsx src/app/page.tsx src/components/HomePageClient.tsx src/app/natal/layout.tsx src/app/solar-return/layout.tsx src/app/bazi/layout.tsx src/app/transits/layout.tsx src/app/tarot/layout.tsx src/app/compatibility/layout.tsx src/app/blog/layout.tsx
git commit -m "fix: correct core route search metadata"
```

---

### Task 2: Introduce a conservative blog index policy and generated sitemap

**Files:**
- Create: `src/lib/blogIndexPolicy.ts`
- Create: `src/app/sitemap.ts`
- Create: `scripts/test-blog-index-policy.mjs`
- Modify: `src/app/blog/[slug]/page.tsx`
- Modify: `package.json`
- Delete: `public/sitemap.xml`

- [ ] **Step 1: Write the failing blog policy test**

Create `scripts/test-blog-index-policy.mjs`:

```js
import assert from "node:assert/strict";
import fs from "node:fs";
import { destinyArticles } from "../src/content/destiny-blog-articles.ts";
import { seoArticles } from "../src/app/blog/seo-articles.ts";
import { moreSeoArticles } from "../src/app/blog/more-seo-articles.ts";
import { isIndexableArticle } from "../src/lib/blogIndexPolicy.ts";

const bySlug = new Map(moreSeoArticles.map((article) => [article.slug, article]));

assert.equal(isIndexableArticle(bySlug.get("moon-in-sagittarius-73")), false);
assert.equal(isIndexableArticle(bySlug.get("how-to-read-bazi-chart-beginner-265")), true);
assert.equal(isIndexableArticle(bySlug.get("best-free-bazi-calculators-2026")), true);

const articles = [...destinyArticles, ...seoArticles, ...moreSeoArticles];
const indexableCount = articles.filter(isIndexableArticle).length;
assert.ok(indexableCount > 20, `Expected useful article coverage, received ${indexableCount}`);
assert.ok(indexableCount < 90, `Expected a focused article set, received ${indexableCount}`);

const sitemapSource = fs.readFileSync("src/app/sitemap.ts", "utf8");
assert.match(sitemapSource, /"\/natal"/);
assert.match(sitemapSource, /"\/solar-return"/);
assert.match(sitemapSource, /\.filter\(isIndexableArticle\)/);

console.log("Blog index policy tests passed");
```

- [ ] **Step 2: Add and run the failing test command**

Add to `package.json`:

```json
"test:blog-index": "node --experimental-strip-types scripts/test-blog-index-policy.mjs"
```

Run:

```bash
npm run test:blog-index
```

Expected: FAIL because the policy and generated sitemap do not exist.

- [ ] **Step 3: Implement the deterministic article policy**

Create `src/lib/blogIndexPolicy.ts`:

```ts
export type IndexableArticle = {
  slug?: string;
  content?: string | Record<string, string>;
};

const CORNERSTONE_SLUGS = new Set([
  "what-does-my-birth-chart-mean",
  "bazi-calculator-what-is-day-master",
  "free-natal-chart-interpretation-guide",
  "what-is-chinese-astrology-bazi",
  "rising-sign-meaning-how-to-find",
  "chinese-zodiac-compatibility-love",
  "best-free-bazi-calculators-2026",
  "xuanseal-alternative-free",
  "free-astrology-sites-no-signup",
  "how-to-find-your-day-master-in-bazi",
]);

const TEMPLATE_DEFECTS = [
  /[木火土金水]\s+(?:element|sign)/i,
  /every ending b\b/i,
  /complete Moon placement\.$/i,
];

function englishBody(article: IndexableArticle | undefined): string {
  if (!article?.content) return "";
  return typeof article.content === "string" ? article.content : article.content.en || "";
}

export function isIndexableArticle(article: IndexableArticle | undefined): boolean {
  if (!article?.slug) return false;
  const body = englishBody(article);
  if (TEMPLATE_DEFECTS.some((pattern) => pattern.test(body))) return false;
  if (CORNERSTONE_SLUGS.has(article.slug)) return body.length >= 1000;
  const sectionCount = (body.match(/^##\s+/gm) || []).length;
  return body.length >= 1200 && sectionCount >= 2;
}
```

- [ ] **Step 4: Generate the sitemap from the shared policy**

Create `src/app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import { destinyArticles } from "@/content/destiny-blog-articles";
import { seoArticles } from "@/app/blog/seo-articles";
import { moreSeoArticles } from "@/app/blog/more-seo-articles";
import { isIndexableArticle } from "@/lib/blogIndexPolicy";
import { siteUrl } from "@/lib/seoMetadata";

const CORE_ROUTES = [
  "/",
  "/natal",
  "/solar-return",
  "/bazi",
  "/transits",
  "/tarot",
  "/compatibility",
  "/blog",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const core = CORE_ROUTES.map((path) => ({
    url: siteUrl(path),
    lastModified: now,
    changeFrequency: path === "/transits" ? "daily" as const : "weekly" as const,
    priority: path === "/" ? 1 : 0.9,
  }));

  const articles = [...destinyArticles, ...seoArticles, ...moreSeoArticles]
    .filter(isIndexableArticle)
    .map((article) => {
      const published = "date" in article && article.date ? new Date(article.date) : now;
      return {
        url: siteUrl(`/blog/${article.slug}`),
        lastModified: published,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      };
    });

  return [...core, ...articles];
}
```

Delete `public/sitemap.xml` so `/sitemap.xml` has one source of truth.

- [ ] **Step 5: Apply the same policy to article robots metadata**

In `src/app/blog/[slug]/page.tsx`, import `isIndexableArticle` and replace article alternates/robots metadata with:

```ts
const indexable = isIndexableArticle(article);

return {
  title: `${metaTitle} | LunaXStar`,
  description: metaDesc,
  robots: indexable
    ? { index: true, follow: true }
    : { index: false, follow: true },
  alternates: {
    canonical: `https://lunaxstar.com/blog/${slug}`,
  },
  openGraph: {
    title: metaTitle,
    description: metaDesc,
    type: "article",
    url: `https://lunaxstar.com/blog/${slug}`,
  },
};
```

Keep the existing visible Free BaZi, Free Natal Chart, and compatibility links. Add one contextual related-article link selected from the approved cornerstone list so indexable articles are not isolated.

- [ ] **Step 6: Run policy tests and inspect sitemap size**

Run:

```bash
npm run test:blog-index
npm run build
```

Expected: policy tests pass; sitemap has fewer than 100 URLs; build exits 0.

- [ ] **Step 7: Commit the index policy**

```bash
git add package.json scripts/test-blog-index-policy.mjs src/lib/blogIndexPolicy.ts src/app/sitemap.ts 'src/app/blog/[slug]/page.tsx' public/sitemap.xml
git commit -m "fix: focus sitemap on indexable content"
```

---

### Task 3: Strengthen the Solar Return organic landing page

**Files:**
- Create: `src/components/SolarReturnSeoContent.tsx`
- Create: `scripts/test-solar-return-content.mjs`
- Modify: `src/app/solar-return/layout.tsx`
- Modify: `src/app/solar-return/page.tsx`
- Modify: `package.json`

- [ ] **Step 1: Write the failing content regression test**

Create `scripts/test-solar-return-content.mjs`:

```js
import assert from "node:assert/strict";
import fs from "node:fs";

const page = fs.readFileSync("src/app/solar-return/page.tsx", "utf8");
const layout = fs.readFileSync("src/app/solar-return/layout.tsx", "utf8");
const content = fs.readFileSync("src/components/SolarReturnSeoContent.tsx", "utf8");

assert.match(page, /Free Solar Return Chart Calculator/);
assert.match(page, /No signup required/);
assert.match(content, /What is a Solar Return chart\?/);
assert.match(content, /Why does return location matter\?/);
assert.match(content, /href="\/natal"/);
assert.match(content, /href="\/transits"/);
assert.match(layout, /FAQPage/);
assert.match(layout, /path:\s*["']\/solar-return["']/);

console.log("Solar Return content tests passed");
```

- [ ] **Step 2: Add and run the failing test command**

Add to `package.json`:

```json
"test:solar-return-content": "node scripts/test-solar-return-content.mjs"
```

Run:

```bash
npm run test:solar-return-content
```

Expected: FAIL because `SolarReturnSeoContent.tsx` does not exist and the page lacks the required English copy.

- [ ] **Step 3: Add visible explanatory content**

Create `src/components/SolarReturnSeoContent.tsx` as a static component containing these sections:

```tsx
import Link from "next/link";

const faqs = [
  {
    question: "What is a Solar Return chart?",
    answer: "A Solar Return chart maps the moment the Sun returns to its exact natal longitude. Astrologers use it to study the themes, priorities, and turning points between one birthday and the next.",
  },
  {
    question: "Do I need an exact birth time?",
    answer: "An accurate birth time gives the most reliable houses and angles. You can still calculate a return without it, but the Ascendant and house placements may be less dependable.",
  },
  {
    question: "Why does return location matter?",
    answer: "The planets keep the same zodiac positions, but the return location changes the Ascendant, Midheaven, and houses. Use the place where you expect to spend your birthday for a location-specific chart.",
  },
];

export const solarReturnFaqs = faqs;

export default function SolarReturnSeoContent() {
  return (
    <section className="mx-auto mt-12 max-w-5xl border-t border-gray-200 pt-10 text-gray-700">
      <h2 className="text-2xl font-semibold text-gray-950">Understand your year ahead</h2>
      <p className="mt-3 leading-7">Your result includes the exact return time, angles, houses, and planetary placements. Read the chart as a focused map for the year rather than a replacement for your natal chart.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {faqs.map((faq) => (
          <article key={faq.question}>
            <h3 className="font-semibold text-gray-950">{faq.question}</h3>
            <p className="mt-2 text-sm leading-6">{faq.answer}</p>
          </article>
        ))}
      </div>
      <nav aria-label="Related astrology tools" className="mt-8 flex flex-wrap gap-5 text-sm font-medium">
        <Link href="/natal">Free natal chart</Link>
        <Link href="/transits">Astrology calendar</Link>
        <Link href="/blog/lunar-return-monthly-guide-430">Lunar return guide</Link>
      </nav>
    </section>
  );
}
```

- [ ] **Step 4: Make the first viewport match search intent**

In `src/app/solar-return/page.tsx`:

- Import and render `SolarReturnSeoContent` after the existing chart result.
- Replace the decorative result title with the literal H1 `Free Solar Return Chart Calculator`.
- Add the supporting sentence `Calculate your yearly astrology chart for free. No signup required.`
- Keep translations for form labels and errors.
- Change the calculator button English label to `Calculate My Solar Return`.
- Do not modify `calculateSolarReturn`, API payloads, saved-profile loading, or chart components in this task.

- [ ] **Step 5: Add matching FAQ structured data**

In `src/app/solar-return/layout.tsx`, import `solarReturnFaqs` and render:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: solarReturnFaqs.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    }),
  }}
/>
```

The visible FAQ and JSON-LD must use the same exported data.

- [ ] **Step 6: Run content tests and build**

```bash
npm run test:solar-return-content
npm run build
```

Expected: content tests pass and build exits 0.

- [ ] **Step 7: Commit the Solar Return landing-page improvement**

```bash
git add package.json scripts/test-solar-return-content.mjs src/components/SolarReturnSeoContent.tsx src/app/solar-return/layout.tsx src/app/solar-return/page.tsx
git commit -m "feat: strengthen solar return search landing page"
```

---

### Task 4: Add privacy-safe GA4 chart events

**Files:**
- Create: `src/lib/analytics.ts`
- Create: `scripts/test-analytics.mjs`
- Modify: `src/app/natal/page.tsx`
- Modify: `src/app/solar-return/page.tsx`
- Modify: `package.json`

- [ ] **Step 1: Write the failing analytics helper test**

Create `scripts/test-analytics.mjs`:

```js
import assert from "node:assert/strict";
import { trackChartEvent } from "../src/lib/analytics.ts";

const calls = [];
globalThis.window = {
  gtag: (...args) => calls.push(args),
};

trackChartEvent("chart_generated", {
  chart_type: "natal",
  house_system: "B",
});

assert.deepEqual(calls[0], [
  "event",
  "chart_generated",
  { chart_type: "natal", house_system: "B" },
]);

assert.throws(
  () => trackChartEvent("chart_generated", { chart_type: "natal", city: "Jakarta" }),
  /Unsupported analytics field: city/,
);

delete globalThis.window;
assert.doesNotThrow(() => trackChartEvent("birth_form_start", { chart_type: "solar_return" }));

console.log("Analytics tests passed");
```

- [ ] **Step 2: Add and run the failing analytics command**

Add to `package.json`:

```json
"test:analytics": "node --experimental-strip-types scripts/test-analytics.mjs"
```

Run:

```bash
npm run test:analytics
```

Expected: FAIL because `src/lib/analytics.ts` does not exist.

- [ ] **Step 3: Implement the allowlisted analytics helper**

Create `src/lib/analytics.ts`:

```ts
export type ChartEventName =
  | "birth_form_start"
  | "chart_generated"
  | "chart_generation_error"
  | "chart_shared";

type ChartEventPayload = {
  chart_type: "natal" | "solar_return";
  house_system?: string;
  share_method?: "copy_link" | "download_image";
  error_category?: "network" | "calculation" | "unknown";
};

const ALLOWED_FIELDS = new Set([
  "chart_type",
  "house_system",
  "share_method",
  "error_category",
]);

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackChartEvent(name: ChartEventName, payload: ChartEventPayload): void {
  for (const key of Object.keys(payload)) {
    if (!ALLOWED_FIELDS.has(key)) throw new Error(`Unsupported analytics field: ${key}`);
  }
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, payload);
}
```

- [ ] **Step 4: Instrument Solar Return calculation boundaries**

In `src/app/solar-return/page.tsx`:

- Import `trackChartEvent`.
- Add `const formStarted = useRef(false);`.
- Add a form-container `onChange` handler that sends `birth_form_start` once with `{ chart_type: "solar_return" }`.
- After `setChart(data)`, send `chart_generated` with `chart_type` and the selected house system.
- In `catch`, categorize the error as `network` for failed fetches, otherwise `calculation`, and send `chart_generation_error`.

Do not include any field values from the birth form.

- [ ] **Step 5: Instrument natal calculation and sharing boundaries**

In `src/app/natal/page.tsx`:

- Import `trackChartEvent` and add one `useRef(false)` form-start guard.
- Send `birth_form_start` from `#sidebar_form` on the first input/select change.
- Change `requestChart` to return `true` after setting chart data and `false` on failure.
- Send `chart_generated` only after a successful user-triggered `drawChart`, using `{ chart_type: "natal", house_system: hsys }`.
- Send `chart_generation_error` when the user-triggered request fails.
- Send `chart_shared` with `copy_link` after clipboard success.
- Send `chart_shared` with `download_image` after the image download link is clicked.
- Do not mark the automatic current-time chart generated on initial page load as a conversion.

- [ ] **Step 6: Run analytics tests and build**

```bash
npm run test:analytics
npm run build
```

Expected: analytics tests pass and build exits 0.

- [ ] **Step 7: Commit analytics events**

```bash
git add package.json scripts/test-analytics.mjs src/lib/analytics.ts src/app/natal/page.tsx src/app/solar-return/page.tsx
git commit -m "feat: track anonymous chart conversion events"
```

---

### Task 5: Repair natal chart mobile layout without changing desktop geometry

**Files:**
- Create: `src/app/natal/natal-mobile.css`
- Create: `scripts/test-natal-mobile-css.mjs`
- Modify: `src/app/natal/page.tsx`
- Modify: `package.json`

- [ ] **Step 1: Write the failing responsive source test**

Create `scripts/test-natal-mobile-css.mjs`:

```js
import assert from "node:assert/strict";
import fs from "node:fs";

const css = fs.readFileSync("src/app/natal/natal-mobile.css", "utf8");
const page = fs.readFileSync("src/app/natal/page.tsx", "utf8");

assert.match(css, /@media \(max-width: 767px\)/);
assert.match(css, /\.natal-page-shell/);
assert.match(css, /#rightsidebar/);
assert.match(css, /#chartwrap/);
assert.match(css, /\.natal-scroll-region/);
assert.doesNotMatch(css.split("@media (max-width: 767px)")[0], /#chart svg/);
assert.match(page, /import "\.\/natal-mobile\.css"/);
assert.match(page, /className="natal-scroll-region"/);

console.log("Natal mobile CSS tests passed");
```

- [ ] **Step 2: Add and run the failing CSS command**

Add to `package.json`:

```json
"test:natal-mobile": "node scripts/test-natal-mobile-css.mjs"
```

Run:

```bash
npm run test:natal-mobile
```

Expected: FAIL because `natal-mobile.css` does not exist.

- [ ] **Step 3: Add scoped mobile-only layout rules**

Create `src/app/natal/natal-mobile.css`:

```css
@media (max-width: 767px) {
  .natal-page-shell {
    display: flex;
    width: 100%;
    min-width: 0;
    flex-direction: column;
    overflow-x: clip;
  }

  .natal-page-shell #rightsidebar {
    position: relative !important;
    inset: auto !important;
    order: -1;
    width: calc(100% - 16px) !important;
    margin: 8px !important;
    box-sizing: border-box;
  }

  .natal-page-shell #natalmain {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0;
    padding: 8px !important;
    box-sizing: border-box;
    overflow: visible !important;
  }

  .natal-page-shell #chartwrap {
    display: grid !important;
    grid-template-columns: minmax(0, 1fr);
    width: 100%;
    gap: 12px;
    overflow: visible !important;
  }

  .natal-page-shell #chart {
    grid-row: 1;
    width: 100%;
    min-width: 0;
    overflow: hidden;
  }

  .natal-page-shell #chart svg {
    display: block;
    width: 100% !important;
    max-width: 520px !important;
    height: auto !important;
    margin-inline: auto;
  }

  .natal-page-shell #aspgrid {
    grid-row: 2;
  }

  .natal-scroll-region,
  .natal-page-shell #aspgrid,
  .natal-page-shell .alm-panel {
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
    overscroll-behavior-inline: contain;
    -webkit-overflow-scrolling: touch;
  }

  .natal-page-shell #sidebar_form input,
  .natal-page-shell #sidebar_form select {
    max-width: 100%;
    box-sizing: border-box;
  }
}
```

These selectors do not affect widths at 768 pixels and above.

- [ ] **Step 4: Wire responsive containers into the natal page**

In `src/app/natal/page.tsx`:

- Import `./natal-mobile.css` immediately after component imports.
- Add `className="natal-scroll-region"` to `#aspgrid`.
- Add `className="natal-scroll-region"` to `.alm-panel` while retaining the existing class.
- Remove only the overlapping `max-width: 900px` declarations from the inline style string when they conflict with the new file. Keep all glyph sizing, table styling, and desktop declarations unchanged.

- [ ] **Step 5: Run CSS tests and build**

```bash
npm run test:natal-mobile
npm run build
```

Expected: CSS tests pass and build exits 0.

- [ ] **Step 6: Start the site and perform browser viewport checks**

Run:

```bash
npm run dev
```

Verify `/natal` at 390x844, 430x932, 1024x768, and 1440x900. At each mobile width, evaluate:

```js
({
  viewport: document.documentElement.clientWidth,
  documentWidth: document.documentElement.scrollWidth,
  shellWidth: document.querySelector('.natal-page-shell')?.getBoundingClientRect().width,
})
```

Expected: `documentWidth <= viewport + 1`; form fields fit; the wheel is centered; the aspect matrix and tables scroll inside their own sections. Compare the 1440x900 screenshot with the pre-change desktop screenshot; chart, aspect matrix, sidebar, symbols, and table positions must remain unchanged.

- [ ] **Step 7: Commit the mobile repair**

```bash
git add package.json scripts/test-natal-mobile-css.mjs src/app/natal/natal-mobile.css src/app/natal/page.tsx
git commit -m "fix: make natal chart usable on mobile"
```

---

### Task 6: Add one combined repeatable verification command

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add the combined test script**

Add to `package.json`:

```json
"test:acquisition": "npm run test:seo-metadata && npm run test:blog-index && npm run test:solar-return-content && npm run test:analytics && npm run test:natal-mobile"
```

- [ ] **Step 2: Run all acquisition tests**

```bash
npm run test:acquisition
```

Expected: all five scripts print their `passed` message and exit 0.

- [ ] **Step 3: Run repository regression checks**

```bash
node scripts/test-latest-birth-profile.mjs
node scripts/test-bazi-view-data.mjs
npm run build
git diff --check
```

Expected: both existing scripts pass, production build exits 0, and `git diff --check` prints nothing.

- [ ] **Step 4: Commit the combined verification command**

```bash
git add package.json
git commit -m "test: add search acquisition regression suite"
```

---

### Task 7: Verify production behavior, deploy, and update Search Console

**Files:**
- No source files unless verification exposes a defect.

- [ ] **Step 1: Capture local rendered metadata**

With the production server running, execute:

```bash
npm run build
npm run start -- --port 3100
```

For each route, inspect rendered HTML:

```bash
for route in / /natal /solar-return /bazi /transits /tarot /compatibility /blog/moon-in-sagittarius-73; do
  echo "$route"
  curl -sS "http://localhost:3100$route" | tr '>' '>\n' | rg '<title|rel="canonical"|hreflang=|name="robots"|<html lang='
done
```

Expected:

- Every core route has its own canonical.
- No route prints duplicate-language hreflang lines.
- The document language is English.
- `moon-in-sagittarius-73` prints `noindex, follow` and keeps its self-canonical.

- [ ] **Step 2: Verify sitemap and robots locally**

```bash
curl -sS http://localhost:3100/sitemap.xml | rg -c '<url>'
curl -sS http://localhost:3100/sitemap.xml | rg 'moon-in-sagittarius-73' && exit 1 || true
curl -sS http://localhost:3100/robots.txt
```

Expected: sitemap URL count is below 100; the thin Moon article is absent; robots points to `https://lunaxstar.com/sitemap.xml`.

- [ ] **Step 3: Browser-test both calculators**

In a real browser:

1. Open `/natal` at 390x844 and wait for the current-location/fallback chart.
2. Change one birth field, submit, and verify a complete wheel, aspect matrix, and tables appear.
3. Confirm document-level horizontal overflow remains absent after calculation.
4. Copy the chart link and export the image.
5. Open `/solar-return`, submit the default form, and verify the chart result, explanatory content, FAQ, and related links.
6. Repeat the natal result at 1440x900 and compare with the pre-change desktop screenshot.

Expected: both calculations succeed; mobile is usable; desktop natal is unchanged; no browser console errors are introduced.

- [ ] **Step 4: Verify GA4 event calls without personal fields**

Use the browser network/console state to confirm these events occur:

```text
birth_form_start       chart_type
chart_generated        chart_type, house_system
chart_generation_error chart_type, error_category
chart_shared           chart_type, share_method
```

Expected: no name, birth date/time, city, coordinates, email, or planet placements appear in event parameters.

- [ ] **Step 5: Deploy to the production Vercel project**

Capture the deployment output and derive the exact deployment URL:

```bash
npx vercel --prod --yes 2>&1 | tee /tmp/lunaxstar-vercel-deploy.log
DEPLOYMENT_URL="$(rg -o 'https://[^ ]+\.vercel\.app' /tmp/lunaxstar-vercel-deploy.log | tail -1)"
test -n "$DEPLOYMENT_URL"
printf '%s\n' "$DEPLOYMENT_URL"
```

If Vercel does not automatically assign the custom domain, apply the alias:

```bash
npx vercel alias set "$DEPLOYMENT_URL" lunaxstar.com
```

- [ ] **Step 6: Verify live production HTML and UI**

```bash
curl -sS -o /dev/null -w '%{http_code}\n' https://lunaxstar.com/
curl -sS -o /dev/null -w '%{http_code}\n' https://lunaxstar.com/natal
curl -sS -o /dev/null -w '%{http_code}\n' https://lunaxstar.com/solar-return
curl -sS https://lunaxstar.com/natal | tr '>' '>\n' | rg '<title|rel="canonical"|hreflang=|<html lang='
curl -sS https://lunaxstar.com/sitemap.xml | rg -c '<url>'
```

Expected: all status codes are 200; natal canonical points to `/natal`; no false hreflang appears; live sitemap has fewer than 100 URLs.

Repeat the mobile and desktop browser checks against `https://lunaxstar.com` rather than relying on HTTP status alone.

- [ ] **Step 7: Resubmit Search Console only after live verification**

In the verified `sc-domain:lunaxstar.com` property:

1. Open **Sitemaps** and submit `https://lunaxstar.com/sitemap.xml`.
2. Inspect `/natal` and `/solar-return` with URL Inspection and confirm the declared canonical matches each URL.
3. Request indexing for those two core pages.
4. Open the existing `Crawled - currently not indexed` issue. Do not start another validation if the current July 15 validation is still running; let Google recrawl the corrected sitemap first.

- [ ] **Step 8: Record final evidence and status**

Report:

- Commits created.
- Exact tests and build commands that passed.
- Local and production browser viewport results.
- Live canonical and sitemap evidence.
- Deployment URL and `lunaxstar.com` alias status.
- Search Console sitemap submission and validation state.

Do not claim indexing recovery immediately; Google recrawl timing is external. The deploy is complete when live HTML and UI are correct.

---

## Self-Review Results

- **Spec coverage:** All first-phase requirements map to Tasks 1-7. Homepage acquisition redesign remains explicitly deferred.
- **Placeholder scan:** No incomplete implementation placeholders remain; deployment URL capture is expressed as an executable command.
- **Type consistency:** `createPageMetadata`, `siteUrl`, `isIndexableArticle`, and `trackChartEvent` use the same names and payload fields throughout the plan.
- **Scope:** Metadata, index policy, Solar Return content, analytics, and mobile CSS are independently committable and jointly verifiable.
