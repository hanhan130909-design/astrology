import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";
import {
  natalFaqs,
  serializeNatalFaqJsonLd,
} from "../src/components/natalFaq.ts";

const componentPath = "src/components/NatalSeoContent.tsx";
const layoutPath = "src/app/natal/layout.tsx";

assert.equal(natalFaqs.length, 7, "natalFaqs must contain exactly seven entries");

const questions = natalFaqs.map(({ question }) => question);
assert.equal(new Set(questions).size, natalFaqs.length, "FAQ questions must be unique");

for (const faq of natalFaqs) {
  assert.ok(faq.question.trim(), "FAQ questions must be nonempty");
  assert.ok(
    faq.answer.trim().split(/\s+/).length >= 18,
    `FAQ answer must be substantive: ${faq.question}`,
  );
}

const serializedFaq = serializeNatalFaqJsonLd(natalFaqs);
assert.doesNotMatch(serializedFaq, /</, "serialized FAQ JSON-LD must escape '<'");

const faqSchema = JSON.parse(serializedFaq);
assert.equal(faqSchema["@context"], "https://schema.org");
assert.equal(faqSchema["@type"], "FAQPage");
assert.deepEqual(
  faqSchema.mainEntity.map((entity) => ({
    question: entity.name,
    answer: entity.acceptedAnswer.text,
  })),
  natalFaqs.map(({ question, answer }) => ({ question, answer })),
  "FAQ schema questions and answers must exactly match visible FAQ data",
);

const syntheticFaqs = [
  { question: "Can </script> appear?", answer: "A value with <markup> stays safe." },
];
const syntheticJson = serializeNatalFaqJsonLd(syntheticFaqs);
assert.doesNotMatch(syntheticJson, /</);
assert.deepEqual(
  JSON.parse(syntheticJson).mainEntity.map((entity) => ({
    question: entity.name,
    answer: entity.acceptedAnswer.text,
  })),
  syntheticFaqs,
);

assert.ok(fs.existsSync(componentPath), "NatalSeoContent.tsx must exist");
const componentSource = fs.readFileSync(componentPath, "utf8");
const componentAst = ts.createSourceFile(
  componentPath,
  componentSource,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX,
);

const hasUseClientDirective = componentAst.statements.some((statement) => (
  ts.isExpressionStatement(statement)
  && ts.isStringLiteral(statement.expression)
  && statement.expression.text === "use client"
));
assert.equal(hasUseClientDirective, false, "NatalSeoContent must remain a server component");

function getJsxTagName(element) {
  return element.openingElement.tagName.getText(componentAst);
}

function getJsxText(element) {
  const parts = [];
  const visit = (node) => {
    if (ts.isJsxText(node)) {
      parts.push(node.text);
      return;
    }
    if (
      ts.isJsxExpression(node)
      && node.expression
      && ts.isStringLiteralLike(node.expression)
    ) {
      parts.push(node.expression.text);
      return;
    }
    ts.forEachChild(node, visit);
  };
  element.children.forEach(visit);
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

function findJsxElements(root, tagName) {
  const elements = [];
  const visit = (node) => {
    if (ts.isJsxElement(node) && getJsxTagName(node) === tagName) {
      elements.push(node);
    }
    ts.forEachChild(node, visit);
  };
  visit(root);
  return elements;
}

const headings = [];
const collectHeadings = (node) => {
  if (ts.isJsxElement(node)) {
    const tagName = getJsxTagName(node);
    if (/^h[1-6]$/.test(tagName)) {
      headings.push({ level: tagName, text: getJsxText(node) });
    }
  }
  ts.forEachChild(node, collectHeadings);
};
collectHeadings(componentAst);

assert.deepEqual(
  headings,
  [
    { level: "h1", text: "How to read your natal chart" },
    { level: "h2", text: "The four chart layers" },
    { level: "h2", text: "A practical reading order" },
    { level: "h2", text: "Birth time accuracy" },
    { level: "h2", text: "Related tools and guides" },
    { level: "h2", text: "Natal chart FAQ" },
  ],
  "Natal guide must have one h1 followed by coherent h2 sections",
);
assert.equal(headings.filter(({ level }) => level === "h1").length, 1);

function unwrapExpression(expression) {
  let current = expression;
  while (
    ts.isAsExpression(current)
    || ts.isParenthesizedExpression(current)
    || ts.isSatisfiesExpression(current)
    || ts.isTypeAssertionExpression(current)
  ) {
    current = current.expression;
  }
  return current;
}

function findVariableInitializer(name) {
  for (const statement of componentAst.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === name) {
        return declaration.initializer;
      }
    }
  }
  return undefined;
}

function readStringObject(objectLiteral) {
  return Object.fromEntries(objectLiteral.properties.map((property) => {
    assert.ok(ts.isPropertyAssignment(property), "relatedTools entries must use properties");
    const propertyName = property.name;
    assert.ok(
      ts.isIdentifier(propertyName) || ts.isStringLiteralLike(propertyName),
      "relatedTools property names must be static",
    );
    assert.ok(ts.isStringLiteralLike(property.initializer), "relatedTools values must be strings");
    return [propertyName.text, property.initializer.text];
  }));
}

