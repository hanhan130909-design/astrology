# Location, Blog Links, and Chinese Natal Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the automatic natal chart use a consistent location and time zone, make every blog card open its article, and make the default Chinese natal guide and FAQ fully Chinese.

**Architecture:** A server-only location API resolves coordinates to an IANA time zone and a DST-aware UTC offset, while a small client helper coordinates browser geolocation, Vercel IP fallback, and the final Taipei fallback. Blog and natal SEO changes remain isolated from chart rendering: the blog keeps summary-only client data, and the natal guide remains server-rendered from one FAQ data source.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, `tz-lookup`, Node assertion tests, Playwright browser verification, Vercel geolocation headers.

---

## File Map

- Create `src/lib/locationTimezone.ts`: server-only coordinate validation, IANA lookup, and DST-aware offset calculation.
- Create `src/lib/gmtOffset.ts`: client-safe GMT offset formatting with no time zone database import.
- Create `src/app/api/location/route.ts`: resolve explicit coordinates or Vercel IP headers without storing location data.
- Create `src/lib/natalLocation.ts`: browser/IP/default fallback orchestration and serializable location types.
- Create `scripts/test-location-timezone.mjs`: deterministic location, offset, fallback, and source-boundary tests.
- Modify `src/app/natal/page.tsx`: consume the location helper for initial chart, new chart, manual city search, and display.
- Modify `src/app/blog/BlogIndexClient.tsx`: unique `H1` and complete-card article links.
- Modify `scripts/test-performance-boundaries.mjs`: enforce blog link and heading behavior without importing article bodies.
- Modify `src/components/natalFaq.ts`: Chinese FAQ source data.
- Modify `src/components/NatalSeoContent.tsx`: Chinese server-rendered guide and related links.
- Verify `src/app/natal/layout.tsx`: its existing JSON-LD import must continue to use the shared FAQ source.
- Modify `src/app/layout.tsx` and `src/contexts/LanguageContext.tsx`: set the default and restored document language correctly.
- Modify `scripts/test-natal-seo-content.mjs`: assert Chinese visible content and schema identity.
- Modify `package.json` and `package-lock.json`: add dependencies and include the location suite in `test:acquisition`.

---

### Task 1: Server-Side Time Zone Resolution

**Files:**
- Create: `src/lib/locationTimezone.ts`
- Create: `src/lib/gmtOffset.ts`
- Create: `src/app/api/location/route.ts`
- Create: `scripts/test-location-timezone.mjs`
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Install server-side time zone dependencies**

Run:

```bash
npm install tz-lookup@6.1.25
npm install --save-dev @types/tz-lookup@6.1.2
```

Expected: `package.json` contains `tz-lookup` under dependencies and `@types/tz-lookup` under devDependencies; `package-lock.json` is updated.

- [ ] **Step 2: Write the failing deterministic time zone test**

Create `scripts/test-location-timezone.mjs` with assertions equivalent to:

```js
import assert from "node:assert/strict";
import {
  getTimeZoneOffsetMinutes,
  isValidCoordinatePair,
  resolveCoordinateTimeZone,
} from "../src/lib/locationTimezone.ts";
import { formatGmtOffset } from "../src/lib/gmtOffset.ts";

assert.equal(isValidCoordinatePair(25.05, 121.5), true);
assert.equal(isValidCoordinatePair(91, 121.5), false);
assert.equal(resolveCoordinateTimeZone(25.05, 121.5), "Asia/Taipei");
assert.equal(resolveCoordinateTimeZone(28.6139, 77.209), "Asia/Kolkata");

const wallTime = (year, month, day, hour = 12, minute = 0) => ({
  year, month, day, hour, minute,
});
assert.equal(getTimeZoneOffsetMinutes("Asia/Taipei", wallTime(2026, 7, 17)), 480);
assert.equal(getTimeZoneOffsetMinutes("Asia/Kolkata", wallTime(2026, 7, 17)), 330);
assert.equal(getTimeZoneOffsetMinutes("Asia/Kathmandu", wallTime(2026, 7, 17)), 345);
assert.equal(getTimeZoneOffsetMinutes("America/New_York", wallTime(2026, 1, 17)), -300);
assert.equal(getTimeZoneOffsetMinutes("America/New_York", wallTime(2026, 7, 17)), -240);
assert.equal(formatGmtOffset(480), "GMT+08:00");
assert.equal(formatGmtOffset(330), "GMT+05:30");
assert.equal(formatGmtOffset(-210), "GMT-03:30");
```

