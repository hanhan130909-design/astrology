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
  const explicitExtension = path.extname(specifier);
  if (explicitExtension && ![".js", ".jsx", ".ts", ".tsx"].includes(explicitExtension)) {
    return null;
  }

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
    `${basePath}.js`,
    `${basePath}.jsx`,
    path.join(basePath, "index.ts"),
    path.join(basePath, "index.tsx"),
    path.join(basePath, "index.js"),
    path.join(basePath, "index.jsx"),
  ];
  const resolvedPath = candidates.find((candidate) => (
    fs.existsSync(candidate) && fs.statSync(candidate).isFile()
  ));
  assert.ok(resolvedPath, `Unable to resolve local module ${specifier} from ${importerPath}`);
  return fs.realpathSync(resolvedPath);
}

function getStaticModuleSpecifiers(filePath) {
  return getSourceFile(filePath).statements.flatMap((statement) => {
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

function getSourceFile(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const scriptKind = filePath.endsWith(".tsx")
    ? ts.ScriptKind.TSX
    : filePath.endsWith(".jsx")
      ? ts.ScriptKind.JSX
      : filePath.endsWith(".js")
        ? ts.ScriptKind.JS
        : ts.ScriptKind.TS;
  return ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    scriptKind,
  );
}

function getDynamicModuleSpecifiers(filePath) {
  const specifiers = [];
  const visit = (node) => {
    if (
      ts.isCallExpression(node)
      && node.expression.kind === ts.SyntaxKind.ImportKeyword
      && node.arguments.length === 1
      && ts.isStringLiteralLike(node.arguments[0])
    ) {
      specifiers.push(node.arguments[0].text);
    }
    ts.forEachChild(node, visit);
  };
  visit(getSourceFile(filePath));
  return specifiers;
}

function getNamedImports(filePath, moduleSpecifier) {
  return getSourceFile(filePath).statements.flatMap((statement) => {
    if (
      !ts.isImportDeclaration(statement)
      || !ts.isStringLiteralLike(statement.moduleSpecifier)
      || statement.moduleSpecifier.text !== moduleSpecifier
      || !statement.importClause?.namedBindings
      || !ts.isNamedImports(statement.importClause.namedBindings)
    ) return [];

    return statement.importClause.namedBindings.elements.map(
      (element) => element.propertyName?.text ?? element.name.text,
    );
  });
}

function hasIdentifierCall(filePath, identifier) {
  let found = false;
  const visit = (node) => {
    if (
      ts.isCallExpression(node)
      && ts.isIdentifier(node.expression)
      && node.expression.text === identifier
    ) {
      found = true;
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(getSourceFile(filePath));
  return found;
}

function walkProductionSources(directoryPath) {
  return fs.readdirSync(directoryPath, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) return walkProductionSources(entryPath);
    if (!entry.isFile() || !/\.[jt]sx?$/.test(entry.name) || entry.name.endsWith(".d.ts")) return [];
    return [entryPath];
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

const authContextPath = path.resolve("src/contexts/AuthContext.tsx");
const natalPagePath = path.resolve("src/app/natal/page.tsx");
const firebaseLoaderPath = path.resolve("src/lib/loadFirebaseClient.ts");
const firebaseFacadePath = fs.realpathSync(path.resolve("src/lib/firebase.ts"));

for (const consumerPath of [authContextPath, natalPagePath]) {
  const staticSpecifiers = getStaticModuleSpecifiers(consumerPath);
  assert.equal(
    staticSpecifiers.includes("@/lib/loadFirebaseClient"),
    true,
    `${consumerPath} must import loadFirebaseClient`,
  );
  assert.equal(
    hasIdentifierCall(consumerPath, "loadFirebaseClient"),
    true,
    `${consumerPath} must call loadFirebaseClient`,
  );

  const clientGraph = walkLocalStaticModuleGraph(consumerPath);
  assert.equal(
    clientGraph.has(firebaseFacadePath),
    false,
    `${consumerPath} must not statically reach src/lib/firebase.ts`,
  );
  for (const reachablePath of clientGraph) {
    const firebasePackageImports = getStaticModuleSpecifiers(reachablePath).filter(
      (specifier) => specifier === "firebase" || specifier.startsWith("firebase/"),
    );
    assert.deepEqual(
      firebasePackageImports,
      [],
      `${reachablePath} must not statically import Firebase packages from ${consumerPath}`,
    );
  }
}

assert.equal(
  getNamedImports(authContextPath, "@/lib/loadFirebaseClient").includes("subscribeFirebaseClientLoads"),
  true,
  "AuthContext must import the Firebase load subscription",
);
assert.equal(
  hasIdentifierCall(authContextPath, "subscribeFirebaseClientLoads"),
  true,
  "AuthContext must subscribe to newly resolved Firebase clients",
);

assert.equal(
  getStaticModuleSpecifiers(firebaseLoaderPath).includes("@/lib/firebase"),
  false,
  "loadFirebaseClient must not statically import or export @/lib/firebase",
);
assert.equal(
  getDynamicModuleSpecifiers(firebaseLoaderPath).filter(
    (specifier) => specifier === "@/lib/firebase",
  ).length,
  1,
  "loadFirebaseClient must dynamically import @/lib/firebase exactly once",
);
assert.equal(
  hasIdentifierCall(firebaseLoaderPath, "notifyFirebaseClientLoad"),
  true,
  "loadFirebaseClient must notify subscribers after a new import resolves",
);

for (const productionPath of walkProductionSources(sourceRoot)) {
  if (fs.realpathSync(productionPath) === firebaseFacadePath) continue;
  assert.equal(
    getNamedImports(productionPath, "firebase/auth").includes("sendPasswordResetEmail"),
    false,
    `${productionPath} must use the Firebase facade for password reset`,
  );
}

console.log(`Performance boundary tests passed (${summaries.length} body-free blog summaries)`);
