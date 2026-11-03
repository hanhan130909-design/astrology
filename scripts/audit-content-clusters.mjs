// 内容簇审计：找出站内"同模板批量生成"的文章簇，量化重复度，
// 为合并/去重提供依据。只读，不改任何文件。
import { registerHooks } from "node:module";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (!specifier.startsWith("@/") || specifier.endsWith(".json"))
      return nextResolve(specifier, context);
    const sourceUrl = new URL(`../src/${specifier.slice(2)}.ts`, import.meta.url);
    return nextResolve(sourceUrl.href, context);
  },
});

const { seoArticles } = await import("../src/app/blog/seo-articles.ts");
const { moreSeoArticles } = await import("../src/app/blog/more-seo-articles.ts");
const { longtailSeoArticles } = await import("../src/app/blog/longtail-seo-articles.ts");
const { longtailSeoArticlesBatch2 } = await import("../src/app/blog/longtail-seo-articles-batch2.ts");
const { longtailSeoArticlesBatch3 } = await import("../src/app/blog/longtail-seo-articles-batch3.ts");
const { longtailSeoArticlesBatch4 } = await import("../src/app/blog/longtail-seo-articles-batch4.ts");
const { longtailSeoArticlesBatch5 } = await import("../src/app/blog/longtail-seo-articles-batch5.ts");
const { longtailSeoArticlesBatch6 } = await import("../src/app/blog/longtail-seo-articles-batch6.ts");
const { longtailSeoArticlesBatch7 } = await import("../src/app/blog/longtail-seo-articles-batch7.ts");
const { destinyArticles } = await import("../src/content/destiny-blog-articles.ts");

const all = [
  ...seoArticles,
  ...moreSeoArticles,
  ...longtailSeoArticles,
  ...longtailSeoArticlesBatch2,
  ...longtailSeoArticlesBatch3,
  ...longtailSeoArticlesBatch4,
  ...longtailSeoArticlesBatch5,
  ...longtailSeoArticlesBatch6,
  ...longtailSeoArticlesBatch7,
];

const words = (text) => {
  const tokens = String(text || "").match(/[A-Za-z0-9\u4e00-\u9fa5]+/g);
  return tokens ? tokens.length : 0;
};
const bodyOf = (a) => (a.content && (a.content.en || a.content.zh)) || "";
const enBody = (a) => (a.content && a.content.en) || "";
const stripTail = (s) => String(s || "").split(/\n---\n/)[0];

// 1) slug 前缀簇：去掉尾部数字与 -compatibility 等模板词后聚类
const SIGN = "aries|taurus|gemini|cancer|leo|virgo|libra|scorpio|sagittarius|capricorn|aquarius|pisces";

const clusterRules = [
  { name: "compatibility 配对", re: new RegExp(`^(${SIGN})-(${SIGN})-compatibility-\\d+$`) },
  { name: "生肖配对", re: /^(?:rat|ox|tiger|rabbit|dragon|snake|horse|goat|monkey|rooster|dog|pig)-[\w-]*\d*$/ },
  { name: "moon-in 系列", re: /^moon-in-[\w-]+-\d+$/ },
  { name: "星座单页", re: new RegExp(`^(${SIGN})-[\\w-]*-\\d+$`) },
  { name: "数字能量", re: /^(?:angel-number|life-path|numerology)[\w-]*-?\d*$/ },
];

const bySlug = new Map();
for (const a of all) if (!bySlug.has(a.slug)) bySlug.set(a.slug, a);

console.log(`总文章数: ${all.length}（去重 slug 后 ${bySlug.size}）`);

