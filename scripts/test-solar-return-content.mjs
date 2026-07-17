import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";

const splitBaselineCommit = "1591ab13dc27c6df92c8e7ecedc1caddebd504bd";
const pagePath = "src/app/solar-return/page.tsx";
const layoutPath = "src/app/solar-return/layout.tsx";
const calculatorPath = "src/components/SolarReturnCalculator.tsx";
const componentPath = "src/components/SolarReturnSeoContent.tsx";
const faqDataPath = "src/components/solarReturnFaq.ts";

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
assert.equal(
  packageJson.scripts?.["test:solar-return-content"],
  "node --experimental-strip-types scripts/test-solar-return-content.mjs",
);

assert.ok(fs.existsSync(calculatorPath), "interactive calculator must be split into a client child");
assert.ok(fs.existsSync(componentPath), "SolarReturnSeoContent.tsx must exist");
assert.ok(fs.existsSync(faqDataPath), "shared Solar Return FAQ data must exist");

const pageSource = fs.readFileSync(pagePath, "utf8");
const layoutSource = fs.readFileSync(layoutPath, "utf8");
const calculatorSource = fs.readFileSync(calculatorPath, "utf8");
const componentSource = fs.readFileSync(componentPath, "utf8");
const faqDataSource = fs.readFileSync(faqDataPath, "utf8");
const combinedVisibleSource = `${pageSource}\n${calculatorSource}\n${componentSource}`;

