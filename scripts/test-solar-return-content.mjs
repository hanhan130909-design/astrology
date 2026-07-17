import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import fs from "node:fs";
import { createServer } from "node:net";

const pagePath = "src/app/solar-return/page.tsx";
const layoutPath = "src/app/solar-return/layout.tsx";
const calculatorPath = "src/components/SolarReturnCalculator.tsx";
const componentPath = "src/components/SolarReturnSeoContent.tsx";
const faqDataPath = "src/components/solarReturnFaq.ts";
const requestHelperPath = "src/lib/solarReturnRequest.ts";

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
assert.equal(
  packageJson.scripts?.["test:solar-return-content"],
  "node --experimental-strip-types scripts/test-solar-return-content.mjs",
);

assert.ok(fs.existsSync(requestHelperPath), "pure Solar Return request helper must exist");
assert.ok(fs.existsSync(calculatorPath), "interactive calculator must remain a client child");
assert.ok(fs.existsSync(componentPath), "SolarReturnSeoContent.tsx must exist");
assert.ok(fs.existsSync(faqDataPath), "shared Solar Return FAQ data must exist");

const pageSource = fs.readFileSync(pagePath, "utf8");
const layoutSource = fs.readFileSync(layoutPath, "utf8");
const calculatorSource = fs.readFileSync(calculatorPath, "utf8");
const componentSource = fs.readFileSync(componentPath, "utf8");
const faqDataSource = fs.readFileSync(faqDataPath, "utf8");
const combinedVisibleSource = `${pageSource}\n${calculatorSource}\n${componentSource}`;

assert.doesNotMatch(pageSource, /^["']use client["'];/m);
assert.match(
  pageSource,
  /<main\b[^>]*>[\s\S]*<SolarReturnCalculator\s*\/>[\s\S]*<SolarReturnSeoContent\s*\/>[\s\S]*<\/main>/,
);
assert.match(pageSource, /className="bg-white px-6 pb-16"/);
assert.match(calculatorSource, /^["']use client["'];/);
assert.doesNotMatch(calculatorSource, /<main\b|SolarReturnSeoContent|solarReturnFaqs/);
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
assert.match(
  calculatorSource,
  /createSolarReturnRequestPayload\(\s*birthData,\s*returnYearOverride \|\| srYear,\s*houseSystemOverride \|\| houseSystem,?\s*\)/,
);

const { createSolarReturnRequestPayload } = await import(
  "../src/lib/solarReturnRequest.ts"
);
const explicitBirthData = {
  year: 1992,
  month: 8,
  day: 11,
  hour: 6,
  minute: 45,
  lat: -6.2088,
  lng: 106.8456,
  tz: 7,
};
assert.deepEqual(
  createSolarReturnRequestPayload(explicitBirthData, 2031, "W"),
  {
    type: "solar_return",
    birthData: explicitBirthData,
    transitDate: { year: 2031 },
    houseSystem: "W",
  },
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

async function reserveAvailablePort() {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  await new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  });
  return address.port;
}

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function captureServerOutput(child) {
  let output = "";
  let startupError = null;
  const append = (chunk) => {
    output = `${output}${chunk}`.slice(-30_000);
  };
  child.stdout.on("data", append);
  child.stderr.on("data", append);
  child.on("error", (error) => {
    startupError = error;
    append(`\n${error.stack || error.message}\n`);
  });
  return {
    readOutput: () => output,
    readStartupError: () => startupError,
  };
}

async function waitForRenderedRoute(child, url, readOutput, readStartupError) {
  const deadline = Date.now() + 60_000;
  let lastFailure = "No response received";

  while (Date.now() < deadline) {
    const startupError = readStartupError();
    if (startupError) {
      throw new Error(`Next dev failed to start: ${startupError.message}\n${readOutput()}`);
    }
    if (child.exitCode !== null) {
      throw new Error(
        `Next dev exited with code ${child.exitCode} before rendering ${url}.\n${readOutput()}`,
      );
    }

    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(3_000) });
      const html = await response.text();
      if (response.ok) return html;
      lastFailure = `HTTP ${response.status}: ${html.slice(0, 500)}`;
    } catch (error) {
      lastFailure = error instanceof Error ? error.message : String(error);
    }

    await delay(250);
  }

  throw new Error(
    `Timed out waiting for ${url}: ${lastFailure}\nNext dev output:\n${readOutput()}`,
  );
}

async function stopServer(child) {
  if (child.exitCode !== null || !child.pid) return;

  const exited = once(child, "exit");
  try {
    process.kill(-child.pid, "SIGTERM");
  } catch {
    child.kill("SIGTERM");
  }

  await Promise.race([exited, delay(5_000)]);
  if (child.exitCode !== null) return;

  try {
    process.kill(-child.pid, "SIGKILL");
  } catch {
    child.kill("SIGKILL");
  }
  await once(child, "exit");
}

function findElementEndById(html, id) {
  const escapedId = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const startPattern = new RegExp(
    `<([a-z][a-z0-9]*)\\b[^>]*\\bid=["']${escapedId}["'][^>]*>`,
    "i",
  );
  const start = startPattern.exec(html);
  assert.ok(start, `rendered element #${id} must exist`);

  const tagPattern = new RegExp(`<\\/?${start[1]}\\b[^>]*>`, "gi");
  tagPattern.lastIndex = start.index;
  let depth = 0;
  let match;
  while ((match = tagPattern.exec(html))) {
    if (match[0].startsWith("</")) {
      depth -= 1;
      if (depth === 0) return match.index + match[0].length;
    } else if (!match[0].endsWith("/>")) {
      depth += 1;
    }
  }
  throw new Error(`rendered element #${id} must have a closing tag`);
}

const port = await reserveAvailablePort();
const routeUrl = `http://127.0.0.1:${port}/solar-return`;
const nextServer = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "dev",
    "--hostname",
    "127.0.0.1",
    "--port",
    String(port),
  ],
  {
    cwd: process.cwd(),
    detached: true,
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  },
);
const { readOutput: readServerOutput, readStartupError } = captureServerOutput(nextServer);

try {
  const renderedHtml = await waitForRenderedRoute(
    nextServer,
    routeUrl,
    readServerOutput,
    readStartupError,
  );

  const renderedMains = [...renderedHtml.matchAll(/<main\b[^>]*>/g)];
  assert.equal(renderedMains.length, 1);
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

  const calculatorEnd = findElementEndById(renderedHtml, "solar-return-calculator");
  const guideStart = renderedHtml.indexOf('id="solar-return-guide"');
  assert.ok(guideStart > calculatorEnd, "SEO guide must render after the calculator and results");

  const routeChunkSources = [
    ...renderedHtml.matchAll(/<script[^>]*src="([^"]+)"[^>]*><\/script>/g),
  ]
    .map((match) => decodeHtml(match[1]))
    .filter((src) => src.includes("/app/solar-return/page") && src.includes(".js"));
  assert.ok(routeChunkSources.length > 0, "rendered route must expose its client page chunk");
  const routeClientBundle = (
    await Promise.all(
      routeChunkSources.map(async (src) => {
        const response = await fetch(new URL(src, routeUrl));
        assert.ok(response.ok, `client chunk ${src} must load`);
        return response.text();
      }),
    )
  ).join("\n");
  for (const faq of solarReturnFaqs) {
    assert.ok(!routeClientBundle.includes(faq.question));
    assert.ok(!routeClientBundle.includes(faq.answer));
  }
} finally {
  await stopServer(nextServer);
}

console.log(`Solar Return rendered content tests passed (${solarReturnFaqs.length} FAQ items)`);