- [ ] **Step 3: Run the test and verify the missing module failure**

Run:

```bash
node --experimental-strip-types scripts/test-location-timezone.mjs
```

Expected: FAIL because `src/lib/locationTimezone.ts` does not exist.

- [ ] **Step 4: Implement the time zone module**

Create `src/lib/locationTimezone.ts` with these public boundaries:

```ts
import tzLookup from "tz-lookup";

export type LocalDateTime = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

export function isValidCoordinatePair(latitude: number, longitude: number): boolean;
export function resolveCoordinateTimeZone(latitude: number, longitude: number): string;
export function getTimeZoneOffsetMinutes(timeZone: string, local: LocalDateTime): number;
```

Implementation requirements:

```ts
if (!isValidCoordinatePair(latitude, longitude)) {
  throw new RangeError("Invalid latitude or longitude");
}

const parts = new Intl.DateTimeFormat("en-US", {
  timeZone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
}).formatToParts(instant);
```

Calculate the zone offset at an instant from formatted parts, then resolve the requested local wall time with a second pass so summer and winter New York return different values. Validate finite integer date parts and throw for an invalid IANA zone.

Create `src/lib/gmtOffset.ts` as a pure module whose only export is `formatGmtOffset(offsetMinutes)`. It must validate a finite minute value and return a sign plus two-digit hours and minutes. It must not import `tz-lookup` or `locationTimezone`.

- [ ] **Step 5: Run the time zone test**

Run:

```bash
node --experimental-strip-types scripts/test-location-timezone.mjs
```

Expected: PASS for coordinate validation, Taipei, Kolkata, Kathmandu, New York DST, and GMT formatting.

- [ ] **Step 6: Add the location API**

Create `src/app/api/location/route.ts` with a GET handler that:

```ts
type LocationPayload = {
  source: "coordinates" | "ip";
  city: string;
  latitude: number;
  longitude: number;
  timeZone: string;
  offsetMinutes: number;
};
```

- Reads `year`, `month`, `day`, `hour`, and `minute` with bounded numeric parsing.
- Uses explicit `lat` and `lng` query values when both are present.
- Otherwise reads `x-vercel-ip-latitude`, `x-vercel-ip-longitude`, `x-vercel-ip-city`, and `x-vercel-ip-timezone`.
- Resolves an absent or invalid Vercel zone with `resolveCoordinateTimeZone`.
- Returns `{ location: LocationPayload }` on success, `{ location: null }` when IP headers are absent, and HTTP 400 for malformed explicit coordinates.
- Decodes the Vercel city header safely and never logs or persists coordinates.

- [ ] **Step 7: Extend the test with route source invariants**

Append source assertions that verify the route imports `locationTimezone`, reads all four Vercel headers, returns `location: null`, and contains no database/Firebase import. Also assert `tz-lookup` is absent from the static module graph rooted at `src/app/natal/page.tsx`.

- [ ] **Step 8: Add the suite to acquisition tests and commit**

Add:

```json
"test:location-timezone": "node --experimental-strip-types scripts/test-location-timezone.mjs"
```

and include `npm run test:location-timezone` in `test:acquisition`.

Run:

```bash
npm run test:location-timezone
git add package.json package-lock.json src/lib/locationTimezone.ts src/lib/gmtOffset.ts src/app/api/location/route.ts scripts/test-location-timezone.mjs
git commit -m "fix: resolve natal locations with real time zones"
```

