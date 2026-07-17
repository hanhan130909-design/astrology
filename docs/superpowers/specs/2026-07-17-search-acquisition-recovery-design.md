# LunaXStar Search Acquisition Recovery Design

## Objective

Recover Google indexing and organic acquisition for LunaXStar without changing astrology calculations or the established desktop natal-chart appearance. The first implementation phase fixes technical SEO, reduces low-quality indexable content, strengthens the Solar Return landing page, repairs the natal page on mobile, and records real conversion events.

## Baseline

Search Console data through July 14, 2026 shows:

- 7 organic clicks, 675 impressions, 1% CTR, and average position 64.6 in the latest 28-day report.
- 253 indexed pages and 115 excluded pages. Of the excluded pages, 107 are "Crawled - currently not indexed."
- 437 sitemap URLs, including 424 blog URLs.
- `/solar-return` produced 6 of the 7 organic clicks from 46 impressions.
- Mobile produced 6 clicks from 82 impressions; desktop produced 1 click from 594 impressions.
- Search Console reports no external links and only one detected internal link.

Live HTML and repository inspection found:

- Global metadata makes `/natal`, `/solar-return`, `/bazi`, `/transits`, and other application pages canonicalize to the homepage.
- Every alternate language points to the same URL even though locale-specific URLs do not exist.
- English pages and articles are served under `<html lang="zh">`.
- Many generated blog entries are short templates, contain mixed Chinese characters in English sentences, or differ only by a planet/sign name.
- The natal chart desktop view is acceptable, but the mobile result collapses into a narrow strip.

## Scope

### 1. Metadata and canonical architecture

- Remove canonical and language alternates from global root metadata so they do not leak into every route.
- Give the homepage a self-referencing canonical through a homepage-specific layout.
- Give `/natal`, `/solar-return`, `/bazi`, `/transits`, `/tarot`, `/compatibility`, and `/blog` unique English-first titles, descriptions, Open Graph values, and self-referencing canonicals.
- Keep article self-canonicals on `/blog/[slug]`.
- Remove multilingual `hreflang` declarations until distinct locale URLs exist. A language switcher that changes client-side text is not an hreflang implementation.
- Serve the document as English-first with `<html lang="en">`. Client-side language selection may continue to change visible copy, but it must not emit false locale alternates.
- Preserve existing structured data when it is accurate. Do not add ratings, user counts, or other unverifiable claims.

### 2. Index quality policy and sitemap

- Replace the manually generated public sitemap with a Next.js sitemap route so metadata and sitemap rules share code.
- Include the homepage and the principal free calculators in every sitemap build.
- Include only blog articles that pass a deterministic quality policy.
- The initial policy indexes manually approved cornerstone articles plus articles whose English body is substantial, internally useful, and free of known template defects.
- Generated articles that do not pass the policy receive `noindex, follow` and are excluded from the sitemap. They remain accessible to existing links; this phase does not delete them.
- Remove false hreflang entries from article metadata.
- Add visible related-tool and related-article links to indexable articles so crawlers and users can reach the main calculators.

The quality policy is deliberately conservative. Publishing fewer useful pages is preferable to submitting hundreds of near-duplicate pages that consume crawl attention and fail indexing.

### 3. Solar Return search landing page

- Keep the existing calculator and chart calculation flow.
- Use the page title `Free Solar Return Chart Calculator (2026) - No Sign Up` and a matching self-canonical.
- Put a literal English H1 and concise value statement before the form.
- State that the calculator is free and does not require registration.
- Add a short explanation of what a Solar Return chart is, what users receive, and why birth time and return location matter.
- Add a visible example/result explanation below the calculator without inventing a result for the visitor.
- Add FAQ content and matching FAQ structured data for genuine questions answered on the page.
- Add internal links to the free natal chart, astrology calendar, and relevant high-quality articles.
- Preserve calculation defaults, saved birth-profile reuse, house-system choices, and generated chart styling.

### 4. Natal chart mobile repair

