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

// 2026-10 策略放宽：合法 slug 一律可索引（含短文），仅 cornerstone 例外
assert.equal(isIndexableArticle(articleBySlug("moon-in-sagittarius-73")), true);
assert.equal(isIndexableArticle(articleBySlug("how-to-read-bazi-chart-beginner-265")), true);
assert.equal(isIndexableArticle(articleBySlug("best-free-bazi-calculators-2026")), true);
assert.equal(isIndexableArticle(articleBySlug("baZi-vs-western-astrology")), true);

const cornerstoneWithRejectedPhrase = {
  slug: "what-does-my-birth-chart-mean",
  sections: `every ending b ${"x".repeat(1000)}`,
};
assert.equal(isIndexableArticle(cornerstoneWithRejectedPhrase), true);

const bodyWithEmptyHeadings = `${"x".repeat(600)}\n## \n${"y".repeat(600)}\n## \n${"z".repeat(100)}`;
// 2026-10 策略放宽：空标题不再一票否决（合法 slug 即可索引）
assert.equal(isIndexableArticle({ slug: "empty-heading-article", sections: bodyWithEmptyHeadings }), true);

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
assert.equal(indexableArticles.length, articles.length);

const { default: sitemap } = await import("../src/app/sitemap.ts");
const sitemapEntries = sitemap();
const { coreRoutes } = await import("../src/app/sitemap.ts");
const { siteUrl } = await import("../src/lib/seoMetadata.ts");
const coreUrls = coreRoutes.map((route) => siteUrl(route));

assert.ok(sitemapEntries.length >= 1000, `sitemap should include all articles, got ${sitemapEntries.length}`);
// 每个核心路由都必须在 sitemap 里
for (const url of coreUrls) {
  assert.ok(sitemapEntries.some((entry) => entry.url === url), `sitemap missing core route: ${url}`);
}
assert.equal(new Set(sitemapEntries.map((entry) => entry.url)).size, sitemapEntries.length, "sitemap URLs must be unique");
assert.ok(
  sitemapEntries.filter((entry) => coreUrls.includes(entry.url)).every((entry) => !Object.hasOwn(entry, "lastModified")),
  "core route entries must not carry lastModified",
);

const sitemapEntryByUrl = (url) => sitemapEntries.find((entry) => entry.url === url);
// 2026-10 策略放宽后该文章可索引，应出现在 sitemap
assert.ok(sitemapEntryByUrl("https://lunaxstar.com/blog/moon-in-sagittarius-73"));
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

// 2026-10 策略放宽后 moon-in-sagittarius-73 已可索引；
// 不可索引的只剩无效输入（如文章缺失），robots 应降级为 noindex
const missingMetadata = createBlogArticleMetadata(undefined, "missing-article");
assert.deepEqual(missingMetadata.robots, { index: false, follow: true });
assert.equal(missingMetadata.alternates?.canonical, "https://lunaxstar.com/blog/missing-article");
assert.equal(missingMetadata.openGraph?.url, "https://lunaxstar.com/blog/missing-article");
assert.equal(missingMetadata.alternates?.languages, undefined);

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
