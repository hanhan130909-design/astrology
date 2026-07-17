import assert from "node:assert/strict";
import fs from "node:fs";

const {
  ANALYTICS_EVENT_NAMES,
  sanitizeAnalyticsEvent,
  trackAnalyticsEvent,
} = await import("../src/lib/analytics.ts");

assert.deepEqual(ANALYTICS_EVENT_NAMES, [
  "birth_form_start",
  "chart_generated",
  "chart_generation_error",
  "chart_shared",
]);

assert.deepEqual(
  sanitizeAnalyticsEvent("chart_generated", {
    chart_type: "natal",
    house_system: "B",
    name: "Private name",
    city: "Private city",
    birth_date: "1986-11-14",
  }),
  {
    name: "chart_generated",
    params: { chart_type: "natal", house_system: "B" },
  },
);
assert.deepEqual(
  sanitizeAnalyticsEvent("chart_generation_error", {
    chart_type: "solar_return",
    house_system: "P",
    error_category: "api_error",
    error_message: "private server response",
  }),
  {
    name: "chart_generation_error",
    params: {
      chart_type: "solar_return",
      house_system: "P",
      error_category: "api_error",
    },
  },
);
assert.equal(sanitizeAnalyticsEvent("not_allowed", {}), null);
assert.equal(
  sanitizeAnalyticsEvent("chart_shared", {
    chart_type: "natal",
    share_method: "private-recipient",
  }),
  null,
);

const calls = [];
globalThis.window = {
  gtag: (...args) => calls.push(args),
};
assert.equal(
  trackAnalyticsEvent("chart_shared", {
    chart_type: "natal",
    share_method: "copy_link",
    email: "private@example.com",
  }),
  true,
);
assert.deepEqual(calls, [[
  "event",
  "chart_shared",
  { chart_type: "natal", share_method: "copy_link" },
]]);
delete globalThis.window;

const natalSource = fs.readFileSync("src/app/natal/page.tsx", "utf8");
const solarSource = fs.readFileSync("src/components/SolarReturnCalculator.tsx", "utf8");
const nextConfigSource = fs.readFileSync("next.config.ts", "utf8");
for (const eventName of ANALYTICS_EVENT_NAMES) {
  assert.match(`${natalSource}\n${solarSource}`, new RegExp(eventName));
}
assert.match(natalSource, /requestChart\([^;]+,\s*["']user["']\)/);
assert.match(natalSource, /requestChart\([^;]+\);/);
assert.match(solarSource, /calculateSolarReturn\(null,\s*null,\s*null,\s*true\)/);
assert.doesNotMatch(natalSource, /trackAnalyticsEvent\([^\n]+(?:name|city|year|month|day|hour|minute|latitude|longitude|email)/);
assert.doesNotMatch(solarSource, /trackAnalyticsEvent\([^\n]+(?:birthData|cityName|bYear|bMonth|bDay|bHour|bMinute|birthLat|birthLng|email)/);
assert.match(nextConfigSource, /geolocation=\(self\)/);
assert.match(nextConfigSource, /connect-src[^";]*https:\/\/analytics\.google\.com/);
assert.match(nextConfigSource, /script-src[^";]*https:\/\/pagead2\.googlesyndication\.com/);

console.log("Analytics event tests passed");