Expected: test passes and the commit contains no natal chart component changes.

---

### Task 2: Natal Location Fallback Integration

**Files:**
- Create: `src/lib/natalLocation.ts`
- Modify: `src/app/natal/page.tsx:14-27, 70-107, 132-184, 490-635`
- Modify: `scripts/test-location-timezone.mjs`

- [ ] **Step 1: Write failing fallback tests**

Extend `scripts/test-location-timezone.mjs` to import:

```js
import {
  TAIPEI_FALLBACK,
  getCurrentNatalLocation,
  resolveLocationFromApi,
} from "../src/lib/natalLocation.ts";
```

Use the dependency-injection boundary below to test three cases:

```js
const dateTime = { year: 2026, month: 7, day: 17, hour: 16, minute: 30 };

const browserLocation = await getCurrentNatalLocation(dateTime, {
  geolocate: async () => ({ latitude: -6.2, longitude: 106.8 }),
  resolve: async (coordinates) => coordinates ? {
    city: "Jakarta",
    latitude: -6.2,
    longitude: 106.8,
    timeZone: "Asia/Jakarta",
    offsetMinutes: 420,
    source: "coordinates",
  } : null,
});
assert.equal(browserLocation.source, "browser");
assert.equal(browserLocation.offsetMinutes, 420);

const ipLocation = await getCurrentNatalLocation(dateTime, {
  geolocate: async () => { throw new Error("denied"); },
  resolve: async () => ({
    city: "Taipei",
    latitude: 25.05,
    longitude: 121.5,
    timeZone: "Asia/Taipei",
    offsetMinutes: 480,
    source: "ip",
  }),
});
assert.equal(ipLocation.city, "Taipei（约）");
assert.equal(ipLocation.source, "ip");

const defaultLocation = await getCurrentNatalLocation(dateTime, {
  geolocate: async () => { throw new Error("denied"); },
  resolve: async () => null,
});
assert.deepEqual(defaultLocation, TAIPEI_FALLBACK);
```

Assert the returned object always contains matching `latitude`, `longitude`, `timeZone`, `offsetMinutes`, `city`, and `source`, and that only the final fallback is exactly `TAIPEI_FALLBACK`.

- [ ] **Step 2: Run the test and verify the missing module failure**

Run `npm run test:location-timezone`.

Expected: FAIL because `src/lib/natalLocation.ts` does not exist.

- [ ] **Step 3: Implement the client location helper**

Create `src/lib/natalLocation.ts` without React imports:

```ts
export type NatalLocation = {
  city: string;
  latitude: number;
  longitude: number;
  timeZone: string;
  offsetMinutes: number;
  source: "browser" | "ip" | "default";
};

export const TAIPEI_FALLBACK: NatalLocation = {
  city: "台北市（默认）",
  latitude: 25.05,
  longitude: 121.5,
  timeZone: "Asia/Taipei",
  offsetMinutes: 480,
  source: "default",
};
```

`resolveLocationFromApi` builds a same-origin `/api/location` URL with the date fields and optional coordinates. `getCurrentNatalLocation(dateTime, dependencies?)` accepts optional `geolocate()` and `resolve(coordinates?)` dependencies matching the test above; production defaults wrap `navigator.geolocation` and `resolveLocationFromApi`. Apply a 3000 ms timeout, label precise browser data as `当前位置`, label Vercel data as `${city}（约）`, and return a fresh copy of the Taipei fallback after all failures.

- [ ] **Step 4: Run fallback tests**

Run `npm run test:location-timezone`.

Expected: PASS for browser, IP, and default paths.

- [ ] **Step 5: Replace the natal page initialization**

In `src/app/natal/page.tsx`:

