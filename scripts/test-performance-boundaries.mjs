import assert from "node:assert/strict";
import fs from "node:fs";
import { registerHooks } from "node:module";
import { toBlogSummary } from "../src/app/blog/blogSummary.ts";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "server-only") {
      return { url: "data:text/javascript,export%20{}", shortCircuit: true };
    }
    if (specifier.startsWith("@/")) {
      const sourceUrl = new URL(`../src/${specifier.slice(2)}.ts`, import.meta.url);
      return nextResolve(sourceUrl.href, context);
    }
    if (/^\.{1,2}\//.test(specifier) && !/\.[a-z0-9]+$/i.test(specifier)) {
      return nextResolve(new URL(`${specifier}.ts`, context.parentURL).href, context);
    }
    return nextResolve(specifier, context);
  },
});

const representativeArticle = {
  id: "boundary-check",
  slug: "boundary-check",
  category: "guide",
  categoryZh: "指南",
  categoryEn: "Guide",
  categoryId: "Panduan",
  title: { en: "Boundary Check" },
  excerpt: { en: "Only index-visible data crosses the client boundary." },
  content: { en: "This full body must remain on the server." },
  author: "Lunaxstar Team",
  authorEn: "Lunaxstar Team",
  authorId: "Tim Lunaxstar",
  date: "2026-07-17",
  readTime: 3,
  tags: ["performance"],
};

const summary = toBlogSummary(representativeArticle);
assert.equal(Object.hasOwn(summary, "content"), false);
assert.equal(summary.slug, representativeArticle.slug);
assert.deepEqual(summary.title, representativeArticle.title);

const blogClientSource = fs.readFileSync("src/app/blog/BlogIndexClient.tsx", "utf8");
assert.doesNotMatch(
  blogClientSource,
  /(?:seo-articles|more-seo-articles|destiny-blog-articles)/,
  "BlogIndexClient must not import full article sources",
);
assert.doesNotMatch(
  blogClientSource,
  /\.content\b/,
  "BlogIndexClient must not access article bodies",
);

const blogDataSource = fs.readFileSync("src/app/blog/blogIndexData.ts", "utf8");
assert.match(
  blogDataSource,
  /^import ["']server-only["'];/m,
  "blogIndexData must be server-only",
);

const blogPageSource = fs.readFileSync("src/app/blog/page.tsx", "utf8");
assert.match(blogPageSource, /getBlogSummaries\(\)/);
assert.match(blogPageSource, /<BlogIndexClient\s+articles=\{articles\}\s*\/>/);

const { getBlogSummaries } = await import("../src/app/blog/blogIndexData.ts");
const { seoArticles } = await import("../src/app/blog/seo-articles.ts");
const { moreSeoArticles } = await import("../src/app/blog/more-seo-articles.ts");
const { destinyArticles } = await import("../src/content/destiny-blog-articles.ts");
const summaries = getBlogSummaries();
const legacySlugs = [
  "birth-chart-tutorial",
  "transit-chart-guide",
  "composite-chart-analysis",
  "zodiac-personality-analysis",
  "ai-astrology-advantages",
  "2026-horoscope-predictions",
];
const expectedSlugs = [
  ...seoArticles.map((article) => article.slug),
  ...moreSeoArticles.map((article) => article.slug),
  ...destinyArticles.map((article) => article.slug),
  ...legacySlugs,
];

assert.deepEqual(summaries.map((article) => article.slug), expectedSlugs);
assert.ok(summaries.every((article) => !Object.hasOwn(article, "content")));

console.log(`Performance boundary tests passed (${summaries.length} body-free blog summaries)`);
