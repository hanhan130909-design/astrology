import assert from "node:assert/strict";
import fs from "node:fs";
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
assert.doesNotMatch(componentSource, /^["']use client["'];/m);
assert.match(componentSource, /How to read your natal chart/);
assert.match(componentSource, /A practical reading order/);
assert.match(componentSource, /Birth time accuracy/);
assert.match(componentSource, /Natal chart FAQ/);
assert.match(componentSource, /<details\b/);
assert.match(componentSource, /<summary\b/);
assert.match(componentSource, /natalFaqs\.map\s*\(/);

const relatedHrefValues = [
  "/solar-return",
  "/transits",
  "/compatibility",
  "/bazi",
  "/blog/what-does-my-birth-chart-mean",
];
const relatedToolsMatch = componentSource.match(
  /const\s+relatedTools\s*=\s*\[([\s\S]*?)\]\s*(?:as const)?\s*;/,
);
assert.ok(relatedToolsMatch, "NatalSeoContent must define relatedTools");
const relatedToolsSource = relatedToolsMatch[1];
const sourceHrefValues = [...relatedToolsSource.matchAll(/href:\s*["']([^"']+)["']/g)]
  .map((match) => match[1]);
assert.deepEqual(sourceHrefValues, relatedHrefValues);

const transitTool = relatedToolsSource.match(
  /\{\s*href:\s*["']\/transits["']\s*,\s*label:\s*["']([^"']+)["']\s*\}/,
);
assert.ok(transitTool, "relatedTools must include the astrology calendar link");
assert.match(transitTool[1], /astrology calendar/i);
assert.doesNotMatch(transitTool[1], /predictor/i);

const definitionTerms = [...componentSource.matchAll(/<dt\b[^>]*>([^<]+)<\/dt>/g)]
  .map((match) => match[1].trim());
assert.deepEqual(definitionTerms, ["Planets", "Signs", "Houses", "Aspects"]);

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