- Import `formatGmtOffset` from the client-safe `gmtOffset` module and import the natal location helper.
- Add one `applyLocationToForm(location)` function that updates city, coordinate degrees/minutes/directions, and `tz`.
- Track the resolved IANA `timeZone` and whether the user manually changed the GMT selector. Applying browser, IP, or searched-city data sets automatic mode; changing the GMT selector sets manual mode.
- Replace the current mount effect with an async call to `getCurrentNatalLocation`, then call `/api/chart` with that exact location and `offsetMinutes / 60`.
- Guard the effect with a cancellation boolean so a completed request cannot update an unmounted component.
- Make `startNewChart` reset the date and chart, then run the same current-location initializer rather than pairing Taipei with the browser offset.
- Change `codeAddress` to call `/api/location` after Nominatim returns coordinates and apply the returned time zone; remove `Math.round(lo / 15) * 60`.
- Before `drawChart`, when time zone mode is automatic, resolve the selected coordinates again using the selected birth year, month, day, hour, and minute. Use that returned offset for `/api/chart`; this makes historical summer/winter births DST-aware. Preserve a manually selected GMT value without overriding it.
- Save the IANA zone with new saved charts. When loading an older saved chart that only has a numeric offset, treat its time zone as manual so its existing result does not change unexpectedly.
- Render `formatGmtOffset(tz)` instead of string concatenation.
- Replace the whole-hour-only option list with a sorted list containing all offsets from UTC-12:00 to UTC+14:00 in 30-minute increments plus UTC+05:45, UTC+08:45, and UTC+12:45; render labels through `formatGmtOffset`.

- [ ] **Step 6: Add source regression assertions**

Append assertions that `src/app/natal/page.tsx`:

```js
assert.doesNotMatch(natalSource, /Math\.round\(lo\s*\/\s*15\)/);
assert.doesNotMatch(natalSource, /setCity\("台北市"\).*setTz\(-current\.getTimezoneOffset\(\)\)/s);
assert.match(natalSource, /getCurrentNatalLocation/);
assert.match(natalSource, /formatGmtOffset\(tz\)/);
```

- [ ] **Step 7: Run targeted and existing natal tests, then commit**

Run:

```bash
npm run test:location-timezone
npm run test:natal-mobile
node scripts/test-latest-birth-profile.mjs
git add src/lib/natalLocation.ts src/app/natal/page.tsx scripts/test-location-timezone.mjs
git commit -m "fix: keep natal coordinates and time zones aligned"
```

Expected: all commands pass; chart drawing components remain unchanged.

---

### Task 3: Clickable Blog Index and H1

**Files:**
- Modify: `src/app/blog/BlogIndexClient.tsx:94-190`
- Modify: `scripts/test-performance-boundaries.mjs`

- [ ] **Step 1: Add failing blog semantic tests**

Extend `scripts/test-performance-boundaries.mjs` with AST/source assertions that:

- `BlogIndexClient` contains exactly one `h1` and it renders `currentT.title`.
- The featured section uses `h2`, and article titles use `h3` beneath it.
- The source does not contain `Snippet` or `article.id.startsWith('destiny-')`.
- The mapped article card contains `href={`/blog/${article.slug}`}`.
- Article bodies remain unreachable from the client module graph.

- [ ] **Step 2: Run the performance-boundary test and verify failure**

Run `npm run test:performance-boundaries`.

Expected: FAIL on the current `h2`, `Snippet`, and conditional link behavior.

- [ ] **Step 3: Implement the complete-card links**

Modify `BlogIndexClient.tsx`:

```tsx
<h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
  {currentT.title}
</h1>
```

Change the featured heading to `h2`, and use `h3` for every article title.

For every summary, keep `article` as the semantic wrapper and place one Link around its visual content:

