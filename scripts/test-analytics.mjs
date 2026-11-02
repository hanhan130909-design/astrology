import assert from "node:assert/strict";
import fs from "node:fs";

const {
  trackEvent,
  trackAnalyticsEvent,
  Analytics,
} = await import("../src/lib/analytics.ts");

// 旧 API（ANALYTICS_EVENT_NAMES / sanitizeAnalyticsEvent）已废弃，
// 现行为：trackEvent 直接透传给 gtag；PII 防护由调用方静态检查兜底（见文件底部）。

assert.equal(typeof trackEvent, "function");
assert.equal(trackAnalyticsEvent, trackEvent, "trackAnalyticsEvent 必须是 trackEvent 的别名");
assert.equal(typeof Analytics.featureClick, "function");
assert.equal(typeof Analytics.chartGenerated, "function");
assert.equal(typeof Analytics.pricingClick, "function");

// gtag 透传：事件名与参数原样送达
const calls = [];
globalThis.window = {
  gtag: (...args) => calls.push(args),
};

trackAnalyticsEvent("chart_shared", {
  chart_type: "natal",
  share_method: "copy_link",
});
assert.deepEqual(calls, [["event", "chart_shared", { chart_type: "natal", share_method: "copy_link" }]]);

// 无 gtag（SSR/未加载）时必须静默不抛错
delete globalThis.window;
assert.doesNotThrow(() => trackAnalyticsEvent("chart_generated", { chart_type: "natal" }));

// Analytics 预置 tracker 的事件名
globalThis.window = { gtag: (...args) => calls.push(args) };
calls.length = 0;
Analytics.featureClick("/natal");
Analytics.chartGenerated("bazi");
Analytics.pricingClick("vip_monthly");
assert.deepEqual(calls, [
  ["event", "feature_click", { feature: "/natal" }],
  ["event", "chart_generated", { type: "bazi" }],
  ["event", "pricing_click", { product: "vip_monthly" }],
]);
delete globalThis.window;

// —— PII 防护（静态检查：调用方不得把个人信息塞进事件参数）——
const natalSource = fs.readFileSync("src/app/natal/page.tsx", "utf8");
const solarSource = fs.readFileSync("src/components/SolarReturnCalculator.tsx", "utf8");
const nextConfigSource = fs.readFileSync("next.config.ts", "utf8");

assert.doesNotMatch(natalSource, /trackAnalyticsEvent\([^\n]+(?:name|city|year|month|day|hour|minute|latitude|longitude|email)/);
assert.doesNotMatch(solarSource, /trackAnalyticsEvent\([^\n]+(?:birthData|cityName|bYear|bMonth|bDay|bHour|bMinute|birthLat|birthLng|email)/);
assert.match(natalSource, /requestChart\([^;]+,\s*["']user["']\)/);
assert.match(natalSource, /requestChart\([^;]+\);/);
assert.match(solarSource, /calculateSolarReturn\(null,\s*null,\s*null,\s*true\)/);
assert.match(nextConfigSource, /geolocation=\(self\)/);
assert.match(nextConfigSource, /connect-src[^";]*https:\/\/analytics\.google\.com/);
assert.match(nextConfigSource, /script-src[^";]*https:\/\/pagead2\.googlesyndication\.com/);

console.log("Analytics event tests passed");
