import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import fs from "node:fs";
import { createServer } from "node:net";

const pagePath = "src/app/solar-return/page.tsx";
const layoutPath = "src/app/solar-return/layout.tsx";
const calculatorPath = "src/components/SolarReturnCalculator.tsx";
const componentPath = "src/components/SolarReturnSeoContent.tsx";
const faqDataPath = "src/components/solarReturnFaq.ts";
const requestHelperPath = "src/lib/solarReturnRequest.ts";
const nextConfigPath = "next.config.ts";
const tsconfigPath = "tsconfig.json";

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
assert.equal(
  packageJson.scripts?.["test:solar-return-content"],
  "node --experimental-strip-types scripts/test-solar-return-content.mjs",
);

assert.ok(fs.existsSync(requestHelperPath), "pure Solar Return request helper must exist");
assert.ok(fs.existsSync(calculatorPath), "interactive calculator must remain a client child");
assert.ok(fs.existsSync(componentPath), "SolarReturnSeoContent.tsx must exist");
assert.ok(fs.existsSync(faqDataPath), "shared Solar Return FAQ data must exist");

const nextConfigSource = fs.readFileSync(nextConfigPath, "utf8");
assert.match(
  nextConfigSource,
  /distDir:\s*process\.env\.NEXT_DIST_DIR\s*\|\|\s*["']\.next["']/,
);
assert.match(
  nextConfigSource,
  /tsconfigPath:\s*process\.env\.NEXT_TSCONFIG_PATH\s*\|\|\s*["']tsconfig\.json["']/,
);

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

const productionCacheProbePaths = [
  ".next/BUILD_ID",
  ".next/build-manifest.json",
  ".next/routes-manifest.json",
  ".next/prerender-manifest.json",
];

function hashFile(path) {
  return createHash("sha256").update(fs.readFileSync(path)).digest("hex");
}

function snapshotProductionCache() {
  if (!fs.existsSync(".next")) return { exists: false };

  const stat = fs.statSync(".next");
  return {
    exists: true,
    directoryMtimeMs: stat.mtimeMs,
    probes: Object.fromEntries(
      productionCacheProbePaths
        .filter((path) => fs.existsSync(path))
        .map((path) => [path, hashFile(path)]),
    ),
  };
}

class NextDevStartupError extends Error {
  constructor(message, addressInUse) {
    super(message);
    this.name = "NextDevStartupError";
    this.addressInUse = addressInUse;
  }
}

function startNextDevServer(port, distDir, temporaryTsconfigPath) {
  const child = spawn(
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
      env: {
        ...process.env,
        NEXT_DIST_DIR: distDir,
        NEXT_TSCONFIG_PATH: temporaryTsconfigPath,
        NEXT_TELEMETRY_DISABLED: "1",
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  let output = "";
  let startupError = null;
  let exitResult = null;
  let resolveExited;
  const exited = new Promise((resolve) => {
    resolveExited = resolve;
  });
  const appendOutput = (chunk) => {
    output = `${output}${chunk}`.slice(-30_000);
  };

  child.stdout.on("data", appendOutput);
  child.stderr.on("data", appendOutput);
  child.once("exit", (code, signal) => {
    exitResult = { code, signal, error: null };
    resolveExited(exitResult);
  });
  child.once("error", (error) => {
    startupError = error;
    appendOutput(`\n${error.stack || error.message}\n`);
    exitResult = { code: null, signal: null, error };
    resolveExited(exitResult);
  });

  let cleanupPromise = null;
  const signalHandlers = new Map();
  const removeSignalHandlers = () => {
    for (const [signal, handler] of signalHandlers) {
      process.off(signal, handler);
    }
    signalHandlers.clear();
  };
  const waitForExit = async (timeoutMs) => Promise.race([
    exited.then((result) => ({ exited: true, result })),
    delay(timeoutMs).then(() => ({ exited: false, result: null })),
  ]);

  const cleanup = () => {
    if (cleanupPromise) return cleanupPromise;
    cleanupPromise = (async () => {
      let cleanupError = null;
      try {
        if (!exitResult && child.pid) {
          child.kill("SIGTERM");
          let outcome = await waitForExit(5_000);
          if (!outcome.exited) {
            child.kill("SIGKILL");
            outcome = await waitForExit(5_000);
          }
          if (!outcome.exited) {
            cleanupError = new Error(
              `Next dev did not exit after TERM/KILL escalation.\n${output}`,
            );
          }
        }
      } catch (error) {
        cleanupError = error;
      } finally {
        removeSignalHandlers();
        fs.rmSync(distDir, { recursive: true, force: true });
        fs.rmSync(temporaryTsconfigPath, { force: true });
      }
      if (cleanupError) throw cleanupError;
    })();
    return cleanupPromise;
  };

  const signalExitCodes = new Map([
    ["SIGINT", 130],
    ["SIGTERM", 143],
    ["SIGHUP", 129],
  ]);
  for (const [signal, exitCode] of signalExitCodes) {
    const handler = () => {
      void cleanup().finally(() => process.exit(exitCode));
    };
    signalHandlers.set(signal, handler);
    process.once(signal, handler);
  }

  return {
    child,
    cleanup,
    readExitResult: () => exitResult,
    readOutput: () => output,
    readStartupError: () => startupError,
  };
}

function isAddressInUse(value) {
  return /EADDRINUSE|address already in use/i.test(value);
}

async function waitForRenderedRoute(server, url) {
  const deadline = Date.now() + 60_000;
  let lastFailure = "No response received";

  while (Date.now() < deadline) {
    const startupError = server.readStartupError();
    if (startupError) {
      const diagnostic = `Next dev failed to start: ${startupError.message}\n${server.readOutput()}`;
      throw new NextDevStartupError(diagnostic, isAddressInUse(diagnostic));
    }
    const exitResult = server.readExitResult();
    if (exitResult) {
      const diagnostic =
        `Next dev exited before rendering ${url}: ${JSON.stringify(exitResult)}\n${server.readOutput()}`;
      throw new NextDevStartupError(
        diagnostic,
        isAddressInUse(diagnostic),
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
    `Timed out waiting for ${url}: ${lastFailure}\nNext dev output:\n${server.readOutput()}`,
  );
}

async function fetchRouteClientBundle(renderedHtml, routeUrl) {
  const routeChunkSources = [
    ...renderedHtml.matchAll(/<script[^>]*src="([^"]+)"[^>]*><\/script>/g),
  ]
    .map((match) => decodeHtml(match[1]))
    .filter((src) => src.includes("/app/solar-return/page") && src.includes(".js"));
  assert.ok(routeChunkSources.length > 0, "rendered route must expose its client page chunk");
  return (
    await Promise.all(
      routeChunkSources.map(async (src) => {
        const response = await fetch(new URL(src, routeUrl));
        assert.ok(response.ok, `client chunk ${src} must load`);
        return response.text();
      }),
    )
  ).join("\n");
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

const productionCacheBefore = snapshotProductionCache();
const createdTestDistDirs = [];
const createdTemporaryTsconfigs = [];
let renderedHtml;
let routeClientBundle;
let lastPortError = null;

for (let attempt = 1; attempt <= 3; attempt += 1) {
  const port = await reserveAvailablePort();
  const routeUrl = `http://127.0.0.1:${port}/solar-return`;
  const distDir = `.next-test-solar-return-${process.pid}-${attempt}-${randomBytes(5).toString("hex")}`;
  const temporaryTsconfigPath = `${distDir}-tsconfig.json`;
  createdTestDistDirs.push(distDir);
  createdTemporaryTsconfigs.push(temporaryTsconfigPath);
  assert.ok(!fs.existsSync(distDir));
  assert.ok(!fs.existsSync(temporaryTsconfigPath));
  fs.copyFileSync(tsconfigPath, temporaryTsconfigPath);
  const server = startNextDevServer(port, distDir, temporaryTsconfigPath);

  try {
    renderedHtml = await waitForRenderedRoute(server, routeUrl);
    routeClientBundle = await fetchRouteClientBundle(renderedHtml, routeUrl);
    lastPortError = null;
  } catch (error) {
    if (error instanceof NextDevStartupError && error.addressInUse && attempt < 3) {
      lastPortError = error;
    } else {
      throw error;
    }
  } finally {
    await server.cleanup();
    assert.ok(!fs.existsSync(distDir), `${distDir} must be removed after the test attempt`);
    assert.ok(
      !fs.existsSync(temporaryTsconfigPath),
      `${temporaryTsconfigPath} must be removed after the test attempt`,
    );
    assert.deepEqual(
      snapshotProductionCache(),
      productionCacheBefore,
      "focused route test must not modify the normal .next production cache",
    );
  }

  if (renderedHtml) break;
}

if (!renderedHtml) throw lastPortError || new Error("Unable to start Next dev after 3 attempts");

try {
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

  for (const faq of solarReturnFaqs) {
    assert.ok(!routeClientBundle.includes(faq.question));
    assert.ok(!routeClientBundle.includes(faq.answer));
  }
} finally {
  for (const distDir of createdTestDistDirs) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  for (const temporaryTsconfigPath of createdTemporaryTsconfigs) {
    fs.rmSync(temporaryTsconfigPath, { force: true });
  }
}

assert.ok(createdTestDistDirs.every((distDir) => !fs.existsSync(distDir)));
assert.ok(
  createdTemporaryTsconfigs.every((temporaryTsconfigPath) => !fs.existsSync(temporaryTsconfigPath)),
);
assert.deepEqual(snapshotProductionCache(), productionCacheBefore);

console.log(`Solar Return rendered content tests passed (${solarReturnFaqs.length} FAQ items)`);