- Preserve desktop rendering at widths of 1024 pixels and above.
- At widths below 768 pixels, make the page header, birth form, result summary, wheel, aspect matrix, and interpretation tables follow a single-column reading order.
- Prevent the whole document from acquiring horizontal overflow.
- Allow an individual dense table or aspect matrix to scroll inside its own labelled container when shrinking it would make symbols unreadable.
- Keep the chart wheel centered and legible. It may scale to the available width but must retain its aspect ratio.
- Keep all existing calculations, symbols, degrees, houses, aspects, Firdaria data, and menu actions unchanged.

### 5. Analytics events

- Add one browser-only analytics helper that safely no-ops when `gtag` is unavailable.
- Emit `birth_form_start` once per page interaction, with `chart_type` only.
- Emit `chart_generated` after a successful natal or Solar Return calculation, with `chart_type` and `house_system` only.
- Emit `chart_generation_error` on a failed calculation, with `chart_type` and a non-personal error category.
- Emit `chart_shared` when a chart link or image is successfully copied/downloaded.
- Never send names, dates of birth, times of birth, city text, coordinates, email addresses, or chart placements to Google Analytics.

## Architecture

SEO rules will live in a small server-safe module shared by route metadata, article metadata, and the sitemap route. Route-specific `layout.tsx` files will own metadata for client-rendered calculator pages. The analytics helper will be isolated from chart code and called only at existing form/calculate/share boundaries.

Responsive natal changes will be scoped to page-specific class names or a page stylesheet. They must not modify shared chart geometry or the desktop component calculations.

## Data Flow

1. Google requests a route and receives a route-specific title, description, canonical, robots policy, and language declaration in server-rendered HTML.
2. The sitemap route emits core tools plus approved article URLs using the same quality policy used by article metadata.
3. A user opens a calculator without authentication, enters birth data, and receives the existing calculated chart.
4. Analytics receives only anonymous funnel events and non-personal chart configuration fields.
5. On mobile, the same result data is rendered in a responsive reading order without changing numerical chart output.

## Error Handling

- Missing blog articles continue to return the existing not-found response.
- A malformed article is excluded from the sitemap and receives `noindex, follow` rather than breaking the build.
- Analytics failures never block form submission or chart rendering.
- Calculation errors remain visible in the calculator UI and also emit the non-personal error event.
- If a dense chart table cannot fit the mobile viewport, overflow is contained within that section rather than the document.

## Testing and Verification

Automated checks will cover:

- Core routes produce their own canonical and do not emit false hreflang tags.
- The sitemap includes core calculators and excludes known thin article examples.
- Indexable articles use self-canonicals; excluded articles emit `noindex, follow`.
- The analytics helper sends expected event names and rejects personal payload fields by API design.
- Production build succeeds.

Browser verification will cover:

- `/natal` before and after chart generation at 390x844, 430x932, and desktop width.
- `/solar-return` form submission and generated result at mobile and desktop widths.
- No whole-page horizontal overflow on mobile.
- Existing desktop natal chart layout remains visually unchanged.
- Live HTML contains the expected canonical, language, robots, title, and structured data after deployment.

Search Console follow-up will occur after deployment:

- Resubmit the sitemap.
- Request validation for the corrected indexing issue only after live HTML is verified.
- Compare indexed pages, impressions, CTR, and clicks after Google recrawls the site.

## Explicit Non-Goals

- No changes to astrology, house, planetary, BaZi, Firdaria, return-chart, or aspect calculations.
- No redesign of the desktop natal chart.
- No deletion of the existing blog archive in this phase.
- No claim that client-side language switching is full international SEO.
- No paid AI reading, account, community, or navigation redesign in this phase.
- No homepage acquisition redesign in this phase; it will follow after search foundations and mobile chart usability are stable.

## Acceptance Criteria

- Every core indexable route has a correct self-canonical in rendered HTML.
- No page emits multiple hreflang entries that point to the same URL.
- The sitemap contains the principal calculators and excludes known thin templates such as `moon-in-sagittarius-73`.
- Excluded blog templates emit `noindex, follow`.
- `/solar-return` clearly presents a free, no-sign-up calculator and retains working chart generation.
- `/natal` is usable at 390-pixel width without document-level horizontal overflow.
- Desktop natal layout and calculated output remain unchanged.
- Successful natal and Solar Return calculations emit `chart_generated` without transmitting personal birth data.
- `npm run build` passes and the deployed pages are verified in a real browser.