```tsx
<article
  key={article.id}
  className="group overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 transition-all duration-300 hover:-translate-y-1 hover:border-gray-200"
>
  <Link
    href={`/blog/${article.slug}`}
    className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
  >
    <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-gray-50/30 via-gray-900/20 to-gray-50/30">
      <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent opacity-60" />
      <span className="relative z-10 text-5xl">✨</span>
      <div className="absolute left-4 top-4">
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${getCategoryColor(article.category)}`}>
          {getCategoryName(article)}
        </span>
      </div>
    </div>

    <div className="p-6">
      <div className="mb-3 flex items-center gap-3 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" aria-hidden="true" />
          {article.readTime} {currentT.minRead}
        </span>
        {article.date && (
          <>
            <span>•</span>
            <span>{formatDate(article.date)}</span>
          </>
        )}
      </div>

      <h3 className="mb-3 line-clamp-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-gray-600">
        {article.title[language] || article.title.en}
      </h3>
      <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-500">
        {article.excerpt[language] || article.excerpt.en}
      </p>
      <div className="mb-4 flex flex-wrap gap-2">
        {article.tags.slice(0, 3).map((tag: string) => (
          <span key={tag} className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-500">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <span className="text-sm text-gray-500">
          {currentT.by} {language === "zh" ? article.author : language === "id" ? article.authorId : article.authorEn}
        </span>
        <span className="flex items-center gap-1 text-sm font-medium text-gray-700">
          {currentT.readMore}
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </div>
  </Link>
</article>
```

Remove the nested conditional Link so the markup contains no nested anchors.

- [ ] **Step 4: Run blog tests and commit**

Run:

```bash
npm run test:performance-boundaries
npm run test:blog-index
git add src/app/blog/BlogIndexClient.tsx scripts/test-performance-boundaries.mjs
git commit -m "fix: link every blog card to its article"
```

Expected: summary-only boundary, H1, link, and blog policy tests pass.

---

### Task 4: Chinese Natal Guide and FAQ Schema

**Files:**
- Modify: `src/components/natalFaq.ts`
- Modify: `src/components/NatalSeoContent.tsx`
- Verify: `src/app/natal/layout.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/contexts/LanguageContext.tsx`
- Modify: `scripts/test-natal-seo-content.mjs`

- [ ] **Step 1: Replace test expectations with Chinese content**

Update `scripts/test-natal-seo-content.mjs` so FAQ substance uses character length rather than English word count:

```js
assert.ok(faq.answer.trim().length >= 35, `FAQ answer must be substantive: ${faq.question}`);
```

Expected headings:

```js
[
  { level: "h1", text: "如何阅读你的本命盘" },
  { level: "h2", text: "星盘的四个层次" },
  { level: "h2", text: "实用的阅读顺序" },
  { level: "h2", text: "出生时间为什么重要" },
  { level: "h2", text: "相关工具与指南" },
  { level: "h2", text: "本命盘常见问题" },
]
```

Expected related labels: `太阳返照盘`、`星象日历`、`星座配对`、`八字排盘`、`本命盘阅读指南`。Expected definition terms: `行星`、`星座`、`宫位`、`相位`。Assert the layout contains `<html lang="zh-CN"` and the language restore effect assigns `document.documentElement.lang`.

- [ ] **Step 2: Run the SEO test and verify it fails on English content**

Run `npm run test:natal-seo-content`.

Expected: FAIL on headings, FAQ questions, related labels, and root language.

- [ ] **Step 3: Translate the shared FAQ source**

Replace all seven entries in `natalFaqs` with substantive simplified-Chinese questions and answers covering:

1. 什么是本命盘？
2. 本命盘计算器有多准确？
3. 太阳星座和上升星座有什么区别？
4. 十二宫位分别代表什么？
5. 如何阅读星盘中的相位？
6. 不知道准确出生时间怎么办？
7. 本命盘可以预测未来吗？

Keep `serializeNatalFaqJsonLd` unchanged so visible FAQ and JSON-LD remain identical and escaped.

- [ ] **Step 4: Translate the server-rendered guide**

Translate `NatalSeoContent.tsx` headings, paragraphs, definition terms, reading steps, birth-time warning, nav aria-label, related link labels, and FAQ heading. Preserve the current element hierarchy, IDs, classes, one `h1`, five `h2` elements, seven native `details`, and server-component status.

- [ ] **Step 5: Correct the default document language**

Change the root element to:

```tsx
<html lang="zh-CN" suppressHydrationWarning>
```

In the LanguageProvider restore effect, after validating the saved language, add:

```ts
document.documentElement.lang = saved === "zh" ? "zh-CN" : saved;
```

Use the same normalization in `setLanguage` so selecting Chinese does not set the incomplete `lang="zh"` value.

- [ ] **Step 6: Run SEO and acquisition tests, then commit**

Run:

```bash
npm run test:natal-seo-content
npm run test:acquisition
git add src/components/natalFaq.ts src/components/NatalSeoContent.tsx src/app/layout.tsx src/contexts/LanguageContext.tsx scripts/test-natal-seo-content.mjs
git commit -m "fix: align natal SEO content with Chinese pages"
```

Expected: all acquisition suites pass and JSON-LD exactly matches visible Chinese FAQ data.

---

### Task 5: Integrated Verification and Production Release

**Files:**
- Verify all modified files
- Update no production source unless verification exposes a regression

- [ ] **Step 1: Run the complete local verification set**

Run:

```bash
npm run test:acquisition
node scripts/test-latest-birth-profile.mjs
node scripts/test-bazi-view-data.mjs
git diff --check HEAD -- src scripts package.json package-lock.json docs/superpowers
npm run build
```

Expected: all tests pass, no whitespace errors, and Next.js generates all static pages successfully.

- [ ] **Step 2: Start the local production server**

Run:

```bash
npm run start -- --port 3011
```

Expected: Next.js listens on `http://localhost:3011` without using an occupied port.

- [ ] **Step 3: Verify natal behavior in a real browser**

At desktop 1440x1000 and mobile 390x844:

- Load `/natal`, deny browser location, and confirm a nonblank chart still appears.
- Confirm city/coordinates/timezone are internally consistent and never show `台北市` with anything except `GMT+08:00`.
- Allow or mock browser coordinates and confirm those coordinates win over IP fallback.
- Search Taipei and Jakarta manually and confirm offsets resolve to `GMT+08:00` and `GMT+07:00`.
- Confirm chart and aspect table retain their existing desktop and mobile layout with no horizontal overflow.
- Confirm one Chinese H1, five Chinese H2 headings, and seven expandable Chinese FAQ items.

- [ ] **Step 4: Verify blog behavior**

- Confirm `/blog` has one H1, 20 cards on page 1, and `445 articles · Page 1 of 23`.
- Open a non-destiny SEO card and a destiny card from the card surface; both detail pages must return 200 and show substantial bodies.
- Move to page 2 and confirm 20 different cards and `Page 2 of 23`.
- Confirm no first-party console errors or failed first-party requests.

- [ ] **Step 5: Review, push, and deploy**

Run:

```bash
git status --short --branch
git push origin main
npx vercel --prod --yes 2>&1 | tee /tmp/lunaxstar-vercel-deploy.log
export DEPLOYMENT_URL="$(rg -o 'https://[^[:space:]]+\.vercel\.app' /tmp/lunaxstar-vercel-deploy.log | tail -1)"
test -n "$DEPLOYMENT_URL"
npx vercel alias set "$DEPLOYMENT_URL" lunaxstar.com
```

Expected: `main` is pushed, `DEPLOYMENT_URL` contains the new deployment URL, the deployment reaches READY, and the alias command succeeds.

- [ ] **Step 6: Verify production-domain truth**

Check `https://lunaxstar.com/natal` and `https://lunaxstar.com/blog` in the browser, not only with `curl`. Confirm rendered chart data, consistent location/timezone, blog links, Chinese guide/FAQ, pagination, HTTP 200 responses, and zero first-party console errors. Leave the in-app browser on the production natal page.
