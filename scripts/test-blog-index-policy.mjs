import assert from "node:assert/strict";
import fs from "node:fs";
import { registerHooks } from "node:module";
import { destinyArticles } from "../src/content/destiny-blog-articles.ts";
import { moreSeoArticles } from "../src/app/blog/more-seo-articles.ts";
import { seoArticles } from "../src/app/blog/seo-articles.ts";
import { isIndexableArticle } from "../src/lib/blogIndexPolicy.ts";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (!specifier.startsWith("@/") || specifier.endsWith(".json"))
      return nextResolve(specifier, context);

    const sourceUrl = new URL(`../src/${specifier.slice(2)}.ts`, import.meta.url);
    return nextResolve(sourceUrl.href, context);
  },
});

// 构造真实词数的正文（连续字母只算 1 词，必须用空格分词）
const wordBody = (n) => Array.from({ length: n }, (_, i) => `word${i}`).join(" ");

const articles = [...destinyArticles, ...seoArticles, ...moreSeoArticles];
const articleBySlug = (slug) => articles.find((article) => article.slug === slug);

// 2026-11 策略收紧：薄内容（<450 词）不进索引，仅 cornerstone 例外
// moon-in-sagittarius-73 仅 54 词 —— 应被判定为薄内容
assert.equal(isIndexableArticle(articleBySlug("moon-in-sagittarius-73")), false);
// 1058 词长文 —— 可索引
assert.equal(isIndexableArticle(articleBySlug("how-to-read-bazi-chart-beginner-265")), true);
// cornerstone 白名单（180 词但正文 ≥500 字符）—— 放行
assert.equal(isIndexableArticle(articleBySlug("best-free-bazi-calculators-2026")), true);
// 617 词 —— 可索引
assert.equal(isIndexableArticle(articleBySlug("baZi-vs-western-astrology")), true);
// 450 词阈值边界
assert.equal(isIndexableArticle({ slug: "boundary-below", sections: wordBody(449) }), false);
assert.equal(isIndexableArticle({ slug: "boundary-above", sections: wordBody(450) }), true);

const cornerstoneWithRejectedPhrase = {
  slug: "what-does-my-birth-chart-mean",
  sections: `every ending b ${"x".repeat(1000)}`,
};
assert.equal(isIndexableArticle(cornerstoneWithRejectedPhrase), true);

const bodyWithEmptyHeadings = `${wordBody(460)}\n## \n${wordBody(60)}`;
// 空标题不构成否决项；是否索引只看词数
assert.equal(isIndexableArticle({ slug: "empty-heading-article", sections: bodyWithEmptyHeadings }), true);

const validStructuredBody = `${wordBody(300)}\n## First heading\n${wordBody(200)}\n## Second heading`;
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
// 薄内容收敛：索引池应是文章集的真子集，且 cornerstone 必须在池内
assert.ok(indexableArticles.length < articles.length, "thin content must be excluded from index");
assert.ok(indexableArticles.length > 20, `index pool too small: ${indexableArticles.length}`);
assert.ok(indexableArticles.some((a) => a.slug === "what-does-my-birth-chart-mean"), "cornerstone must stay indexable");
assert.ok(!indexableArticles.some((a) => a.slug === "moon-in-sagittarius-73"), "thin article must be pruned");

const { default: sitemap } = await import("../src/app/sitemap.ts");
const sitemapEntries = sitemap();
const { coreRoutes } = await import("../src/app/sitemap.ts");
const { siteUrl } = await import("../src/lib/seoMetadata.ts");
const coreUrls = coreRoutes.map((route) => siteUrl(route));

assert.ok(sitemapEntries.length >= 100, `sitemap should include core routes + indexable articles, got ${sitemapEntries.length}`);
assert.ok(sitemapEntries.length < 400, `sitemap must not contain thin articles, got ${sitemapEntries.length}`);
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
// 薄内容不进 sitemap；长文必须在
assert.ok(!sitemapEntryByUrl("https://lunaxstar.com/blog/moon-in-sagittarius-73"), "thin article must not be in sitemap");
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