const expectedRelatedTools = [
  { href: "/solar-return", label: "Solar Return chart" },
  { href: "/transits", label: "Astrology calendar" },
  { href: "/compatibility", label: "Compatibility chart" },
  { href: "/bazi", label: "BaZi calculator" },
  { href: "/blog/what-does-my-birth-chart-mean", label: "Birth chart reading guide" },
];
const relatedToolsInitializer = findVariableInitializer("relatedTools");
assert.ok(relatedToolsInitializer, "NatalSeoContent must define relatedTools");
const relatedToolsArray = unwrapExpression(relatedToolsInitializer);
assert.ok(ts.isArrayLiteralExpression(relatedToolsArray));
const relatedTools = relatedToolsArray.elements.map((element) => {
  const objectLiteral = unwrapExpression(element);
  assert.ok(ts.isObjectLiteralExpression(objectLiteral));
  return readStringObject(objectLiteral);
});
assert.deepEqual(relatedTools, expectedRelatedTools);
const transitTool = relatedTools.find(({ href }) => href === "/transits");
assert.ok(transitTool, "relatedTools must include the astrology calendar link");
assert.match(transitTool.label, /astrology calendar/i);
assert.doesNotMatch(transitTool.label, /predictor/i);

const definitionTerms = findJsxElements(componentAst, "dt").map(getJsxText);
assert.deepEqual(definitionTerms, ["Planets", "Signs", "Houses", "Aspects"]);

const faqMapCalls = [];
const collectFaqMapCalls = (node) => {
  if (
    ts.isCallExpression(node)
    && ts.isPropertyAccessExpression(node.expression)
    && node.expression.name.text === "map"
    && ts.isIdentifier(node.expression.expression)
    && node.expression.expression.text === "natalFaqs"
  ) {
    faqMapCalls.push(node);
  }
  ts.forEachChild(node, collectFaqMapCalls);
};
collectFaqMapCalls(componentAst);
assert.equal(faqMapCalls.length, 1, "natalFaqs must be rendered by one map call");

const faqMapCallback = faqMapCalls[0].arguments[0];
assert.ok(
  ts.isArrowFunction(faqMapCallback) || ts.isFunctionExpression(faqMapCallback),
  "natalFaqs.map must use a function callback",
);
assert.equal(faqMapCallback.parameters.length, 1);
assert.ok(ts.isIdentifier(faqMapCallback.parameters[0].name));
assert.equal(faqMapCallback.parameters[0].name.text, "faq");

const detailsElements = findJsxElements(faqMapCallback.body, "details");
assert.equal(detailsElements.length, 1, "FAQ map callback must render one details branch");
const summaryElements = findJsxElements(detailsElements[0], "summary");
const answerParagraphs = findJsxElements(detailsElements[0], "p");
assert.equal(summaryElements.length, 1, "FAQ details must contain one summary");
assert.equal(answerParagraphs.length, 1, "FAQ details must contain one answer paragraph");

function hasFaqPropertyAccess(root, propertyName) {
  let found = false;
  const visit = (node) => {
    if (
      ts.isPropertyAccessExpression(node)
      && ts.isIdentifier(node.expression)
      && node.expression.text === "faq"
      && node.name.text === propertyName
    ) {
      found = true;
    }
    ts.forEachChild(node, visit);
  };
  visit(root);
  return found;
}

assert.ok(
  hasFaqPropertyAccess(summaryElements[0], "question"),
  "FAQ summary must render faq.question",
);
assert.ok(
  hasFaqPropertyAccess(answerParagraphs[0], "answer"),
  "FAQ answer paragraph must render faq.answer",
);

const layoutSource = fs.readFileSync(layoutPath, "utf8");
assert.match(layoutSource, /export\s+const\s+metadata\s*=\s*natalMetadata\s*;/);
assert.match(layoutSource, /serializeNatalFaqJsonLd\s*\(\s*natalFaqs\s*\)/);
assert.doesNotMatch(layoutSource, /["']@type["']\s*:\s*["']FAQPage["']/);
assert.equal(
  (layoutSource.match(/serializeNatalFaqJsonLd\s*\(\s*natalFaqs\s*\)/g) || []).length,
  1,
  "layout must render exactly one shared FAQPage schema",
);

const webPageSchemaIndex = layoutSource.indexOf("Free Birth Chart Calculator - Natal Chart Analysis");
const faqSchemaIndex = layoutSource.indexOf("serializeNatalFaqJsonLd(natalFaqs)");
const childrenIndex = layoutSource.indexOf("{children}");
const seoContentIndex = layoutSource.indexOf("<NatalSeoContent />");
assert.ok(webPageSchemaIndex >= 0, "existing WebPage schema must remain");
assert.ok(
  webPageSchemaIndex < faqSchemaIndex
    && faqSchemaIndex < childrenIndex
    && childrenIndex < seoContentIndex,
  "layout order must be WebPage schema, FAQ schema, children, then NatalSeoContent",
);

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
assert.equal(
  packageJson.scripts?.["test:natal-seo-content"],
  "node --experimental-strip-types scripts/test-natal-seo-content.mjs",
);
assert.match(packageJson.scripts?.["test:acquisition"] ?? "", /npm run test:natal-seo-content/);
assert.match(packageJson.scripts?.["test:acquisition"] ?? "", /npm run test:performance-boundaries/);

console.log("Natal SEO content checks passed.");
