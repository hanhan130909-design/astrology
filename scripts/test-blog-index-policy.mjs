import assert from "node:assert/strict";
import fs from "node:fs";
import { registerHooks } from "node:module";
import { destinyArticles } from "../src/content/destiny-blog-articles.ts";
import { moreSeoArticles } from "../src/app/blog/more-seo-articles.ts";
import { seoArticles } from "../src/app/blog/seo-articles.ts";
import { isIndexableArticle } from "../src/lib/blogIndexPolicy.ts";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (!specifier.startsWith("@/")) return nextResolve(specifier, context);

    const sourceUrl = new URL(`../src/${specifier.slice(2)}.ts`, import.meta.url);
    return nextResolve(sourceUrl.href, context);
  },
});

const articles = [...destinyArticles, ...seoArticles, ...moreSeoArticles];
const articleBySlug = (slug) => articles.find((article) => article.slug === slug);

assert.equal(isIndexableArticle(articleBySlug("moon-in-sagittarius-73")), false);
assert.equal(isIndexableArticle(articleBySlug("how-to-read-bazi-chart-beginner-265")), true);
assert.equal(isIndexableArticle(articleBySlug("best-free-bazi-calculators-2026")), true);
assert.equal(isIndexableArticle(articleBySlug("baZi-vs-western-astrology")), true);

const cornerstoneWithRejectedPhrase = {
  slug: "what-does-my-birth-chart-mean",
  sections: `every ending b ${"x".repeat(1000)}`,
};
assert.equal(isIndexableArticle(cornerstoneWithRejectedPhrase), true);

const bodyWithEmptyHeadings = `${"x".repeat(600)}\n## \n${"y".repeat(600)}\n## \n${"z".repeat(100)}`;
assert.equal(isIndexableArticle({ slug: "empty-heading-article", sections: bodyWithEmptyHeadings }), false);

const validStructuredBody = `${"x".repeat(600)}\n## First heading\n${"y".repeat(600)}\n## Second heading`;
assert.equal(isIndexableArticle({ slug: " bad-slug ", sections: validStructuredBody }), false);
assert.equal(isIndexableArticle({ slug: "bad/slug", sections: validStructuredBody }), false);
assert.equal(isIndexableArticle({ slug: "bad?slug", sections: validStructuredBody }), false);
assert.equal(isIndexableArticle({ slug: "bad#slug", sections: validStructuredBody }), false);
assert.equal(isIndexableArticle({ slug: "bad--slug", sections: validStructuredBody }), false);
assert.equal(isIndexableArticle({ slug: "-bad-slug", sections: validStructuredBody }), false);
assert.equal(isIndexableArticle({ slug: "bad-slug-", sections: validStructuredBody }), false);
assert.equal(isIndexableArticle({ slug: "valid-article-2026", sections: validStructuredBody }), true);
assert.equal(
  isIndexableArticle({ slug: "valid-article-invalid-date", sections: validStructuredBody, date: "not-a-date" }),
  true,
);

const indexableArticles = articles.filter(isIndexableArticle);
assert.equal(indexableArticles.length, 77);

const { default: sitemap } = await import("../src/app/sitemap.ts");
const sitemapEntries = sitemap();
const expectedCoreUrls = [
  "https://lunaxstar.com",
  "https://lunaxstar.com/natal",
  "https://lunaxstar.com/solar-return",
  "https://lunaxstar.com/bazi",
  "https://lunaxstar.com/transits",
  "https://lunaxstar.com/tarot",
  "https://lunaxstar.com/compatibility",
  "https://lunaxstar.com/blog",
];

assert.equal(sitemapEntries.length, 85);
assert.deepEqual(sitemapEntries.slice(0, 8).map((entry) => entry.url), expectedCoreUrls);
assert.ok(sitemapEntries.slice(8).every((entry) => entry.url.startsWith("https://lunaxstar.com/blog/")));
assert.equal(new Set(sitemapEntries.map((entry) => entry.url)).size, sitemapEntries.length);
assert.ok(sitemapEntries.slice(0, 8).every((entry) => !Object.hasOwn(entry, "lastModified")));

