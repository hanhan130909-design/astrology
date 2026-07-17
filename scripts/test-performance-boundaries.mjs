import assert from "node:assert/strict";
import fs from "node:fs";
import { registerHooks } from "node:module";
import path from "node:path";
import ts from "typescript";
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

const sourceRoot = path.resolve("src");

function resolveLocalModule(specifier, importerPath) {
  let basePath;
  if (specifier.startsWith("@/")) {
    basePath = path.join(sourceRoot, specifier.slice(2));
  } else if (specifier.startsWith("./") || specifier.startsWith("../")) {
    basePath = path.resolve(path.dirname(importerPath), specifier);
  } else {
    return null;
  }

  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    path.join(basePath, "index.ts"),
    path.join(basePath, "index.tsx"),
  ];
  const resolvedPath = candidates.find((candidate) => (
    fs.existsSync(candidate) && fs.statSync(candidate).isFile()
  ));
  assert.ok(resolvedPath, `Unable to resolve local module ${specifier} from ${importerPath}`);
  return fs.realpathSync(resolvedPath);
}

function getStaticModuleSpecifiers(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const sourceFile = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    filePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );

  return sourceFile.statements.flatMap((statement) => {
    if (
      (ts.isImportDeclaration(statement) || ts.isExportDeclaration(statement))
      && statement.moduleSpecifier
      && ts.isStringLiteralLike(statement.moduleSpecifier)
    ) {
      return [statement.moduleSpecifier.text];
    }
    return [];
  });
}

function walkLocalStaticModuleGraph(entryPath) {
  const pending = [fs.realpathSync(entryPath)];
  const visited = new Set();

  while (pending.length > 0) {
    const filePath = pending.pop();
    if (visited.has(filePath)) continue;
    visited.add(filePath);

    for (const specifier of getStaticModuleSpecifiers(filePath)) {
      const dependencyPath = resolveLocalModule(specifier, filePath);
      if (dependencyPath && !visited.has(dependencyPath)) pending.push(dependencyPath);
    }
  }

  return visited;
}

const blogClientPath = path.resolve("src/app/blog/BlogIndexClient.tsx");
const blogClientSource = fs.readFileSync(blogClientPath, "utf8");
const blogClientGraph = walkLocalStaticModuleGraph(blogClientPath);
const forbiddenArticleSources = [
  "src/app/blog/seo-articles.ts",
  "src/app/blog/more-seo-articles.ts",
  "src/content/destiny-blog-articles.ts",
].map((filePath) => fs.realpathSync(path.resolve(filePath)));

for (const forbiddenSource of forbiddenArticleSources) {
  assert.equal(
    blogClientGraph.has(forbiddenSource),
    false,
    `${forbiddenSource} must not be reachable from BlogIndexClient`,
  );
}
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

const stringFields = [
  "id",
  "slug",
  "category",
  "categoryZh",
  "categoryEn",
  "categoryId",
  "author",
  "authorEn",
  "authorId",
  "date",
];
const isStringRecord = (value) => (
  value !== null
  && typeof value === "object"
  && !Array.isArray(value)
  && Object.values(value).every((entry) => typeof entry === "string")
);

for (const article of summaries) {
  for (const field of stringFields) {
    assert.equal(typeof article[field], "string", `${article.slug}.${field} must be a string`);
  }
  assert.ok(isStringRecord(article.title), `${article.slug}.title must be a string record`);
  assert.ok(isStringRecord(article.excerpt), `${article.slug}.excerpt must be a string record`);
  assert.ok(
    Number.isFinite(article.readTime) && article.readTime > 0,
    `${article.slug}.readTime must be a positive finite number`,
  );
  assert.ok(
    Array.isArray(article.tags) && article.tags.every((tag) => typeof tag === "string"),
    `${article.slug}.tags must be a string array`,
  );
}

const articleWithMissingSourceMetadata = summaries.find(
  (article) => article.slug === "best-free-bazi-calculators-2026",
);
assert.equal(articleWithMissingSourceMetadata.author, "星缘团队");
assert.equal(articleWithMissingSourceMetadata.authorEn, "Lunaxstar Team");
assert.equal(articleWithMissingSourceMetadata.authorId, "Tim Lunaxstar");
assert.equal(
  summaries.find((article) => article.slug === "aries-leo-compatibility-41").date,
  "",
);

console.log(`Performance boundary tests passed (${summaries.length} body-free blog summaries)`);
