import assert from "node:assert/strict";
import fs from "node:fs";

const pagePath = "src/app/solar-return/page.tsx";
const layoutPath = "src/app/solar-return/layout.tsx";
const componentPath = "src/components/SolarReturnSeoContent.tsx";
const faqDataPath = "src/components/solarReturnFaq.ts";

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
assert.equal(
  packageJson.scripts?.["test:solar-return-content"],
  "node --experimental-strip-types scripts/test-solar-return-content.mjs",
);

assert.ok(fs.existsSync(componentPath), "SolarReturnSeoContent.tsx must exist");
assert.ok(fs.existsSync(faqDataPath), "shared Solar Return FAQ data must exist");

const pageSource = fs.readFileSync(pagePath, "utf8");
const layoutSource = fs.readFileSync(layoutPath, "utf8");
const componentSource = fs.readFileSync(componentPath, "utf8");
const faqDataSource = fs.readFileSync(faqDataPath, "utf8");
const combinedVisibleSource = `${pageSource}\n${componentSource}`;

assert.match(
  combinedVisibleSource,
  /<h1[^>]*>\s*Free Solar Return Chart Calculator\s*<\/h1>/,
);
assert.match(
  combinedVisibleSource,
  /Calculate your yearly astrology chart for free\. No signup required\./,
);
assert.equal((combinedVisibleSource.match(/<h1\b/g) || []).length, 1);

const faqDataUrl = `data:text/javascript;base64,${Buffer.from(faqDataSource).toString("base64")}`;
const { solarReturnFaqs } = await import(faqDataUrl);
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
for (const question of expectedQuestions) {
  assert.equal((faqDataSource.match(new RegExp(question.replace(/[?]/g, "\\?"), "g")) || []).length, 1);
  assert.doesNotMatch(layoutSource, new RegExp(question.replace(/[?]/g, "\\?")));
  assert.doesNotMatch(componentSource, new RegExp(question.replace(/[?]/g, "\\?")));
}
assert.match(componentSource, /solarReturnFaqs\.map\(/);
assert.match(componentSource, /\{faq\.question\}/);
assert.match(componentSource, /\{faq\.answer\}/);

assert.match(layoutSource, /import\s+\{\s*solarReturnFaqs\s*\}.*solarReturnFaq/);
assert.match(layoutSource, /["']@type["']:\s*["']FAQPage["']/);
assert.match(layoutSource, /mainEntity:\s*solarReturnFaqs\.map\(/);
assert.ok(
  layoutSource.includes('.replace(/</g, "\\\\u003c")'),
  "inline JSON-LD must escape less-than characters",
);

for (const href of [
  "/natal",
  "/transits",
  "/blog/lunar-return-monthly-guide-430",
]) {
  assert.match(componentSource, new RegExp(`href=["']${href}["']`));
}

for (const preservedToken of [
  "calculateSolarReturn",
  "'/api/chart/transit'",
  "ClassicReturnChart",
  "loadLatestBirthProfile",
]) {
  assert.ok(pageSource.includes(preservedToken), `${preservedToken} must remain in page.tsx`);
}

console.log(`Solar Return content tests passed (${solarReturnFaqs.length} FAQ items)`);
