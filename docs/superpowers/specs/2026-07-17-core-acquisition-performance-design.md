# Core Acquisition Performance Design

## Objective

Improve LunaXStar's search acquisition and mobile first-load experience without changing natal-chart calculations, chart geometry, aspect-table rendering, house systems, or the existing professional desktop workflow.

This batch targets three measured problems:

- `/blog` ships full article bodies to the client and has an approximately 827 KB first load.
- `/natal` has an approximately 483 KB first load while optional authentication actions are statically linked.
- The natal calculator has structured FAQ data but lacks equivalent visible, indexable explanatory content and focused internal links.

## Scope

### Included

1. Remove static Firebase dependencies from shared authentication and natal-only account actions where the existing public interfaces can remain unchanged.
2. Make Firebase load only when authentication state or an account action requires it.
3. Convert the blog index to a server/client split that sends article summaries, not full article bodies, to the interactive list.
4. Add an English, server-rendered natal-chart guide after the complete professional calculator and data tables.
5. Generate visible natal FAQ content and FAQ structured data from one shared source.
6. Add focused internal links from the natal guide to Solar Return, the astrology calendar, compatibility, BaZi, and relevant guides.
7. Add regression tests and compare route bundle sizes before and after the change.

### Excluded

- Astrology algorithms, Swiss Ephemeris requests, coordinates, time zones, house cusps, planet positions, aspects, Firdaria, profections, or Aphesis calculations.
- Natal wheel geometry, symbols, colors, aspect matrix, tables, desktop positioning, and established mobile calculator layout.
- A site-wide visual redesign.
- New calculator routes or new authentication features.
- Rewriting article detail content.

## User Experience

The natal calculator remains the first and dominant experience. Its menu, chart, aspect table, professional tables, saved charts, AI reading, copy, and image export controls retain their current behavior.

The new guide appears only after the calculator, all chart results, and professional tables. It uses an unframed, restrained reading layout rather than promotional cards:

1. A concise introduction explaining what a natal chart contains.
2. Two scannable sections covering the recommended reading order and birth-time accuracy.
3. Short explanations of planets, signs, houses, and aspects.
4. A related-tools link row.
5. Native disclosure-based FAQ items that remain readable without additional client JavaScript.

The guide is English-first for search acquisition. The calculator remains controlled by the existing language context and continues to support its current languages.

## Architecture

### Authentication Loading

`AuthContext` keeps its current exported provider, hook, and method signatures. Static Firebase value imports are replaced by dynamic imports inside the initialization effect and authentication actions. Firebase-derived TypeScript types must use type-only imports or local structural types so they do not add runtime dependencies.

The natal page's password reset and logout actions also load Firebase only when invoked. A Firebase load or configuration failure must not block chart generation; it only affects the requested account action and uses the existing user-facing error path.

### Blog Index Split

The route-level blog page becomes a server component that imports the complete article sources and maps them to a serializable summary model. The summary contains only fields needed by the index: slug, category labels, localized title and excerpt, author labels, date, read time, and tags.

A focused client component receives the summaries and owns language-dependent rendering and any local UI state. Full article `content` fields must not be passed to the client or imported by the client component. Article detail routes and URLs remain unchanged.

### Natal SEO Content

A server component renders the guide after the natal page children from the natal layout. FAQ questions and answers live in a shared server-safe data module. The visible FAQ and FAQPage JSON-LD both consume that module so they cannot drift.

Related links use normal Next.js links and point only to canonical, indexable routes. The content does not depend on the chart result or birth data and must be present in the initial HTML.

## Data Flow

Chart input and calculation flow remains unchanged:

1. The client obtains current time and location or uses the existing fallback.
2. The natal page posts the existing payload to `/api/chart`.
3. The chart response drives the current wheel and tables.

The new content has no access to birth data, chart responses, local storage, Firebase user data, or analytics identifiers.

Blog index data flows from article source modules to the server route, through a summary mapper, then to the client list. Article bodies remain server-side for the index route.

## Error Handling

- Firebase import or initialization failure leaves public calculators usable and returns the existing authentication error behavior.
- Missing or malformed blog summary fields are handled by the existing index-policy rules and stable fallbacks; one bad record must not expose full content to the client.
- Natal guide rendering is static and has no runtime loading or error state.
- Existing chart API and geolocation fallback behavior is not modified.

## Performance Acceptance

Record the current production-build first-load sizes before implementation:

- Shared JavaScript: approximately 339 KB.
- `/natal`: approximately 483 KB.
- `/blog`: approximately 827 KB.

After implementation:

- `/blog` must no longer include complete article bodies in its client module graph or serialized client props.
- Firebase must no longer be a static dependency of `AuthContext` or the natal page.
- `/blog` and the shared JavaScript bundle must show a measurable reduction in the same Next.js build report.
- `/natal` must not regress in first-load size. If Firebase remains in another required route-specific graph, document the measured result rather than claiming a reduction.

## SEO Acceptance

- The natal HTML contains the visible English guide without requiring hydration.
- The page has one FAQPage JSON-LD object whose questions and answers match the visible FAQ.
- Links to `/solar-return`, `/transits`, `/compatibility`, and `/bazi` are present in the initial HTML.
- Existing natal canonical, title, description, WebPage schema, and indexability remain unchanged.
- The guide does not introduce false claims about predictive certainty or unsupported relocated-chart behavior.

## Functional Verification

Automated checks cover:

- Blog summary mapping and the absence of article bodies from client-facing data.
- No static Firebase imports in the shared auth provider or natal route.
- Natal guide headings, visible FAQ, matching FAQPage JSON-LD, and canonical internal links.
- Existing acquisition, latest-birth-profile, and BaZi fixture suites.
- A clean production build and `git diff --check`.

Browser verification covers:

- Natal automatic chart generation and manual update at 390 px mobile width and desktop width.
- No horizontal page overflow; existing chart and table containment remain intact.
- AI reading panel can open, image export remains available, and login navigation remains reachable.
- Blog index renders titles, excerpts, categories, and article links without client errors.
- Browser console has no first-party errors on `/natal` and `/blog`.

## Deployment

After tests and browser verification, merge to `main`, push to GitHub, deploy the production build to Vercel, point `lunaxstar.com` to the verified deployment, and repeat the core production checks. Search Console does not need another sitemap submission unless the set of canonical sitemap URLs changes.