// 2) 正文去重：扣除 Related 尾巴后按正文指纹聚合
const fp = new Map();
for (const a of all) {
  const key = stripTail(enBody(a)).replace(/\s+/g, " ").trim().slice(0, 400);
  if (!fp.has(key)) fp.set(key, []);
  fp.get(key).push(a.slug);
}
const dupGroups = [...fp.values()].filter((g) => g.length > 1);
const dupArticles = dupGroups.reduce((n, g) => n + g.length, 0);
console.log(
  `正文前 400 字符完全相同的组: ${dupGroups.length} 组，涉及 ${dupArticles} 篇（占 ${((dupArticles / all.length) * 100).toFixed(1)}%）`,
);
console.log("最大重复组 TOP 5:");
dupGroups
  .sort((x, y) => y.length - x.length)
  .slice(0, 5)
  .forEach((g, i) => console.log(`  ${i + 1}. ${g.length} 篇  e.g. ${g.slice(0, 3).join(", ")}`));

// 3) 各簇统计
console.log("\n=== 模板簇 ===");
for (const rule of clusterRules) {
  const hits = all.filter((a) => rule.re.test(a.slug));
  if (!hits.length) continue;
  const uniq = new Set(hits.map((a) => a.slug));
  const wc = hits.map((a) => words(enBody(a))).sort((x, y) => x - y);
  const med = wc[Math.floor(wc.length / 2)] || 0;
  console.log(
    `${rule.name.padEnd(16)} ${String(uniq.size).padStart(4)} 篇  英文词数中位数 ${String(med).padStart(4)}  起 ${wc[0] ?? 0} 止 ${wc[wc.length - 1] ?? 0}`,
  );
}

// 4) 标题模板重复：把标题里的星座名替换掉看骨架
const titleSkeleton = (a) => {
  const t = String((a.title && (a.title.en || a.title.zh)) || "");
  return t
    .replace(new RegExp(`\\b(${SIGN})\\b`, "gi"), "<SIGN>")
    .replace(/\b\d{4}\b/g, "<YEAR>")
    .replace(/[♈-♓]/g, "<GLYPH>")
    .replace(/\s+/g, " ")
    .trim();
};
const sk = new Map();
for (const a of all) {
  const k = titleSkeleton(a);
  if (!sk.has(k)) sk.set(k, 0);
  sk.set(k, sk.get(k) + 1);
}
console.log("\n=== 标题骨架 TOP 8（同模板覆盖篇数）===");
[...sk.entries()]
  .sort((x, y) => y[1] - x[1])
  .slice(0, 8)
  .forEach(([k, n], i) => console.log(`${i + 1}. ${String(n).padStart(4)} 篇  ${k.slice(0, 90)}`));

// 5) 词数分布
const buckets = [
  ["0-99", 0, 99],
  ["100-299", 100, 299],
  ["300-449", 300, 449],
  ["450-799", 450, 799],
  ["800+", 800, Infinity],
];
const allWc = all.map((a) => words(enBody(a)));
console.log("\n=== 英文正文词数分布 ===");
for (const [label, lo, hi] of buckets) {
  const n = allWc.filter((w) => w >= lo && w <= hi).length;
  console.log(`${label.padEnd(10)} ${String(n).padStart(5)} 篇  ${((n / all.length) * 100).toFixed(1)}%`);
}
const sorted = [...allWc].sort((a, b) => a - b);
console.log(`中位数 ${sorted[Math.floor(sorted.length / 2)]} 词，均值 ${(allWc.reduce((a, b) => a + b, 0) / all.length).toFixed(0)} 词`);

// 6) 配对簇明细（供合并方案使用）
const pairRule = clusterRules[0].re;
const pairs = all.filter((a) => pairRule.test(a.slug));
console.log(`\n=== compatibility 配对簇明细（${pairs.length} 篇）===`);
const pairKeys = new Set();
for (const a of pairs) {
  const m = a.slug.match(pairRule);
  pairKeys.add([m[1], m[2]].sort().join("-"));
}
console.log(`唯一无序对: ${pairKeys.size} 组（$12 选 2 = 66，含同座自配对应为 78）`);
const selfPairs = [...pairKeys].filter((k) => {
  const [x, y] = k.split("-");
  return x === y;
});
console.log(`自配对(同座): ${selfPairs.length} 组`);
