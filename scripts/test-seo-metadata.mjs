import assert from "node:assert/strict";
import fs from "node:fs";
import {
  baziMetadata,
  blogMetadata,
  compatibilityMetadata,
  homeMetadata,
  natalMetadata,
  siteUrl,
  solarReturnMetadata,
  tarotMetadata,
  transitsMetadata,
} from "../src/lib/seoMetadata.ts";

for (const path of ["natal", "/natal", "/natal/", "/natal?x=1#y"]) {
  assert.equal(siteUrl(path), "https://lunaxstar.com/natal");
}

assert.equal(siteUrl("/"), "https://lunaxstar.com");
assert.equal(siteUrl(""), "https://lunaxstar.com");
assert.equal(siteUrl("/blog/guides/natal"), "https://lunaxstar.com/blog/guides/natal");
assert.throws(() => siteUrl("//example.com/natal"), TypeError);
assert.throws(() => siteUrl("https://example.com/natal"), TypeError);

const routeMetadata = [
  ["/", "Find Your Soulmate Window & Money Pattern | Free Birth Chart", homeMetadata, "src/app/page.tsx", "homeMetadata"],
  ["/natal", "Free Birth Chart: Discover Your Soulmate Pattern & Life Path", natalMetadata, "src/app/natal/layout.tsx", "natalMetadata"],
  ["/solar-return", "Free Solar Return Chart Calculator (2026) - No Sign Up", solarReturnMetadata, "src/app/solar-return/layout.tsx", "solarReturnMetadata"],
  ["/bazi", "Free BaZi Calculator: Find Your Money Style & Career Path", baziMetadata, "src/app/bazi/layout.tsx", "baziMetadata"],
  ["/transits", "Astrology Calendar - Moon Phases, Retrogrades & Transits", transitsMetadata, "src/app/transits/layout.tsx", "transitsMetadata"],
  ["/tarot", "Free Tarot Reading: What's Coming Next In Your Love & Career", tarotMetadata, "src/app/tarot/layout.tsx", "tarotMetadata"],
  ["/compatibility", "Free Compatibility Test: Are You With The Right Person?", compatibilityMetadata, "src/app/compatibility/layout.tsx", "compatibilityMetadata"],
  ["/blog", "Astrology Guides - Birth Charts, BaZi & Timing Techniques", blogMetadata, "src/app/blog/layout.tsx", "blogMetadata"],
];

for (const [path, title, metadata, routeFile, exportName] of routeMetadata) {
  const canonical = siteUrl(path);
  assert.equal(metadata.title, title);
  assert.equal(metadata.alternates?.canonical, canonical);
  assert.equal(metadata.openGraph?.url, canonical);
  assert.equal(metadata.alternates?.languages, undefined);

  const routeSource = fs.readFileSync(routeFile, "utf8");
  assert.match(routeSource, new RegExp(`export const metadata = ${exportName};`));
}

const rootLayout = fs.readFileSync("src/app/layout.tsx", "utf8");
assert.doesNotMatch(rootLayout, /languages:\s*\{/);
assert.doesNotMatch(rootLayout, /hreflang/i);
assert.match(rootLayout, /<html lang="en"/);

console.log("SEO metadata tests passed");
