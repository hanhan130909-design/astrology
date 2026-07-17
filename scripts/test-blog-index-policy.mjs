import assert from "node:assert/strict";
import fs from "node:fs";
import { destinyArticles } from "../src/content/destiny-blog-articles.ts";
import { moreSeoArticles } from "../src/app/blog/more-seo-articles.ts";
import { seoArticles } from "../src/app/blog/seo-articles.ts";
import { isIndexableArticle } from "../src/lib/blogIndexPolicy.ts";

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

const indexableArticles = articles.filter(isIndexableArticle);
assert.ok(indexableArticles.length > 20, `expected more than 20 indexable articles, got ${indexableArticles.length}`);
assert.ok(indexableArticles.length < 90, `expected fewer than 90 indexable articles, got ${indexableArticles.length}`);

const sitemapSource = fs.readFileSync("src/app/sitemap.ts", "utf8");
assert.match(sitemapSource, /["']\/natal["']/);
assert.match(sitemapSource, /["']\/solar-return["']/);
assert.match(sitemapSource, /\.filter\(isIndexableArticle\)/);

console.log(`Blog index policy tests passed (${indexableArticles.length} indexable articles)`);