assert.doesNotMatch(pageSource, /^["']use client["'];/m);
assert.match(pageSource, /<SolarReturnCalculator\s*\/>[\s\S]*<SolarReturnSeoContent\s*\/>/);
assert.match(calculatorSource, /^["']use client["'];/);
assert.doesNotMatch(calculatorSource, /SolarReturnSeoContent|solarReturnFaqs/);
assert.match(componentSource, /solarReturnFaqs\.map\(/);
assert.doesNotMatch(componentSource, /export\s+\{[^}]*solarReturnFaqs/);

assert.match(
  combinedVisibleSource,
  /<h1[^>]*>\s*Free Solar Return Chart Calculator\s*<\/h1>/,
);
assert.match(
  combinedVisibleSource,
  /Calculate your yearly astrology chart for free\. No signup required\./,
);
assert.equal((combinedVisibleSource.match(/<h1\b/g) || []).length, 1);

for (const preservedToken of [
  "calculateSolarReturn",
  "'/api/chart/transit'",
  "ClassicReturnChart",
  "loadLatestBirthProfile",
]) {
  assert.ok(
    calculatorSource.includes(preservedToken),
    `${preservedToken} must remain in SolarReturnCalculator.tsx`,
  );
}

const baselinePageSource = execFileSync(
  "git",
  ["show", `${splitBaselineCommit}:src/app/solar-return/page.tsx`],
  { encoding: "utf8" },
);
const extractCalculateSolarReturn = (source) => {
  const start = source.indexOf("  const calculateSolarReturn =");
  const end = source.indexOf("\n\n  useEffect(", start);
  assert.ok(start >= 0 && end > start, "calculateSolarReturn block must be extractable");
  return source.slice(start, end);
};
assert.equal(
  extractCalculateSolarReturn(calculatorSource),
  extractCalculateSolarReturn(baselinePageSource),
  "calculateSolarReturn and its API payload must remain byte-equivalent to the split baseline",
);

assert.match(faqDataSource, /export type SolarReturnFaq = Readonly<\{/);
assert.match(
  faqDataSource,
  /export const solarReturnFaqs: readonly SolarReturnFaq\[\]/,
);

const { solarReturnFaqs, serializeSolarReturnFaqJsonLd } = await import(
  "../src/components/solarReturnFaq.ts"
);
const expectedQuestions = [
  "What is a Solar Return?",
  "Do I need my exact birth time?",
  "Why does the return location matter?",
];
assert.deepEqual(
  solarReturnFaqs.map((faq) => faq.question),
  expectedQuestions,
);
assert.equal(solarReturnFaqs.length, 3);

const locationFaq = solarReturnFaqs.find(
  (faq) => faq.question === "Why does the return location matter?",
);
assert.ok(locationFaq);
assert.match(locationFaq.answer, /entered birth-location coordinates/);
assert.match(locationFaq.answer, /separate relocated-return location input is not available yet/);
assert.doesNotMatch(locationFaq.answer, /expect to be around your birthday/i);

assert.match(layoutSource, /serializeSolarReturnFaqJsonLd\(solarReturnFaqs\)/);
const syntheticFaqs = [
  { question: "Can </script> appear?", answer: "A value with <markup> stays safe." },
];
const syntheticJson = serializeSolarReturnFaqJsonLd(syntheticFaqs);
assert.doesNotMatch(syntheticJson, /</);
assert.equal(JSON.parse(syntheticJson).mainEntity[0].name, syntheticFaqs[0].question);
assert.equal(
  JSON.parse(syntheticJson).mainEntity[0].acceptedAnswer.text,
  syntheticFaqs[0].answer,
);

const build = spawnSync("npm", ["run", "build"], {
  cwd: process.cwd(),
  encoding: "utf8",
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
  maxBuffer: 20 * 1024 * 1024,
});
assert.equal(
  build.status,
  0,
  `Next build failed while rendering /solar-return:\n${build.stdout}\n${build.stderr}`,
);

const renderedHtmlPath = ".next/server/app/solar-return.html";
assert.ok(fs.existsSync(renderedHtmlPath), "Next build must prerender /solar-return");
const renderedHtml = fs.readFileSync(renderedHtmlPath, "utf8");

const clientManifest = fs.readFileSync(
  ".next/server/app/solar-return/page_client-reference-manifest.js",
  "utf8",
);
assert.match(clientManifest, /SolarReturnCalculator\.tsx/);
assert.doesNotMatch(clientManifest, /SolarReturnSeoContent\.tsx|solarReturnFaq\.ts/);
const routeChunkDir = ".next/static/chunks/app/solar-return";
const routeClientBundle = fs.readdirSync(routeChunkDir)
  .filter((file) => /^page-.*\.js$/.test(file))
  .map((file) => fs.readFileSync(`${routeChunkDir}/${file}`, "utf8"))
  .join("\n");
for (const faq of solarReturnFaqs) {
  assert.ok(!routeClientBundle.includes(faq.question));
  assert.ok(!routeClientBundle.includes(faq.answer));
}

const decodeHtml = (value) => value
  .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
  .replace(/&quot;/g, '"')
  .replace(/&apos;/g, "'")
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">")
  .replace(/&amp;/g, "&");
const visibleText = (fragment) => decodeHtml(fragment.replace(/<[^>]*>/g, " "))
  .replace(/\s+/g, " ")
  .trim();

const renderedH1s = [...renderedHtml.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)];
assert.equal(renderedH1s.length, 1);
assert.equal(visibleText(renderedH1s[0][1]), "Free Solar Return Chart Calculator");
assert.match(
  renderedHtml,
  />\s*Calculate your yearly astrology chart for free\. No signup required\.\s*<\/p>/,
);

const renderedFaqs = [
  ...renderedHtml.matchAll(
    /<article[^>]*data-solar-return-faq-item="true"[^>]*>([\s\S]*?)<\/article>/g,
  ),
].map((match) => {
  const question = match[1].match(/<h3[^>]*>([\s\S]*?)<\/h3>/);
  const answer = match[1].match(/<p[^>]*>([\s\S]*?)<\/p>/);
  assert.ok(question && answer, "each rendered FAQ needs a visible question and answer");
  return { question: visibleText(question[1]), answer: visibleText(answer[1]) };
});
assert.deepEqual(renderedFaqs, solarReturnFaqs);

const jsonLdObjects = [
  ...renderedHtml.matchAll(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
  ),
].map((match) => JSON.parse(match[1]));
const faqPageScripts = jsonLdObjects.filter((value) => value["@type"] === "FAQPage");
assert.equal(faqPageScripts.length, 1);
const structuredFaqs = faqPageScripts[0].mainEntity.map((entity) => ({
  question: entity.name,
  answer: entity.acceptedAnswer.text,
}));
assert.deepEqual(structuredFaqs, renderedFaqs);

for (const href of [
  "/natal",
  "/transits",
  "/blog/lunar-return-monthly-guide-430",
]) {
  assert.match(renderedHtml, new RegExp(`href=["']${href}["']`));
}

const calculatorStart = renderedHtml.indexOf('id="solar-return-calculator"');
const calculatorEnd = renderedHtml.indexOf("</main>", calculatorStart);
const guideStart = renderedHtml.indexOf('id="solar-return-guide"');
assert.ok(calculatorStart >= 0 && calculatorEnd > calculatorStart);
assert.ok(guideStart > calculatorEnd, "SEO guide must render after the calculator and results");

console.log(
  `Solar Return rendered content tests passed (${renderedFaqs.length} FAQ items)`,
);
