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