const sitemapEntryByUrl = (url) => sitemapEntries.find((entry) => entry.url === url);
assert.equal(sitemapEntryByUrl("https://lunaxstar.com/blog/moon-in-sagittarius-73"), undefined);
assert.ok(sitemapEntryByUrl("https://lunaxstar.com/blog/how-to-read-bazi-chart-beginner-265"));
const datedEntry = sitemapEntryByUrl("https://lunaxstar.com/blog/best-free-bazi-calculators-2026");
assert.ok(datedEntry);
assert.equal(datedEntry.lastModified, "2026-06-19");
const undatedEntry = sitemapEntryByUrl("https://lunaxstar.com/blog/baZi-vs-western-astrology");
assert.ok(undatedEntry);
assert.ok(!Object.hasOwn(undatedEntry, "lastModified"));

const {
  createArticleSitemapEntry,
  deduplicateArticlesBySlug,
} = await import("../src/lib/blogSitemap.ts");

const firstDuplicate = { slug: "duplicate-article", marker: "first" };
const secondDuplicate = { slug: "duplicate-article", marker: "second" };
const uniqueArticle = { slug: "unique-article", marker: "unique" };
assert.deepEqual(
  deduplicateArticlesBySlug([firstDuplicate, secondDuplicate, uniqueArticle]),
  [firstDuplicate, uniqueArticle],
);

const invalidDateEntry = createArticleSitemapEntry({ slug: "invalid-date", date: "2026-02-30" });
assert.ok(!Object.hasOwn(invalidDateEntry, "lastModified"));
assert.equal(
  createArticleSitemapEntry({ slug: "valid-date", date: "2024-02-29" }).lastModified,
  "2024-02-29",
);

const {
  createBlogArticleMetadata,
  selectContextualCornerstone,
  selectCornerstoneLink,
} = await import("../src/lib/blogArticleSeo.ts");

const excludedSlug = "moon-in-sagittarius-73";
const excludedMetadata = createBlogArticleMetadata(articleBySlug(excludedSlug), excludedSlug);
assert.deepEqual(excludedMetadata.robots, { index: false, follow: true });
assert.equal(excludedMetadata.alternates?.canonical, `https://lunaxstar.com/blog/${excludedSlug}`);
assert.equal(excludedMetadata.openGraph?.url, `https://lunaxstar.com/blog/${excludedSlug}`);
assert.equal(excludedMetadata.alternates?.languages, undefined);

const includedSlug = "how-to-read-bazi-chart-beginner-265";
const includedMetadata = createBlogArticleMetadata(articleBySlug(includedSlug), includedSlug);
assert.deepEqual(includedMetadata.robots, { index: true, follow: true });
assert.equal(includedMetadata.alternates?.canonical, `https://lunaxstar.com/blog/${includedSlug}`);
assert.equal(includedMetadata.openGraph?.url, `https://lunaxstar.com/blog/${includedSlug}`);

assert.equal(
  selectContextualCornerstone({ slug: "example-bazi-guide", title: "BaZi Guide", categoryLabel: "BaZi" }).slug,
  "what-is-chinese-astrology-bazi",
);
const fallbackLink = selectCornerstoneLink(
  "what-does-my-birth-chart-mean",
  [{ slug: "what-does-my-birth-chart-mean", label: "Current article" }],
);
assert.equal(fallbackLink.slug, "bazi-calculator-what-is-day-master");
assert.ok(articleBySlug(fallbackLink.slug));

const sitemapSource = fs.readFileSync("src/app/sitemap.ts", "utf8");
assert.match(sitemapSource, /["']\/natal["']/);
assert.match(sitemapSource, /["']\/solar-return["']/);
assert.match(sitemapSource, /\.filter\(isIndexableArticle\)/);

console.log(`Blog index policy tests passed (${indexableArticles.length} indexable articles)`);
